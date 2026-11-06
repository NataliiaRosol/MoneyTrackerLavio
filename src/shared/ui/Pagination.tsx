import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  return (
    <nav
      aria-label="Пагінація"
      data-slot="pagination"
      className={cn("flex items-center gap-2", className)}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Попередня сторінка"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="size-8 text-primary"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <span className="text-12 font-medium text-ink tabular-nums">Сторінка {page}</span>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Наступна сторінка"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="size-8 text-primary"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}

export { Pagination };
export type { PaginationProps };
