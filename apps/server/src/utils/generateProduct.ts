import { Worker } from "node:worker_threads";

import { faker } from "@faker-js/faker";

import { categoryNames } from "@/schema/category";

import type { CreateProductInput } from "../schema/product";

export const generateProduct = () => {
  return {
    name: faker.commerce.productName().slice(0, 30),
    category: faker.helpers.arrayElement(categoryNames),
    price: Number(faker.commerce.price({ min: 100, max: 100000 })),
    image: faker.image.urlPicsumPhotos(),
    description: faker.commerce.productDescription(),
  };
};

// Generating Products With Promise
export const generateProductsWithPromise = async (
  total: number,
  batchSize = 1000,
): Promise<CreateProductInput[]> => {
  const result: CreateProductInput[] = [];

  for (let i = 0; i < total; i++) {
    result.push(generateProduct());

    if ((i + 1) % batchSize === 0) {
      await new Promise<void>((resolve) => setImmediate(resolve));
    }
  }

  return result;
};

// Generating Products With Streaming
export async function* generateProductsWithStreaming(
  total: number,
  batchSize = 100,
) {
  yield '{"products":[';

  let firstChunk = true;
  let batch: string[] = [];

  for (let i = 0; i < total; i++) {
    batch.push(JSON.stringify(generateProduct()));

    if (batch.length === batchSize) {
      yield (firstChunk ? "" : ",") + batch.join(",");
      batch = [];
      firstChunk = false;
      await new Promise((resolve) => setImmediate(resolve)); // hand control back to the event loop
    }
  }

  if (batch.length > 0) {
    yield (firstChunk ? "" : ",") + batch.join(",");
  }

  yield "]}";
}

// Generating Products With Worker Thread
const TOTAL = 100000;
const BATCH_SIZE = 1000;
const THREAD_COUNT = 4;

export function generateProductsWithWorker(): Promise<CreateProductInput[]> {
  return new Promise((resolve, reject) => {
    const perThread = Math.ceil(TOTAL / THREAD_COUNT);

    let completed = 0;
    let settled = false;
    const results: CreateProductInput[] = [];

    for (let i = 0; i < THREAD_COUNT; i++) {
      const worker = new Worker(
        new URL("../worker/worker-product.js", import.meta.url),
      );

      worker.on("message", (data: CreateProductInput[]) => {
        results.push(...data);
        completed++;
        worker.terminate(); // terminate AFTER it returns results

        if (completed === THREAD_COUNT && !settled) {
          settled = true;
          resolve(results);
        }
      });

      worker.on("error", (error) => {
        if (!settled) {
          settled = true;
          reject(error);
        }
        worker.terminate();
      });

      worker.postMessage({
        total: perThread,
        batchSize: BATCH_SIZE,
      });
    }
  });
}
