import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getProducts } from "@/features/products/api";
import { useProductStore } from "@/store/product-store";

export function useProducts() {
  const nav = useProductStore((s) => s.nav);
  const perPage = useProductStore((s) => s.perPage);
  const sort = useProductStore((s) => s.sort);
  const category = useProductStore((s) => s.category);

  const categoryParam = category === "all" ? undefined : category;

  const navParams =
    nav.type === "after" || nav.type === "before"
      ? { cursor: nav.cursor, direction: nav.type }
      : nav.type === "snap"
        ? { anchor: nav.anchor }
        : {};

  return useQuery({
    queryKey: [
      "products",
      { nav, limit: perPage, sort, category: categoryParam },
    ],
    queryFn: () =>
      getProducts({ ...navParams, limit: perPage, sort, category: categoryParam }),
    placeholderData: keepPreviousData,
  });
}
