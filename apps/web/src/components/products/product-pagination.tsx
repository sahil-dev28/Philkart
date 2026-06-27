"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPaginate from "react-paginate";

import { buttonVariants } from "@philkart/ui/components/button";
import { cn } from "@philkart/ui/lib/utils";

interface ProductPaginationProps {
  /** 1-based current page. */
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

const navLink = cn(buttonVariants({ variant: "outline", size: "icon" }), "cursor-pointer");
const pageLink = cn(buttonVariants({ variant: "ghost", size: "icon" }), "cursor-pointer");
const activeLink = cn(buttonVariants({ variant: "outline", size: "icon" }), "bg-accent text-accent-foreground");

export function ProductPagination({
  page,
  pages,
  onPageChange,
}: ProductPaginationProps) {
  if (pages <= 1) return null;

  return (
    <ReactPaginate
      // Controlled: server owns the current page.
      forcePage={page - 1}
      pageCount={pages}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      breakLabel="…"
      previousLabel={<ChevronLeft className="size-4" />}
      nextLabel={<ChevronRight className="size-4" />}
      // Skinned entirely with the design system.
      containerClassName="mt-9 flex list-none items-center justify-center gap-1"
      pageLinkClassName={pageLink}
      activeLinkClassName={activeLink}
      previousLinkClassName={navLink}
      nextLinkClassName={navLink}
      breakLinkClassName={cn(pageLink, "pointer-events-none")}
      disabledLinkClassName="pointer-events-none opacity-50"
    />
  );
}
