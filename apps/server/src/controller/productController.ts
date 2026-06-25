import type { Request, Response } from "express";

import { Product } from "../models/Product";

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const newProduct = new Product(req.body);

    await newProduct.save();

    res.status(200).json({ message: "Product created" });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
