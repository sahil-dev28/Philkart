import { useProductStore } from "@/store/product-store";

/** Convenience selector hook for the browse filters used by the toolbar. */
export function useFilters() {
  const sort = useProductStore((s) => s.sort);
  const category = useProductStore((s) => s.category);
  const page = useProductStore((s) => s.page);
  const perPage = useProductStore((s) => s.perPage);
  const setSort = useProductStore((s) => s.setSort);
  const setCategory = useProductStore((s) => s.setCategory);
  const setPage = useProductStore((s) => s.setPage);
  const setPerPage = useProductStore((s) => s.setPerPage);

  return {
    sort,
    category,
    page,
    perPage,
    setSort,
    setCategory,
    setPage,
    setPerPage,
  };
}
