import { format } from "date-fns";
import type { CategoryType } from "@/features/categories";
import type { ListTransactionsParams } from "@/features/transactions";
import { useDebouncedText } from "@/lib/useDebouncedText";
import type { DateRange } from "@/shared/ui";

// сирі значення полів; у запит їх перетворює useTransactionFilterParams
export type TransactionFiltersValue = {
  period: DateRange | undefined;
  accountId: string | null;
  categoryId: string | null;
  type: CategoryType | null;
  search: string;
  minAmount: string;
  maxAmount: string;
};

export const EMPTY_TRANSACTION_FILTERS: TransactionFiltersValue = {
  period: undefined,
  accountId: null,
  categoryId: null,
  type: null,
  search: "",
  minAmount: "",
  maxAmount: "",
};

// бекенд приймає до 15 цифр і до 4 знаків після роздільника; кому теж дозволяємо
export const AMOUNT_INPUT_PATTERN = /^\d{0,15}([.,]\d{0,4})?$/;

// "12," → "12", ",5" → "0.5": бекенд чекає цифри з обох боків від крапки
function toAmountParam(value: string): string | undefined {
  const amount = value.replace(",", ".").replace(/\.$/, "").replace(/^\./, "0.");
  return amount || undefined;
}

function isAmountRangeValid(min: string | undefined, max: string | undefined): boolean {
  return min === undefined || max === undefined || Number(min) <= Number(max);
}

export function isAmountRangeInvalid({ minAmount, maxAmount }: TransactionFiltersValue): boolean {
  return !isAmountRangeValid(toAmountParam(minAmount), toAmountParam(maxAmount));
}

export function hasActiveFilters(filters: TransactionFiltersValue): boolean {
  return (
    filters.period !== undefined ||
    filters.accountId !== null ||
    filters.categoryId !== null ||
    filters.type !== null ||
    filters.search.trim() !== "" ||
    filters.minAmount !== "" ||
    filters.maxAmount !== ""
  );
}

// дати з календаря — локальна північ, тож форматуємо в локальному часі
const toIsoDate = (date: Date) => format(date, "yyyy-MM-dd");

export function useTransactionFilterParams(filters: TransactionFiltersValue): ListTransactionsParams {
  // текстові поля чекають паузи у введенні, решта фільтрів застосовується одразу
  const search = useDebouncedText(filters.search.trim());
  const minAmount = toAmountParam(useDebouncedText(filters.minAmount));
  const maxAmount = toAmountParam(useDebouncedText(filters.maxAmount));
  const { period } = filters;

  return {
    accountIds: filters.accountId ? [filters.accountId] : undefined,
    categoryIds: filters.categoryId ? [filters.categoryId] : undefined,
    type: filters.type ?? undefined,
    from: period?.from && toIsoDate(period.from),
    to: period?.from && toIsoDate(period.to ?? period.from),
    search: search || undefined,
    // коли «від» більша за «до», бекенд відповість 400, тож суму поки не фільтруємо
    ...(isAmountRangeValid(minAmount, maxAmount) && { minAmount, maxAmount }),
  };
}
