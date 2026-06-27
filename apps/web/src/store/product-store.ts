import { create } from "zustand";

import type { GenerationMethod, Sort } from "@/types/product";

export type Nav =
  | { type: "first" }
  | { type: "after"; cursor: string }
  | { type: "before"; cursor: string }
  | { type: "snap"; anchor: string };

const FIRST_PAGE: Nav = { type: "first" };

export const PER_PAGE_OPTIONS = [20, 40, 60, 80, 100] as const;
export const DEFAULT_PER_PAGE = 20;

export interface LastRun {
  n: number;
  method: GenerationMethod;
  ms: number;
}

interface ProductState {
  sort: Sort;
  category: string;
  perPage: number;
  nav: Nav;
  anchorCursor: string | null;
  count: number;
  method: GenerationMethod;
  lastRun: LastRun | null;

  setSort: (sort: Sort) => void;
  setCategory: (category: string) => void;
  setPerPage: (perPage: number) => void;
  goNext: (lastCursor: string) => void;
  goPrev: (firstCursor: string) => void;
  snapTo: (anchor: string) => void;
  resetNav: () => void;
  setAnchorCursor: (cursor: string | null) => void;
  setCount: (count: number) => void;
  setMethod: (method: GenerationMethod) => void;
  setLastRun: (lastRun: LastRun) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  sort: "newest",
  category: "all",
  perPage: DEFAULT_PER_PAGE,
  nav: FIRST_PAGE,
  anchorCursor: null,
  count: 12,
  method: "promise",
  lastRun: null,

  setSort: (sort) => set({ sort, nav: FIRST_PAGE }),
  setCategory: (category) => set({ category, nav: FIRST_PAGE }),
  setPerPage: (perPage) => set({ perPage, nav: FIRST_PAGE }),
  goNext: (lastCursor) => set({ nav: { type: "after", cursor: lastCursor } }),
  goPrev: (firstCursor) => set({ nav: { type: "before", cursor: firstCursor } }),
  snapTo: (anchor) => set({ nav: { type: "snap", anchor } }),
  resetNav: () => set({ nav: FIRST_PAGE }),
  setAnchorCursor: (cursor) => set({ anchorCursor: cursor }),
  setCount: (count) => set({ count }),
  setMethod: (method) => set({ method }),
  setLastRun: (lastRun) => set({ lastRun }),
}));
