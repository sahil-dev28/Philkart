import { create } from "zustand";

import type { GenerationMethod, Sort } from "@/types/product";

/** Selectable page sizes for the "Per page" control (20 → 100). */
export const PER_PAGE_OPTIONS = [20, 40, 60, 80, 100] as const;
export const DEFAULT_PER_PAGE = 20;

export interface LastRun {
  n: number;
  method: GenerationMethod;
  ms: number;
}

interface ProductState {
  // List / browse state
  sort: Sort;
  category: string; // "all" or a category id
  page: number;
  perPage: number;
  // Generation form state
  count: number;
  method: GenerationMethod;
  // Status line
  lastRun: LastRun | null;

  setSort: (sort: Sort) => void;
  setCategory: (category: string) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setCount: (count: number) => void;
  setMethod: (method: GenerationMethod) => void;
  setLastRun: (lastRun: LastRun) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  sort: "newest",
  category: "all",
  page: 1,
  perPage: DEFAULT_PER_PAGE,
  count: 12,
  method: "promise",
  lastRun: null,

  // Changing sort, category, or page size always returns to the first page.
  setSort: (sort) => set({ sort, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setPage: (page) => set({ page }),
  setPerPage: (perPage) => set({ perPage, page: 1 }),
  setCount: (count) => set({ count }),
  setMethod: (method) => set({ method }),
  setLastRun: (lastRun) => set({ lastRun }),
}));
