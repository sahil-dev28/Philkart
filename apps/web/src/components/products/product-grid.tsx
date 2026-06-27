import { Skeleton } from "@philkart/ui/components/skeleton";

import type { Product } from "@/types/product";

import { EmptyState } from "./empty-state";
import { ProductCard } from "./product-card";

const GRID =
  "grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(248px,1fr))]";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  skeletonCount?: number;
}

export function ProductGrid({
  products,
  isLoading,
  skeletonCount = 8,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={GRID}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ProductCardSkeleton key={`product-skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={GRID}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-3 h-4 w-1/3" />
      </div>
    </div>
  );
}
