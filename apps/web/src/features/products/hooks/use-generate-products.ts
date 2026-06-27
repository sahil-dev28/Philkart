import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { generatePromise, generateWorker } from "@/features/products/api";
import { useProductStore } from "@/store/product-store";
import type { GenerationMethod } from "@/types/product";

interface GenerateInput {
  count: number;
  method: GenerationMethod;
}

export function useGenerateProducts() {
  const setLastRun = useProductStore((s) => s.setLastRun);
  const snapTo = useProductStore((s) => s.snapTo);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ count, method }: GenerateInput) => {
      const start = performance.now();
      await (method === "promise"
        ? generatePromise(count)
        : generateWorker(count));
      const ms = performance.now() - start;
      return { count, method, ms };
    },
    onSuccess: ({ count, method, ms }) => {
      setLastRun({ n: count, method, ms });
      const anchor = useProductStore.getState().anchorCursor;
      if (anchor) snapTo(anchor);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Generated ${count} products with ${method}`, {
        description: `${ms.toFixed(1)} ms round-trip`,
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Generation failed";
      toast.error("Generation failed", { description: message });
    },
  });
}
