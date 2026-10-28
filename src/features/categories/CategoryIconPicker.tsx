import { createElement, useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/shared/ui";
import {
  CATEGORY_ICON_NAMES,
  CATEGORY_ICONS,
  type CategoryIconName,
} from "./categories.icons";
import { CategoryIcon } from "./CategoryIcon";

type CategoryIconPickerProps = {
  value: CategoryIconName | null;
  onChange: (value: CategoryIconName) => void;
};

function CategoryIconPicker({ value, onChange }: CategoryIconPickerProps) {
  const [open, setOpen] = useState(false);
  // вибір у сітці застосовується лише після «Обрати», «Скасувати» його відкидає
  const [draft, setDraft] = useState(value);

  const openPicker = () => {
    setDraft(value);
    setOpen(true);
  };

  const confirm = () => {
    if (draft) onChange(draft);
    setOpen(false);
  };

  return (
    <>
      {/* поле повторює вигляд Input, але відкриває модалку з іконками */}
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={openPicker}
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

      {/* рендериться всередині модалки форми, тож base-ui відкриває її як вкладений діалог */}
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Оберіть іконку"
        confirmText="Обрати"
        onConfirm={confirm}
        confirmDisabled={!draft}
      >
        <div className="grid max-h-80 grid-cols-8 gap-2 overflow-y-auto p-0.5">
          {CATEGORY_ICON_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              title={name}
              aria-label={name}
              aria-pressed={draft === name}
              onClick={() => setDraft(name)}
              className={cn(
                "flex aspect-square cursor-pointer items-center justify-center rounded-[10px] border border-surface text-ink transition-colors outline-none hover:bg-surface/40 focus-visible:ring-3 focus-visible:ring-ring/50",
                draft === name && "border-violet bg-lilac text-violet hover:bg-lilac",
              )}
            >
              {createElement(CATEGORY_ICONS[name], { className: "size-5" })}
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}

export { CategoryIconPicker };
export type { CategoryIconPickerProps };
