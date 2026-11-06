import { endOfMonth, endOfYear, startOfMonth, startOfYear, subDays, subMonths } from "date-fns";
import { Search } from "lucide-react";
import { useAccounts } from "@/features/accounts";
import { CATEGORY_TYPES, useCategories, type CategoryType } from "@/features/categories";
import { Button, Card, DateRangePicker, Input, Select, type DateRangePreset } from "@/shared/ui";
import {
  AMOUNT_INPUT_PATTERN,
  EMPTY_TRANSACTION_FILTERS,
  hasActiveFilters,
  isAmountRangeInvalid,
  type TransactionFiltersValue,
} from "./transactionFilters.model";

// Select не вміє в null-пункт, тож «усі» позначаємо окремим значенням
const ALL = "all";

const TYPE_ITEMS = [
  { value: ALL, label: "Усі типи" },
  { value: "EXPENSE", label: "Витрати" },
  { value: "INCOME", label: "Доходи" },
] satisfies { value: typeof ALL | CategoryType; label: string }[];

function getPeriodPresets(today = new Date()): DateRangePreset[] {
  const lastMonth = subMonths(today, 1);

  return [
    { label: "Цей місяць", range: { from: startOfMonth(today), to: endOfMonth(today) } },
    { label: "Минулий місяць", range: { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) } },
    { label: "Останні 30 днів", range: { from: subDays(today, 29), to: today } },
    { label: "Цей рік", range: { from: startOfYear(today), to: endOfYear(today) } },
  ];
}

type TransactionFiltersProps = {
  value: TransactionFiltersValue;
  onChange: (value: TransactionFiltersValue) => void;
};

function TransactionFilters({ value, onChange }: TransactionFiltersProps) {
  // архівні теж: їхні транзакції нікуди не зникають
  const { data: accounts = [] } = useAccounts({ includeArchived: true });
  const { data: categories = [] } = useCategories();

  const update = (patch: Partial<TransactionFiltersValue>) => onChange({ ...value, ...patch });

  const accountItems = [
    { value: ALL, label: "Усі рахунки" },
    ...accounts.map((account) => ({
      value: account.id,
      label: account.archived ? `${account.name} (в архіві)` : account.name,
    })),
  ];

  const categoryItems = [
    { value: ALL, label: "Усі категорії" },
    ...categories
      .filter((category) => !value.type || category.type === value.type)
      .map((category) => ({ value: category.id, label: category.name })),
  ];

  const changeType = (type: CategoryType | null) => {
    const category = categories.find(({ id }) => id === value.categoryId);
    // категорія іншого типу під новий фільтр не підходить — скидаємо її
    const keepCategory = !type || !category || category.type === type;
    update({ type, categoryId: keepCategory ? value.categoryId : null });
  };

  const changeAmount = (key: "minAmount" | "maxAmount", amount: string) => {
    if (AMOUNT_INPUT_PATTERN.test(amount)) update({ [key]: amount });
  };

  const amountInvalid = isAmountRangeInvalid(value);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex min-h-5 items-center justify-between gap-4">
        <h2 className="text-16 font-semibold text-ink">Фільтри</h2>
        {hasActiveFilters(value) && (
          <Button
            variant="link"
            className="text-12"
            onClick={() => onChange(EMPTY_TRANSACTION_FILTERS)}
          >
            Скинути фільтри
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DateRangePicker
          label="Період"
          placeholder="Увесь час"
          value={value.period}
          onChange={(period) => update({ period })}
          presets={getPeriodPresets()}
        />

        <Select
          label="Рахунок"
          items={accountItems}
          value={value.accountId ?? ALL}
          onValueChange={(id) => update({ accountId: id && id !== ALL ? id : null })}
        />

        <Select
          label="Категорія"
          items={categoryItems}
          value={value.categoryId ?? ALL}
          onValueChange={(id) => update({ categoryId: id && id !== ALL ? id : null })}
        />

        <Select
          label="Тип"
          items={TYPE_ITEMS}
          value={value.type ?? ALL}
          onValueChange={(type) => changeType(CATEGORY_TYPES.find((t) => t === type) ?? null)}
        />

        <div className="md:col-span-2">
          <Input
            label="Пошук"
            type="search"
            placeholder="За описом транзакції"
            maxLength={100}
            value={value.search}
            onChange={(event) => update({ search: event.target.value })}
            suffix={<Search className="size-4" />}
          />
        </div>

        <Input
          label="Сума від"
          inputMode="decimal"
          placeholder="0"
          value={value.minAmount}
          aria-invalid={amountInvalid || undefined}
          onChange={(event) => changeAmount("minAmount", event.target.value)}
        />

        <Input
          label="Сума до"
          inputMode="decimal"
          placeholder="Без обмежень"
          value={value.maxAmount}
          aria-invalid={amountInvalid || undefined}
          onChange={(event) => changeAmount("maxAmount", event.target.value)}
        />
      </div>

      {amountInvalid && (
        <p role="alert" className="text-12 text-rose">
          Сума «від» не може бути більшою за суму «до», тому фільтр за сумою зараз не діє.
        </p>
      )}
    </Card>
  );
}

export { TransactionFilters };
export type { TransactionFiltersProps };
