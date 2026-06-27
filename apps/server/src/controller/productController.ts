import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

import type { Request, Response } from "express";

import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
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

const SORTABLE = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  aToZ: {
    name: -1,
  },
  zToA: {
    name: 1,
  },
  highest: {
    price: -1,
  },
  lowest: {
    price: 1,
  },
} as const;

export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const sort = req.query.sort as keyof typeof SORTABLE;

    const sortingOption = SORTABLE[sort || "newest"];

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Product.find({}).sort(sortingOption).skip(skip).limit(limit).lean(),
      Product.countDocuments({}),
    ]);

    res.status(200).json({
      page,
      total,
      data,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
