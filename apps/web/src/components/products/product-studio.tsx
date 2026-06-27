"use client";

import { useEffect, useRef } from "react";

import { useProducts } from "@/features/products/hooks/use-products";
import { useProductStore } from "@/store/product-store";

import { ControlsCard } from "./controls-card";
import { ErrorState } from "./error-state";
import { ProductGrid } from "./product-grid";
import { ProductPagination } from "./product-pagination";
import { StatusLine } from "./status-line";
import { Toolbar } from "./toolbar";

export function ProductStudio() {
  const { data, isPending, isPlaceholderData, isError, error, refetch } =
    useProducts();
  const page = useProductStore((s) => s.page);
  const perPage = useProductStore((s) => s.perPage);
  const setPage = useProductStore((s) => s.setPage);

  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const products = data?.data ?? [];

  // Jump back to the top so the new page's products start in view.
  const scrollRef = useRef<HTMLElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <main ref={scrollRef} className="min-h-0 overflow-y-auto">
      <div className="mx-auto max-w-[1180px] px-8 pt-10 pb-20">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Product Generator
            </p>
            <h1 className="text-3xl font-semibold">Product Studio</h1>
          </div>
          <StatusLine />
        </header>

        <ControlsCard />

        <Toolbar total={total} page={page} pages={pages} />

        {isError ? (
          <ErrorState
            message={
              error instanceof Error ? error.message : "Something went wrong"
            }
            onRetry={() => refetch()}
          />
        ) : (
          <ProductGrid
            products={products}
            isLoading={isPending}
            isFetching={isPlaceholderData}
            skeletonCount={Math.min(perPage, 12)}
          />
        )}

        <ProductPagination page={page} pages={pages} onPageChange={setPage} />
      </div>
    </main>
  );
}
