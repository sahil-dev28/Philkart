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

  const sort = useProductStore((s) => s.sort);
  const category = useProductStore((s) => s.category);
  const perPage = useProductStore((s) => s.perPage);
  const nav = useProductStore((s) => s.nav);
  const goNext = useProductStore((s) => s.goNext);
  const goPrev = useProductStore((s) => s.goPrev);
  const setAnchorCursor = useProductStore((s) => s.setAnchorCursor);

  const products = data?.data ?? [];
  const offset = data?.offset ?? 0;
  const total = data?.total ?? null;
  const firstCursor = data?.firstCursor ?? null;
  const lastCursor = data?.lastCursor ?? null;

  const page = products.length ? Math.floor(offset / perPage) + 1 : 1;
  const totalPages = total ? Math.max(1, Math.ceil(total / perPage)) : 1;
  const hasPrev = offset > 0;
  const hasNext = total != null && offset + products.length < total;

  useEffect(() => {
    if (firstCursor) setAnchorCursor(firstCursor);
  }, [firstCursor, setAnchorCursor]);

  const scrollRef = useRef<HTMLElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [nav, sort, category, perPage]);

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

        <Toolbar
          total={total}
          page={page}
          offset={offset}
          loaded={products.length}
          perPage={perPage}
        />

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

        <ProductPagination
          page={page}
          totalPages={totalPages}
          hasPrev={hasPrev}
          hasNext={hasNext}
          isFetching={isPlaceholderData}
          onPrev={() => firstCursor && goPrev(firstCursor)}
          onNext={() => lastCursor && goNext(lastCursor)}
        />
      </div>
    </main>
  );
}
