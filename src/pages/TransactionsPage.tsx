import { useState } from "react";
import { TransactionFormModal } from "@/features/transactions";
import { PageHeader } from "@/shared/ui";
import {
  EMPTY_TRANSACTION_FILTERS,
  hasActiveFilters,
  TransactionFilters,
  TransactionsList,
  useTransactionFilterParams,
  type TransactionFiltersValue,
} from "@/widgets/transactions";

function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFiltersValue>(EMPTY_TRANSACTION_FILTERS);
  const params = useTransactionFilterParams(filters);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Транзакції"
        subtitle="Усі записи з ваших і доступних вам рахунків в одному місці."
        actionText="+ Додати транзакцію"
        onAction={() => setCreateOpen(true)}
      />

      <div className="mx-10 mb-10 flex flex-col gap-7.5">
        <TransactionFilters value={filters} onChange={setFilters} />

        <TransactionsList
          filters={params}
          hasActiveFilters={hasActiveFilters(filters)}
          onResetFilters={() => setFilters(EMPTY_TRANSACTION_FILTERS)}
        />
      </div>

      <TransactionFormModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

export default TransactionsPage;
