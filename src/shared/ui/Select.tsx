import type { ReactNode } from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectItem<Value extends string> = { value: Value; label: ReactNode };

type SelectProps<Value extends string> = Omit<
  SelectPrimitive.Root.Props<Value>,
  "items" | "children"
> & {
  label: ReactNode;
  items: readonly SelectItem<Value>[];
  placeholder?: ReactNode;
  "aria-invalid"?: boolean;
  className?: string;
};

function Select<Value extends string>({
  label,
  items,
  placeholder,
  "aria-invalid": ariaInvalid,
  className,
  ...props
}: SelectProps<Value>) {
  return (
    <SelectPrimitive.Root items={items} {...props}>
      {/* тригер повторює вигляд Input: підпис зверху всередині рамки */}
      <SelectPrimitive.Trigger
        data-slot="select"
        aria-invalid={ariaInvalid}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-surface px-3.5 pt-2.5 pb-4.75 text-left transition-colors outline-none focus-visible:border-violet aria-invalid:border-rose data-popup-open:border-violet data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className,
        )}
      >
        <span className="flex min-w-0 flex-col">
          <span className="mb-1 text-xs text-muted">{label}</span>
          <SelectPrimitive.Value
            placeholder={placeholder}
            className="truncate text-ink data-placeholder:text-gray"
          />
        </span>
        <SelectPrimitive.Icon className="shrink-0 text-muted">
          <ChevronDownIcon className="size-4" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          alignItemWithTrigger={false}
          sideOffset={8}
          className="z-50 outline-none"
        >
          <SelectPrimitive.Popup className="min-w-(--anchor-width) origin-(--transform-origin) rounded-[10px] border border-surface bg-white p-1 shadow-[0_4px_16px_rgb(39_35_57/0.08)] outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <SelectPrimitive.List className="max-h-(--available-height) overflow-y-auto">
              {items.map((item) => (
                <SelectPrimitive.Item
                  key={item.value}
                  value={item.value}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-14 text-ink outline-none select-none data-highlighted:bg-lilac"
                >
                  <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="text-violet">
                    <CheckIcon className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export { Select };
export type { SelectProps };
