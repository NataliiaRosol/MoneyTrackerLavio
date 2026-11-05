import { Badge, Button, Text } from "@/shared/ui";
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
    <li className="flex items-center gap-3 rounded-2xl border border-surface bg-white p-4">
      <CategoryIcon icon={category.icon} color={category.color} />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* title — щоб обрізану назву можна було прочитати при наведенні */}
        <Text size="sm" weight="medium" color="ink" className="truncate" title={category.name}>
          {category.name}
        </Text>
        <div className="flex items-center gap-2">
          <Text size="xs" className="text-muted">
            {CATEGORY_TYPE_LABELS[category.type]}
          </Text>
          <Badge variant={category.isDefault ? "default" : "accent"}>
            {category.isDefault ? "Системна" : "Моя"}
          </Badge>
        </div>
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
