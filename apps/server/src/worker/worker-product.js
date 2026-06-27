import { parentPort } from "node:worker_threads";

import { generateProduct } from "@/utils/generateProduct";

export const generateProducts = async (total, categoryList) => {
  const categoryIdByName = new Map(
    categoryList.map((cat) => [cat.name, cat._id]),
  );
  const batch = [];

  for (let i = 0; i < total; i++) {
    const { name, category, image, price, description } = generateProduct();
    const categoryId = categoryIdByName.get(category);
    // result.push(generateProduct());

    if (categoryId) {
      batch.push({ name, category: categoryId, price, image, description });
    }
  }

  return batch;
};

parentPort.on("message", async (data) => {
  const result = await generateProducts(data.total, data.batchSize);
  parentPort?.postMessage(result);
});
