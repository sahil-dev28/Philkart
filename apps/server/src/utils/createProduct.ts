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

export const createProducts = async (
  total: number,
  batchSize = 1000
): Promise<CreateProductInput[]> => {
  const result: CreateProductInput[] = [];

  for (let i = 0; i < total; i++) {
    result.push(createProduct());

    // Yield to the event loop after each batch so we don't block it.
    // setImmediate schedules a macrotask, letting pending I/O (e.g. other
    // incoming requests) run between batches.
    if ((i + 1) % batchSize === 0) {
      await new Promise<void>((resolve) => setImmediate(resolve));
    }
  }

  return result;
};
