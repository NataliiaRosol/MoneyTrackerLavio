import { useEffect, useState } from "react";
import {
  TransactionDetailsModal,
  type Transaction,
  type TransactionsPage,
} from "@/features/transactions";
import { pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, Pagination, Text } from "@/shared/ui";
import { TransactionsTable } from "./TransactionsTable";

type TransactionsTableCardProps = {
  data: TransactionsPage;
  page: number;
  onPageChange: (page: number) => void;
  // true — у data ще попередня сторінка, поки вантажиться нова
  isPlaceholderData?: boolean;
};

function TransactionsTableCard({
  data,
  page,
  onPageChange,
  isPlaceholderData = false,
}: TransactionsTableCardProps) {
  // транзакцію тримаємо й після закриття, щоб вміст не зник посеред анімації
  const [details, setDetails] = useState<{ open: boolean; transaction: Transaction | null }>({
    open: false,
    transaction: null,
  });

  // після видалення чи редагування остання сторінка може спорожніти — переходимо на нову останню
  const { totalPages } = data.meta;
  useEffect(() => {
    if (!isPlaceholderData && totalPages > 0 && page > totalPages) onPageChange(totalPages);
  }, [isPlaceholderData, page, totalPages, onPageChange]);

  return (
    <>
      <Card className="overflow-hidden p-0">
        {/* поки вантажиться інша сторінка, показуємо попередню приглушеною */}
        <div
          aria-busy={isPlaceholderData}
          className={cn("overflow-x-auto transition-opacity", isPlaceholderData && "opacity-60")}
        >
          <TransactionsTable
            transactions={data.items}
            onSelect={(transaction) => setDetails({ open: true, transaction })}
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-surface px-6 py-3">
          <Text size="xs" className="text-muted">
            Показано {data.items.length} із {data.meta.total}{" "}
            {pluralize(data.meta.total, {
              one: "транзакції",
              few: "транзакцій",
              many: "транзакцій",
            })}
          </Text>
          <Pagination page={page} totalPages={data.meta.totalPages} onPageChange={onPageChange} />
        </div>
      </Card>

      <TransactionDetailsModal
        open={details.open}
        onOpenChange={(open) => setDetails((prev) => ({ ...prev, open }))}
        transaction={details.transaction}
      />
    </>
  );
}

export { TransactionsTableCard };
export type { TransactionsTableCardProps };
