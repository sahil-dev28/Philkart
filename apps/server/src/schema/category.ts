import { z } from "zod";

export const categoryNames = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Books",
  "Sports",
  "Toys",
  "Grocery",
] as const;

export const createCategorySchema = z.object({
  name: z.enum(categoryNames, {
    error: (issue) =>
      issue.input === undefined
        ? "Category name is required"
        : `Categort must be one of ${categoryNames.join(", ")}`,
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
