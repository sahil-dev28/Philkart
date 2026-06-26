import type { Request, Response } from "express";

import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { category, ...rest } = req.body;

    const categoryDoc = await Category.findOne({ name: category });

    if (!categoryDoc) {
      res.status(400).json({ message: "Invalid category" });
    }

    const newProduct = new Product({
      ...rest,
      categoryId: categoryDoc?._id,
    });

    await newProduct.save();

    res.status(200).json({ message: "Product created" });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
