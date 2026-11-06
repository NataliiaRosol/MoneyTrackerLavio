import { useEffect, useRef } from "react";
import {
  DayPicker,
  type ChevronProps,
  type DateRange,
  type DayButtonProps,
  type PropsBase,
  type PropsRange,
  type RootProps,
} from "react-day-picker";
import { uk } from "react-day-picker/locale";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

type RangeCalendarProps = Omit<PropsBase, "mode" | "required"> & Omit<PropsRange, "mode" | "required">;

/** Календар з вибором діапазону дат (від — до). */
function RangeCalendar({
  className,
  classNames,
  components,
  showOutsideDays = true,
  captionLayout = "label",
  locale = uk,
  ...props
}: RangeCalendarProps) {
  return (
    <DayPicker
      mode="range"
      locale={locale}
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn(
        "w-fit rounded-2xl border border-surface bg-white p-3 [--cell-size:--spacing(9)]",
        className,
      )}
      classNames={{
        months: "relative flex flex-col gap-4 md:flex-row",
        month: "flex w-full flex-col gap-3",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-(--cell-size) text-primary aria-disabled:pointer-events-none aria-disabled:opacity-50",
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-(--cell-size) text-primary aria-disabled:pointer-events-none aria-disabled:opacity-50",
        ),
        month_caption: "flex h-(--cell-size) items-center justify-center px-(--cell-size)",
        caption_label: cn(
          "text-14 font-semibold text-ink capitalize select-none",
          captionLayout !== "label" &&
            "flex h-(--cell-size) items-center gap-1 rounded-lg px-2 font-medium [&>svg]:size-3.5 [&>svg]:text-muted",
        ),
        dropdowns: "flex items-center justify-center gap-1",
        dropdown_root: "relative rounded-lg transition-colors hover:bg-lilac has-focus-visible:ring-2 has-focus-visible:ring-violet/40",
        dropdown: "absolute inset-0 z-10 cursor-pointer bg-white text-ink opacity-0",
        month_grid: "border-collapse",
        weekdays: "flex",
        weekday: "w-(--cell-size) pb-1 text-12 font-medium text-muted capitalize select-none",
        week: "mt-1 flex",
        day: "size-(--cell-size) p-0 text-center select-none",
        // смуга діапазону малюється на клітинках, а краї (від / до) — кнопками поверх неї
        range_start: "rounded-l-lg bg-lilac last:rounded-r-lg",
        range_middle: "bg-lilac first:rounded-l-lg last:rounded-r-lg",
        range_end: "rounded-r-lg bg-lilac first:rounded-l-lg",
        hidden: "invisible",
        footer: "mt-3 text-13 text-muted",
        ...classNames,
      }}
      components={{
        Root: RangeCalendarRoot,
        Chevron: RangeCalendarChevron,
        DayButton: RangeCalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

function RangeCalendarRoot({ rootRef, ...props }: RootProps) {
  return <div data-slot="range-calendar" ref={rootRef} {...props} />;
}

function RangeCalendarChevron({ className, orientation, style }: ChevronProps) {
  const iconProps = { className: cn("size-4", className), style };

  if (orientation === "right") return <ChevronRightIcon {...iconProps} />;
  if (orientation === "up") return <ChevronUpIcon {...iconProps} />;
  if (orientation === "down") return <ChevronDownIcon {...iconProps} />;
  return <ChevronLeftIcon {...iconProps} />;
}

function RangeCalendarDayButton({ className, day, modifiers, ...props }: DayButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  // керування з клавіатури: DayPicker позначає день як focused, а фокус ставимо самі
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  // край діапазону: початок, кінець або поки що єдиний обраний день (до другого кліку)
  const isRangeEdge = modifiers.selected && !modifiers.range_middle;

  return (
    <button
      ref={ref}
      data-day={day.isoDate}
      className={cn(
        "relative flex size-full cursor-pointer items-center justify-center rounded-lg text-14 text-ink tabular-nums transition-colors outline-none hover:bg-lilac focus-visible:ring-2 focus-visible:ring-violet/40",
        modifiers.outside && "text-gray",
        // сьогодні: фіолетовий текст і крапка під числом
        modifiers.today &&
          "font-semibold text-violet after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-violet",
        modifiers.disabled && "cursor-not-allowed text-gray opacity-50 hover:bg-transparent",
        modifiers.range_middle && "hover:bg-lavender",
        isRangeEdge && "bg-violet font-medium text-white after:bg-white hover:bg-violet/90",
        className,
      )}
      {...props}
    />
  );
}

export { RangeCalendar };
export type { RangeCalendarProps, DateRange };
