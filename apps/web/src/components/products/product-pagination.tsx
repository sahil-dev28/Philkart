"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@philkart/ui/components/button";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  isFetching: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function ProductPagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  isFetching,
  onPrev,
  onNext,
}: ProductPaginationProps) {
  if (!hasPrev && !hasNext) return null;

  return (
    <div className="mt-9 flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={!hasPrev || isFetching}
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>

      <span className="text-sm text-muted-foreground tabular-nums">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={!hasNext || isFetching}
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
