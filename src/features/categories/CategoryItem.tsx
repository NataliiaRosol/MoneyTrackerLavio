import { Button, Text } from "@/shared/ui";
import pencilIcon from "@/shared/icons/pencil.svg";
import trashIcon from "@/shared/icons/trash-2.svg";
import type { Category } from "./categories.api";
import { CATEGORY_TYPE_LABELS } from "./categories.constants";
import { CategoryIcon } from "./CategoryIcon";

type CategoryItemProps = {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
};

function CategoryItem({ category, onEdit, onDelete }: CategoryItemProps) {
  return (
    <li className="flex items-center gap-3">
      <CategoryIcon icon={category.icon} color={category.color} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Text size="sm" weight="medium" color="ink" className="truncate">
          {category.name}
        </Text>
        <Text size="xs" className="text-muted">
          {CATEGORY_TYPE_LABELS[category.type]}
        </Text>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Редагувати «${category.name}»`}
          onClick={() => onEdit?.(category)}
          className="size-8"
        >
          <img src={pencilIcon} alt="" aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Видалити «${category.name}»`}
          onClick={() => onDelete?.(category)}
          className="size-8"
        >
          <img src={trashIcon} alt="" aria-hidden />
        </Button>
      </div>
    </li>
  );
}

export { CategoryItem };
export type { CategoryItemProps };
