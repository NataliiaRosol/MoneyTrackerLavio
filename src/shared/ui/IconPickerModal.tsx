import { createElement, useState } from "react";
import { cn } from "@/lib/utils";
import { ICON_NAMES, ICONS, type IconName } from "@/shared/icons";
import { Modal } from "./Modal";

type IconPickerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: IconName | null;
  onSelect: (value: IconName) => void;
};

function IconPickerModal({ open, onOpenChange, value, onSelect }: IconPickerModalProps) {
  const [draft, setDraft] = useState(value);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setDraft(value);
  }

  const confirm = () => {
    if (draft) onSelect(draft);
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Оберіть іконку"
      confirmText="Обрати"
      onConfirm={confirm}
      confirmDisabled={!draft}
    >
      <div className="grid max-h-80 grid-cols-8 gap-2 overflow-y-auto p-0.5">
        {ICON_NAMES.map((name) => (
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
            {createElement(ICONS[name], { className: "size-5" })}
          </button>
        ))}
      </div>
    </Modal>
  );
}

export { IconPickerModal };
export type { IconPickerModalProps };
