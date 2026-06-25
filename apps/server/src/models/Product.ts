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
      required: [true, ""],
    },
    image: {
      type: String,
      required: [true, ""],
    },
    description: {
      type: String,
      required: [true, ""],
    },
  },
  {
    timestamps: true,
  },
);

export type ProductAttrs = InferSchemaType<typeof productSchema>;

export const Product = model("Product", productSchema);
