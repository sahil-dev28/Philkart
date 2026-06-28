import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

import type { Request, Response } from "express";
import { Types, type QueryFilter } from "mongoose";

import { Category } from "@/models/Category";
import { Product, type ProductAttrs } from "@/models/Product";
import { decodeCursor, encodeCursor } from "@/utils/cursor";
import {
  generateProductsWithPromise,
  generateProductsWithStreaming,
  generateProductsWithWorker,
} from "@/utils/generateProduct";

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { category: categoryName, ...rest } = req.body;

    const categoryDoc = await Category.findOne({ name: categoryName });

    if (!categoryDoc) {
      res.status(400).json({ message: `Category "${categoryName}" not found` });
      return;
    }

    const newProduct = new Product({ ...rest, category: categoryDoc._id });

    await newProduct.save();

    res.status(200).json({ message: "Product created" });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Generate the full batch in memory, then respond
export const generateProductsBuffered = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { count } = req.query;
  const numberCount = Number(count);

  if (Number.isNaN(numberCount)) {
    res.status(400).json({
      error: "Count should be a number",
    });
  }

  try {
    await generateProductsWithPromise(numberCount);
    res.status(200).json({
      message: "Product generated with Promise",
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Stream products to the client as they are generated
export const streamProducts = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  res.setHeader("Content-Type", "application/json");
  try {
    await pipeline(Readable.from(generateProductsWithStreaming(10000)), res);
  } catch {
    if (!res.headersSent) res.status(500).end();
  }
};

// Generate products in parallel across worker threads
export const generateProductsParallel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { count } = req.query;
  const numberCount = Number(count);

  if (Number.isNaN(numberCount)) {
    res.status(400).json({
      error: "Count should be a number",
    });
  }

  try {
    await generateProductsWithWorker(numberCount);
    res.status(200).json({
      message: "Product generated with Worker Thread",
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const SORT_FIELDS = {
  newest: { field: "createdAt", dir: -1 },
  oldest: { field: "createdAt", dir: 1 },
  aToZ: { field: "name", dir: 1 },
  zToA: { field: "name", dir: -1 },
  highest: { field: "price", dir: -1 },
  lowest: { field: "price", dir: 1 },
} as const;


const castValue = (field: string, v: string | number): Date | number | string =>
  field === "createdAt"
    ? new Date(v)
    : field === "price"
      ? Number(v)
      : String(v);


const serializeValue = (field: string, val: unknown): string | number =>
  field === "createdAt"
    ? (val as Date).toISOString()
    : (val as string | number);


const keysetFilter = (
  field: string,
  op: "$gt" | "$lt",
  value: Date | number | string,
  id: Types.ObjectId,
): QueryFilter<ProductAttrs> => ({
  $or: [{ [field]: { [op]: value } }, { [field]: value, _id: { [op]: id } }],
});

export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Page size is driven by the request; defaults to 20, capped at 100.
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const sortKey = (req.query.sort as keyof typeof SORT_FIELDS) || "newest";
    const { field, dir } = SORT_FIELDS[sortKey] ?? SORT_FIELDS.newest;
    const category = req.query.category as string | undefined;
    const cursorRaw = req.query.cursor as string | undefined;
    const anchorRaw = req.query.anchor as string | undefined;

    const direction = req.query.direction === "before" ? "before" : "after";

    const baseFilter: QueryFilter<ProductAttrs> = category ? { category } : {};

    const afterOp = dir === 1 ? "$gt" : "$lt";
    const beforeOp = dir === 1 ? "$lt" : "$gt";

    const positionOf = (value: Date | number | string, id: Types.ObjectId) =>
      Product.countDocuments({
        ...baseFilter,
        ...keysetFilter(field, beforeOp, value, id),
      });

    const anchor = anchorRaw ? decodeCursor(anchorRaw) : null;

    let data: Record<string, unknown>[];
   
    let offset: number;

    if (anchor) {

      const anchorPos = await positionOf(
        castValue(field, anchor.v),
        new Types.ObjectId(anchor.id),
      );
      offset = Math.floor(anchorPos / limit) * limit;
      data = (await Product.find(baseFilter)
        .populate("category", "name slug")
        .sort({ [field]: dir, _id: dir })
        .skip(offset)
        .limit(limit)
        .lean()) as unknown as Record<string, unknown>[];
    } else {
      const cursor = cursorRaw ? decodeCursor(cursorRaw) : null;
      let filter: QueryFilter<ProductAttrs> = baseFilter;
   
      let scanDir = dir;
      if (cursor) {
        const value = castValue(field, cursor.v);
        const id = new Types.ObjectId(cursor.id);
        if (direction === "before") {
          filter = { ...baseFilter, ...keysetFilter(field, beforeOp, value, id) };
          scanDir = (dir * -1) as 1 | -1;
        } else {
          filter = { ...baseFilter, ...keysetFilter(field, afterOp, value, id) };
        }
      }

      const rows = (await Product.find(filter)
        .populate("category", "name slug")
        .sort({ [field]: scanDir, _id: scanDir })
        .limit(limit)
        .lean()) as unknown as Record<string, unknown>[];

      // Restore display order for reverse ("before") scans.
      data = scanDir === dir ? rows : rows.reverse();
      const head = data[0];
      offset = head
        ? await positionOf(
            head[field] as Date | number | string,
            new Types.ObjectId(String(head._id)),
          )
        : 0;
    }

    const first = data[0];
    const last = data[data.length - 1];
    const cursorFor = (row: typeof first) =>
      row
        ? encodeCursor({
            v: serializeValue(field, (row as Record<string, unknown>)[field]),
            id: String(row._id),
          })
        : null;

    const total = await Product.countDocuments(baseFilter);

    res.status(200).json({
      data,
      firstCursor: cursorFor(first),
      lastCursor: cursorFor(last),
      offset,
      total,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
