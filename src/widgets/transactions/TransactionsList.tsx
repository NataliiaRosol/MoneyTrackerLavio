import { Receipt, SearchX } from "lucide-react";
import { useState } from "react";
import {
  TRANSACTION_SORT_LABELS,
  TRANSACTION_SORTS,
  useTransactions,
  type ListTransactionsParams,
  type TransactionSort,
} from "@/features/transactions";
import { pluralize } from "@/lib/format";
import { Button, Loader, Select } from "@/shared/ui";
import { TransactionsEmptyState } from "./TransactionsEmptyState";
import { TransactionsTableCard } from "./TransactionsTableCard";

const PAGE_SIZE = 20;

const SORT_ITEMS = TRANSACTION_SORTS.map((value) => ({
  value,
  label: TRANSACTION_SORT_LABELS[value],
}));

type TransactionsListProps = {
  // фільтри без сортування й пагінації: ними список керує сам
  filters: ListTransactionsParams;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
};

function TransactionsList({ filters, hasActiveFilters, onResetFilters }: TransactionsListProps) {
  const [sort, setSort] = useState<TransactionSort>("date_desc");
  const [page, setPage] = useState(1);

  // інші фільтри — інший набір сторінок, тож повертаємося на першу
  const filtersKey = JSON.stringify(filters);
  const [prevFiltersKey, setPrevFiltersKey] = useState(filtersKey);
  if (filtersKey !== prevFiltersKey) {
    setPrevFiltersKey(filtersKey);
    setPage(1);
  }

  const { data, isPending, isPlaceholderData } = useTransactions({ ...filters, sort, page, limit: PAGE_SIZE });

  const changeSort = (next: TransactionSort) => {
    setSort(next);
    setPage(1);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-16 font-semibold text-ink tabular-nums">
          {data
            ? `${data.meta.total} ${pluralize(data.meta.total, {
                one: "транзакція",
                few: "транзакції",
                many: "транзакцій",
              })}`
            : "Транзакції"}
        </h2>

        <Select
          label="Сортування"
          items={SORT_ITEMS}
          value={sort}
          onValueChange={(next) => next && changeSort(next)}
          className="w-60"
        />
      </div>

      {/* лише перше завантаження: при зміні фільтрів і сторінок keepPreviousData тримає попередні дані */}
      {isPending && <Loader />}

      {data &&
        (data.meta.total > 0 ? (
          <TransactionsTableCard
            data={data}
            page={page}
            onPageChange={setPage}
            isPlaceholderData={isPlaceholderData}
          />
        ) : hasActiveFilters ? (
          <TransactionsEmptyState
            icon={SearchX}
            title="Нічого не знайдено"
            description="Жодна транзакція не підходить під обрані фільтри. Спробуйте змінити період чи інші умови."
            action={
              <Button variant="link" className="text-12" onClick={onResetFilters}>
                Скинути фільтри
              </Button>
            }
          />
        ) : (
          <TransactionsEmptyState
            icon={Receipt}
            title="Транзакцій ще немає"
            description="Додайте першу витрату чи дохід, і тут зʼявляться всі транзакції з ваших рахунків."
          />
        ))}
    </section>
  );
}

export { TransactionsList };
export type { TransactionsListProps };
