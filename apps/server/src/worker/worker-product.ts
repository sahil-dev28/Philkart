import { parentPort } from "node:worker_threads";

import { env } from "@philkart/env/server";
import mongoose, { Types } from "mongoose";

import { Product, type ProductAttrs } from "@/models/Product";
import { generateProduct } from "@/utils/generateProduct";

const batchSize = 1000;

type ProductSeed = Omit<ProductAttrs, "createdAt" | "updatedAt">;

type WorkerInput = {
  total: number;
  categories: Map<string, string>;
};

const generateProducts = async (
  total: number,
  categories: Map<string, string>,
): Promise<void> => {
  let batch: ProductSeed[] = [];

  for (let i = 0; i < total; i++) {
    const { name, category, image, price, description } = generateProduct();
    const categoryId = categories.get(category);

    if (categoryId) {
      batch.push({
        name,
        category: new Types.ObjectId(categoryId),
        price,
        image,
        description,
      });
    }

    if (batch.length === batchSize) {
      await Product.insertMany<ProductSeed>(batch, { ordered: false });
      batch = [];
    }
  }

  if (batch.length > 0) {
    await Product.insertMany<ProductSeed>(batch, { ordered: false });
  }
};

if (!parentPort) {
  throw new Error("worker-product must be run as a worker thread");
}

parentPort.on("message", async (data: WorkerInput) => {
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
