import { parentPort } from "node:worker_threads";

import { createProduct } from "@/utils/createProduct";

export const createProducts = async (total, batchSize = 1000) => {
  const result = [];

  for (let i = 0; i < total; i++) {
    result.push(createProduct());

    if ((i + 1) % batchSize === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
  }

  return result;
};

parentPort.on("message", async (data) => {
  const result = await createProducts(data.total, data.batchSize);
  parentPort?.postMessage(result);
});
