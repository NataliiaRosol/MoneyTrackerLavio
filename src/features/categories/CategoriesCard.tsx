import type { ReactNode } from "react";
import { Card, Text } from "@/shared/ui";
import type { Category } from "./categories.api";
import { CategoryItem, type CategoryItemProps } from "./CategoryItem";

type CategoriesCardProps = Pick<CategoryItemProps, "onEdit" | "onDelete"> & {
  title: ReactNode;
  description: ReactNode;
  // undefined — дані ще вантажаться, тому не показуємо emptyText раніше часу
  categories: Category[] | undefined;
  emptyText: ReactNode;
  className?: string;
};

function CategoriesCard({
  title,
  description,
  categories,
  emptyText,
  onEdit,
  onDelete,
  className,
}: CategoriesCardProps) {
  return (
    <Card className={className}>
      <div className="flex flex-col gap-1">
        <Text as="h2" weight="semibold" color="ink">
          {title}
        </Text>
        <Text size="xs" className="text-muted">
          {description}
        </Text>
      </div>

      {categories && categories.length > 0 && (
        <ul className="mt-5 flex flex-col gap-4">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}

      {categories?.length === 0 && (
        <Text size="xs" className="mt-5 text-muted">
          {emptyText}
        </Text>
      )}
    </Card>
  );
}

export { CategoriesCard };
export type { CategoriesCardProps };
