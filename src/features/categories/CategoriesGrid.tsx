import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, Text } from "@/shared/ui";
import type { Category } from "./categories.api";
import { CategoryItem, type CategoryItemProps } from "./CategoryItem";

type CategoriesGridProps = Pick<CategoryItemProps, "onEdit" | "onDelete"> & {
  categories: Category[] | undefined;
  emptyText: ReactNode;
  className?: string;
};

function CategoriesGrid({
  categories,
  emptyText,
  onEdit,
  onDelete,
  className,
}: CategoriesGridProps) {
  if (!categories) return null;

  if (categories.length === 0) {
    return (
      <Card className={className}>
        <Text size="xs" className="text-muted">
          {emptyText}
        </Text>
      </Card>
    );
  }

  return (
    <ul
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(min(18rem,100%),1fr))] gap-3",
        className,
      )}
    >
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export { CategoriesGrid };
export type { CategoriesGridProps };
