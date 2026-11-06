import type { ReactNode } from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

type PopoverFieldProps = {
  label: ReactNode;
  // текст обраного значення; null — показуємо placeholder
  valueText: ReactNode | null;
  placeholder?: ReactNode;
  icon?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // вміст поповера, напр. календар
  children: ReactNode;
  "aria-invalid"?: boolean;
  className?: string;
  popupClassName?: string;
};

/** Поле, що відкриває поповер: тригер виглядає як Input/Select з підписом усередині рамки. */
function PopoverField({
  label,
  valueText,
  placeholder,
  icon,
  open,
  onOpenChange,
  children,
  "aria-invalid": ariaInvalid,
  className,
  popupClassName,
}: PopoverFieldProps) {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger
        data-slot="popover-field"
        aria-invalid={ariaInvalid}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-surface px-3.5 pt-2.5 pb-4.75 text-left transition-colors outline-none focus-visible:border-violet aria-invalid:border-rose data-popup-open:border-violet",
          className,
        )}
      >
        <span className="flex min-w-0 flex-col">
          <span className="mb-1 text-xs text-muted">{label}</span>
          <span className={cn("truncate tabular-nums", valueText ? "text-ink" : "text-gray")}>
            {valueText ?? placeholder}
          </span>
        </span>
        {icon && <span className="shrink-0 text-muted [&>svg]:size-4">{icon}</span>}
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner align="start" sideOffset={8} className="z-50 outline-none">
          <PopoverPrimitive.Popup
            className={cn(
              "origin-(--transform-origin) rounded-2xl border border-surface bg-white shadow-[0_4px_16px_rgb(39_35_57/0.08)] outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
              popupClassName,
            )}
          >
            {children}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export { PopoverField };
export type { PopoverFieldProps };
