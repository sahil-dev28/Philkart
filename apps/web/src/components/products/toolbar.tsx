"use client";

import { Label } from "@philkart/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@philkart/ui/components/select";

import { useCategories } from "@/features/products/hooks/use-categories";
import { useFilters } from "@/features/products/hooks/use-filters";
import { PER_PAGE_OPTIONS } from "@/store/product-store";
import type { Sort } from "@/types/product";

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "aToZ", label: "Name: A → Z" },
  { value: "zToA", label: "Name: Z → A" },
  { value: "highest", label: "Price: High → Low" },
  { value: "lowest", label: "Price: Low → High" },
];

const SORT_ITEMS: Record<string, string> = Object.fromEntries(
  SORT_OPTIONS.map((o) => [o.value, o.label]),
);

const PER_PAGE_ITEMS: Record<string, string> = Object.fromEntries(
  PER_PAGE_OPTIONS.map((n) => [String(n), `${n} / page`]),
);

interface ToolbarProps {
  total: number | null;
  page: number;
  offset: number;
  loaded: number;
  perPage: number;
}

export function Toolbar({ total, page, offset, loaded, perPage }: ToolbarProps) {
  const { sort, category, setSort, setCategory, setPerPage } = useFilters();
  const { data: categories } = useCategories();

  const from = !total || loaded === 0 ? 0 : offset + 1;
  const to = offset + loaded;
  const rangeText =
    total == null
      ? `Showing ${loaded}`
      : total === 0
        ? "—"
        : `${from}–${to} of ${total} · page ${page}`;

  const categoryItems: Record<string, string> = {
    all: "All categories",
    ...Object.fromEntries((categories ?? []).map((c) => [c._id, c.name])),
  };

  return (
    <div className="mt-7 mb-4 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">{rangeText}</p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Category</Label>
          <Select
            items={categoryItems}
            value={category}
            onValueChange={(value) => setCategory(value as string)}
          >
            <SelectTrigger className="w-[180px]" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {(categories ?? []).map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label>Sort</Label>
          <Select
            items={SORT_ITEMS}
            value={sort}
            onValueChange={(value) => setSort(value as Sort)}
          >
            <SelectTrigger className="w-[180px]" aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label>Per page</Label>
          <Select
            items={PER_PAGE_ITEMS}
            value={String(perPage)}
            onValueChange={(value) => setPerPage(Number(value))}
          >
            <SelectTrigger className="w-[120px]" aria-label="Products per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
