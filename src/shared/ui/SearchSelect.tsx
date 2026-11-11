import { useMemo, type ReactNode } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { CheckIcon, ChevronDownIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchSelectItem<Value extends string> = { value: Value; label: string };

type SearchSelectProps<Value extends string> = {
  label: ReactNode;
  items: readonly SearchSelectItem<Value>[];
  value: Value | null;
  onValueChange: (value: Value | null) => void;
  placeholder?: ReactNode;
  searchPlaceholder?: string;
  emptyText?: ReactNode;
  name?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  className?: string;
};

/** Select з пошуком у випадаючому списку — для довгих переліків, як-от категорії. */
function SearchSelect<Value extends string>({
  label,
  items,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder = "Пошук",
  emptyText = "Нічого не знайдено",
  name,
  disabled,
  "aria-invalid": ariaInvalid,
  className,
}: SearchSelectProps<Value>) {
  // значенням лишається id, а назва йде на показ і в пошук
  const collection = useMemo(
    () =>
      Combobox.createItems(items, {
        getValue: (item) => item.value,
        getLabel: (item) => item.label,
      }),
    [items],
  );

  return (
    <Combobox.Root
      items={collection}
      value={value}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
      autoHighlight
    >
      {/* тригер повторює вигляд Select, тож поля в одному ряду не відрізняються */}
      <Combobox.Trigger
        data-slot="search-select"
        aria-invalid={ariaInvalid}
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-surface px-3.5 pt-2.5 pb-4.75 text-left transition-colors outline-none focus-visible:border-violet aria-invalid:border-rose data-popup-open:border-violet data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className,
        )}
      >
        <span className="flex min-w-0 flex-col">
          <span className="mb-1 text-xs text-muted">{label}</span>
          <span className="truncate text-ink group-data-placeholder:text-gray">
            <Combobox.Value placeholder={placeholder} />
          </span>
        </span>
        <Combobox.Icon className="shrink-0 text-muted">
          <ChevronDownIcon className="size-4" />
        </Combobox.Icon>
      </Combobox.Trigger>

      <Combobox.Portal>
        <Combobox.Positioner align="start" sideOffset={8} className="z-50 outline-none">
          {/* висота обмежена: довгий список прокручується всередині, а не тягнеться на весь екран */}
          <Combobox.Popup className="flex max-h-[min(20rem,var(--available-height))] w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) flex-col overflow-hidden rounded-[10px] border border-surface bg-white shadow-[0_4px_16px_rgb(39_35_57/0.08)] outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <label className="flex shrink-0 items-center gap-2 border-b border-surface px-3.5 py-2.5">
              <Search className="size-4 shrink-0 text-muted" aria-hidden />
              <Combobox.Input
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                className="w-full min-w-0 text-14 text-ink outline-none placeholder:text-gray"
              />
            </label>

            <Combobox.Empty>
              <p className="px-3.5 py-3 text-14 text-muted">{emptyText}</p>
            </Combobox.Empty>

            <Combobox.List className="min-h-0 flex-1 scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0">
              {(item: SearchSelectItem<Value>) => (
                <Combobox.Item
                  key={item.value}
                  value={item.value}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-14 text-ink outline-none select-none data-highlighted:bg-lilac"
                >
                  <span className="truncate" title={item.label}>
                    {item.label}
                  </span>
                  <Combobox.ItemIndicator className="shrink-0 text-violet">
                    <CheckIcon className="size-4" />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

export { SearchSelect };
export type { SearchSelectItem, SearchSelectProps };
