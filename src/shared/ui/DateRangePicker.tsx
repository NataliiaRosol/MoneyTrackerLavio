import { useState, type ReactNode } from "react";
import { format, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { PopoverField } from "./PopoverField";
import { RangeCalendar, type DateRange } from "./RangeCalendar";

type DateRangePreset = { label: string; range: DateRange };

type DateRangePickerProps = {
  label: ReactNode;
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: ReactNode;
  // швидкий вибір збоку від календаря: «Цей місяць», «Останні 30 днів» тощо
  presets?: readonly DateRangePreset[];
  className?: string;
};

const DISPLAY_FORMAT = "dd.MM.yyyy";

function formatRange(range: DateRange | undefined): string | null {
  if (!range?.from) return null;

  const from = format(range.from, DISPLAY_FORMAT);
  if (!range.to || isSameDay(range.from, range.to)) return from;
  return `${from} – ${format(range.to, DISPLAY_FORMAT)}`;
}

// діапазон із різних днів: вибір завершено
function isFullRange(range: DateRange | undefined): boolean {
  return !!range?.from && !!range.to && !isSameDay(range.from, range.to);
}

function isSameRange(a: DateRange | undefined, b: DateRange): boolean {
  return (
    !!a?.from && !!a.to && !!b.from && !!b.to && isSameDay(a.from, b.from) && isSameDay(a.to, b.to)
  );
}

/** Поле з вибором періоду: тригер у вигляді Input/Select, календар діапазону в поповері. */
function DateRangePicker({
  label,
  value,
  onChange,
  placeholder = "Не обрано",
  presets = [],
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (next: DateRange | undefined, triggerDate: Date) => {
    // діапазон уже обрано — новий клік починає вибір заново, а не зсуває один із країв
    const range = isFullRange(value) ? { from: triggerDate, to: triggerDate } : next;
    onChange(range);
    if (isFullRange(range)) setOpen(false);
  };

  const apply = (range: DateRange | undefined) => {
    onChange(range);
    setOpen(false);
  };

  return (
    <PopoverField
      label={label}
      valueText={formatRange(value)}
      placeholder={placeholder}
      icon={<CalendarIcon />}
      open={open}
      onOpenChange={setOpen}
      className={className}
      popupClassName="flex"
    >
      <div className="flex w-40 flex-col gap-0.5 border-r border-surface p-2">
        {presets.map((preset) => {
          const active = isSameRange(value, preset.range);

          return (
            <Button
              key={preset.label}
              variant="ghost"
              aria-pressed={active}
              onClick={() => apply(preset.range)}
              className={cn(
                "justify-start font-normal text-ink hover:bg-lilac",
                active && "bg-lilac font-medium text-primary",
              )}
            >
              {preset.label}
            </Button>
          );
        })}

        <Button
          variant="ghost"
          disabled={!value}
          onClick={() => apply(undefined)}
          className="mt-auto justify-start font-normal text-muted hover:bg-lilac"
        >
          Очистити
        </Button>
      </div>

      <RangeCalendar
        selected={value}
        onSelect={handleSelect}
        defaultMonth={value?.from}
        className="rounded-none border-0"
      />
    </PopoverField>
  );
}

export { DateRangePicker };
export type { DateRangePickerProps, DateRangePreset };
