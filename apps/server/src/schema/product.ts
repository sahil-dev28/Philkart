import { z } from "zod";
import { categoryNames } from "./category";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name cannot exceed 30 characters"),
  category: z.enum(categoryNames),
  price: z.number(),
  image: z.any().refine((val) => val instanceof File, {
    message: "Product image is required",
  }),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
