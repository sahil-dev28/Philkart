import { faker } from "@faker-js/faker";
import { categoryNames } from "@/schema/category";
import type { CreateProductInput } from "../schema/product";

export const createProduct = () => {
  return {
    name: faker.commerce.productName().slice(0, 30),
    category: faker.helpers.arrayElement(categoryNames),
    price: Number(faker.commerce.price({ min: 100, max: 100000 })),
    image: faker.image.urlPicsumPhotos(),
    description: faker.commerce.productDescription(),
  };
};

// export const createProducts = async (
//   total: number,
//   batchSize = 1000,
// ): Promise<CreateProductInput[]> => {
//   const result: CreateProductInput[] = [];

//   for (let i = 0; i < total; i++) {
//     result.push(createProduct());

//     if ((i + 1) % batchSize === 0) {
//       await new Promise<void>((resolve) => setImmediate(resolve));
//     }
//   }

//   return result;
// };

export async function* createProducts(total: number, batchSize = 1000) {
  yield '{"products":[';

  let firstChunk = true;
  let batch: string[] = [];

  for (let i = 0; i < total; i++) {
    batch.push(JSON.stringify(createProduct()));

    if (batch.length === batchSize) {
      yield (firstChunk ? "" : ",") + batch.join(",");
      batch = [];
      firstChunk = false;
    }
  }

  if (batch.length > 0) {
    yield (firstChunk ? "" : ",") + batch.join(",");
  }

  yield "]}";
}
