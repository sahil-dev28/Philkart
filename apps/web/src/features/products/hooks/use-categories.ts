import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/features/products/api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60_000,
    select: (res) => res.data,
  });
}
