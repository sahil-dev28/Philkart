import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getProducts } from "@/features/products/api";
import { useProductStore } from "@/store/product-store";

/** Server-side paginated + sorted + category-filtered product list. */
export function useProducts() {
  const page = useProductStore((s) => s.page);
  const perPage = useProductStore((s) => s.perPage);
  const sort = useProductStore((s) => s.sort);
  const category = useProductStore((s) => s.category);

  const categoryParam = category === "all" ? undefined : category;

  return useQuery({
    queryKey: ["products", { page, limit: perPage, sort, category: categoryParam }],
    queryFn: () =>
      getProducts({ page, limit: perPage, sort, category: categoryParam }),
    // Keep the previous page visible while the next one loads.
    placeholderData: keepPreviousData,
  });
}
