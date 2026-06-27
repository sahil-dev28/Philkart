import { parentPort } from "node:worker_threads";

import { env } from "@philkart/env/server";
import mongoose from "mongoose";

import { generateProduct } from "@/utils/generateProduct";

import { Product } from "../models/Product";

const batchSize = 1000;

const generateProducts = async (total, categories) => {
  let batch = [];

  for (let i = 0; i < total; i++) {
    const { name, category, image, price, description } = generateProduct();
    const categoryId = categories.get(category);

    if (categoryId) {
      batch.push({ name, category: categoryId, price, image, description });
    }

    if (batch.length === batchSize) {
      await Product.insertMany(batch, { ordered: false });
      batch = [];
    }
  }

  if (batch.length > 0) {
    await Product.insertMany(batch, { ordered: false });
  }
};

parentPort.on("message", async (data) => {
  try {
    await mongoose.connect(env.DATABASE_URL);
    await generateProducts(data.total, data.categories);
    parentPort?.postMessage({ message: "Work done" });
  } catch (error) {
    parentPort?.postMessage({
      error: error instanceof Error ? error.message : "Unknown worker error",
    });
  } finally {
    await mongoose.disconnect();
  }
});
