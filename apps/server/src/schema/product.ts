import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string(),
  category: z.enum([
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Books",
    "Sports",
    "Toys",
    "Grocery",
  ]),
  price: z.number(),
  image: z.any().refine((val) => val instanceof File, {
    message: "Product image is required",
  }),
  description: z
    .string()
    .min(10, "Description must be at least 20 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
