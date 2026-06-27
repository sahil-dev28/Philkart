import type { Request, Response } from "express";

import { Category } from "../models/Category";

export const getCategories = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await Category.find({}, { name: 1, slug: 1 })
      .sort({ name: 1 })
      .lean();

    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name } = req.body as { name: string };
  try {
    const newCategory = new Category({
      name,
      slug: name.split(" ").join("-").toLocaleLowerCase(),
    });

    await newCategory.save();

    res.status(200).json({ message: "Category created" });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
