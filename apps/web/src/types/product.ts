export type Sort = "newest" | "oldest" | "aToZ" | "zToA" | "highest" | "lowest";

export type GenerationMethod = "promise" | "worker";

export type Direction = "after" | "before";

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category | null;
  price: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  firstCursor: string | null;
  lastCursor: string | null;
  offset: number;
  total: number;
}

export interface CategoriesResponse {
  data: Category[];
}

export interface GetProductsParams {
  cursor?: string | null;
  direction?: Direction;
  anchor?: string | null;
  limit: number;
  sort: Sort;
  category?: string;
}
