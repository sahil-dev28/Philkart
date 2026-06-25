import type { Request, Response } from "express";

import { Category } from "../models/Category";

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
