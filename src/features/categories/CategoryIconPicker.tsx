import { useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import type { IconName } from "@/shared/icons";
import { IconPickerModal } from "@/shared/ui";
import { CategoryIcon } from "./CategoryIcon";

type CategoryIconPickerProps = {
  value: IconName | null;
  onChange: (value: IconName) => void;
};

function CategoryIconPicker({ value, onChange }: CategoryIconPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* поле повторює вигляд Input, але відкриває модалку з іконками */}
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-surface px-3.5 pt-2.5 pb-4.75 text-left transition-colors outline-none focus-visible:border-violet"
      >
        <span className="flex min-w-0 flex-col">
          <span className="mb-1 text-xs text-muted">Іконка</span>
          {value ? (
            <CategoryIcon
              icon={value}
              color={null}
              className="size-6 rounded-md [&_svg]:size-4"
            />
          ) : (
            <span className="text-gray">Оберіть іконку</span>
          )}
        </span>
        <ChevronRightIcon className="size-4 shrink-0 text-muted" />
      </button>

      <IconPickerModal open={open} onOpenChange={setOpen} value={value} onSelect={onChange} />
    </>
  );
}

export { CategoryIconPicker };
export type { CategoryIconPickerProps };
