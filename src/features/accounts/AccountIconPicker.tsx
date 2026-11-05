import { createElement, useState, type ComponentProps } from "react";
import { LayoutGrid, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICONS, type IconName } from "@/shared/icons";
import { IconPickerModal } from "@/shared/ui";
import type { AccountType } from "./accounts.api";
import { ACCOUNT_TYPE_ICON_NAMES, ACCOUNT_TYPE_LABELS } from "./accounts.constants";

const QUICK_TYPES = ["CARD", "CASH", "SAVINGS"] as const satisfies readonly AccountType[];

type AccountIconPickerProps = {
  value: IconName;
  onChange: (value: IconName) => void;
};

function AccountIconPicker({ value, onChange }: AccountIconPickerProps) {
  const [open, setOpen] = useState(false);
  const isQuick = QUICK_TYPES.some((type) => ACCOUNT_TYPE_ICON_NAMES[type] === value);

  return (
    <fieldset className="flex flex-col">
      <legend className="mb-2 text-xs text-muted">Іконка</legend>

      <div className="grid grid-cols-4 gap-2">
        {QUICK_TYPES.map((type) => {
          const name = ACCOUNT_TYPE_ICON_NAMES[type];
          return (
            <IconTile
              key={type}
              icon={ICONS[name]}
              label={ACCOUNT_TYPE_LABELS[type]}
              aria-pressed={value === name}
              onClick={() => onChange(name)}
            />
          );
        })}

        <IconTile
          icon={isQuick ? LayoutGrid : ICONS[value]}
          label="Інша"
          aria-pressed={!isQuick}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        />
      </div>

      <IconPickerModal open={open} onOpenChange={setOpen} value={value} onSelect={onChange} />
    </fieldset>
  );
}

type IconTileProps = Omit<ComponentProps<"button">, "children"> & {
  icon: LucideIcon;
  label: string;
};

function IconTile({ icon, label, className, ...props }: IconTileProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border border-surface px-2 py-3 text-ink transition-colors outline-none hover:bg-surface/40 focus-visible:ring-3 focus-visible:ring-ring/50",
        "aria-pressed:border-violet aria-pressed:bg-lilac aria-pressed:text-violet aria-pressed:hover:bg-lilac",
        className,
      )}
      {...props}
    >
      {createElement(icon, { className: "size-5", "aria-hidden": true })}
      <span className="text-12">{label}</span>
    </button>
  );
}

export { AccountIconPicker };
export type { AccountIconPickerProps };
