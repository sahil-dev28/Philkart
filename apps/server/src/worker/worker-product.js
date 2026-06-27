import { parentPort } from "node:worker_threads";

import { generateProduct } from "@/utils/generateProduct";

export const generateProducts = async (total, batchSize = 1000) => {
  const result = [];

  for (let i = 0; i < total; i++) {
    result.push(generateProduct());

    if ((i + 1) % batchSize === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
  }

  return result;
};

parentPort.on("message", async (data) => {
  const result = await generateProducts(data.total, data.batchSize);
  parentPort?.postMessage(result);
});
