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

  await generateProductsWithPromise(numberCount);
  res.status(200).json({
    message: "Product generated with promise",
  });
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
    // else: stream already started, let pipeline clean up the streams
  }
};

// Generate products in parallel across worker threads
export const generateProductsParallel = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const products = await generateProductsWithWorker();
  res.status(200).json({
    products,
  });
};
