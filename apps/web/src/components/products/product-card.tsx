import { Badge } from "@philkart/ui/components/badge";
import { Card, CardContent } from "@philkart/ui/components/card";

import { formatPrice, formatRelativeDate } from "@/lib/format";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="relative">
        {/* Generated images are remote (picsum) with redirects; a plain img avoids next/image remote config. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
        {product.category ? (
          <Badge className="absolute top-0 left-0 m-3 uppercase">
            {product.category.name}
          </Badge>
        ) : null}
      </div>

      <CardContent className="p-4">
        <h3 className="line-clamp-1 font-medium">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-3 flex items-baseline justify-between border-t pt-3">
          <span className="font-medium">{formatPrice(product.price)}</span>
          <span className="text-sm text-muted-foreground">
            {formatRelativeDate(product.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
