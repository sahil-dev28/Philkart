import { Schema, Types, model, type InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide name"],
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "Please select category"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes for keyset (cursor) pagination — each sort field paired with
// _id as a stable tiebreaker. A single ascending index serves both sort
// directions (Mongo reverse-scans for descending sorts).
productSchema.index({ createdAt: 1, _id: 1 });
productSchema.index({ name: 1, _id: 1 });
productSchema.index({ price: 1, _id: 1 });
// Category-filtered browsing (optional optimization for large datasets).
productSchema.index({ category: 1, createdAt: 1, _id: 1 });
productSchema.index({ category: 1, name: 1, _id: 1 });
productSchema.index({ category: 1, price: 1, _id: 1 });

export type ProductAttrs = InferSchemaType<typeof productSchema>;

export const Product = model("Product", productSchema);
