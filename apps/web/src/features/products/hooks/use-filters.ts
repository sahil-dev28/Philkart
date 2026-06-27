import { useProductStore } from "@/store/product-store";

export function useFilters() {
  const sort = useProductStore((s) => s.sort);
  const category = useProductStore((s) => s.category);
  const perPage = useProductStore((s) => s.perPage);
  const setSort = useProductStore((s) => s.setSort);
  const setCategory = useProductStore((s) => s.setCategory);
  const setPerPage = useProductStore((s) => s.setPerPage);

  return {
    sort,
    category,
    perPage,
    setSort,
    setCategory,
    setPerPage,
  };
}
