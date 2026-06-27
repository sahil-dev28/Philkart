import { api } from "@/lib/axios";
import type {
  CategoriesResponse,
  GetProductsParams,
  ProductsResponse,
} from "@/types/product";

export async function getProducts(
  params: GetProductsParams,
): Promise<ProductsResponse> {
  const { page, limit, sort, category } = params;

  const { data } = await api.get<ProductsResponse>("/products", {
    params: {
      page,
      limit,
      sort,
      ...(category ? { category } : {}),
    },
  });

  return data;
}

export async function getCategories(): Promise<CategoriesResponse> {
  const { data } = await api.get<CategoriesResponse>("/category");
  return data;
}

export async function generatePromise(count: number): Promise<void> {
  await api.get("/products/promise", { params: { count } });
}

export async function generateWorker(count: number): Promise<void> {
  await api.get("/products/worker", { params: { count } });
}
