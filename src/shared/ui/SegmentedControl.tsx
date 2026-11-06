import type { ReactNode } from "react";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { cn } from "@/lib/utils";

type SegmentedControlItem<Value extends string> = { value: Value; label: ReactNode };

type SegmentedControlProps<Value extends string> = {
  items: readonly SegmentedControlItem<Value>[];
  value: Value;
  onValueChange: (value: Value) => void;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
};

/** Перемикач «один із кількох» у вигляді сегментів, напр. витрата / дохід. */
function SegmentedControl<Value extends string>({
  items,
  value,
  onValueChange,
  className,
  ...props
}: SegmentedControlProps<Value>) {
  return (
    <ToggleGroup
      data-slot="segmented-control"
      value={[value]}
      // клік по активному сегменту знімає вибір — ігноруємо, значення має бути завжди
      onValueChange={([next]) => next && onValueChange(next)}
      className={cn(
        "grid auto-cols-fr grid-flow-col gap-1 rounded-[10px] border border-surface p-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Toggle
          key={item.value}
          value={item.value}
          className="h-9 cursor-pointer rounded-lg text-14 font-medium text-muted transition-colors outline-none select-none hover:text-ink focus-visible:ring-2 focus-visible:ring-violet/40 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pressed:bg-lilac data-pressed:text-primary"
        >
          {item.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}

export { SegmentedControl };
export type { SegmentedControlProps };
