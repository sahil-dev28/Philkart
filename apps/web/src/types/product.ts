export type Sort = "newest" | "oldest" | "aToZ" | "zToA" | "highest" | "lowest";

export type GenerationMethod = "promise" | "worker";

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  /** Populated by the API; may be null if the referenced category is missing. */
  category: Category | null;
  price: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  page: number;
  total: number;
  data: Product[];
}

export interface CategoriesResponse {
  data: Category[];
}

export interface GetProductsParams {
  page: number;
  limit: number;
  sort: Sort;
  /** Category id. Omitted entirely when browsing "all". */
  category?: string;
}
