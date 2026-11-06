import type { KeyboardEvent } from "react";
import { CategoryIcon } from "@/features/categories";
import type { Transaction } from "@/features/transactions";
import { formatDate, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

type TransactionsTableProps = {
  transactions: Transaction[];
  // клік по рядку, напр. щоб відкрити деталі
  onSelect?: (transaction: Transaction) => void;
  className?: string;
};

const headCellClassName = "px-6 py-3 text-12 font-medium whitespace-nowrap text-muted";
const cellClassName = "px-6 py-3 text-14";

function TransactionsTable({ transactions, onSelect, className }: TransactionsTableProps) {
  return (
    <table className={cn("w-full border-collapse text-left", className)}>
      <thead>
        <tr className="border-b border-surface">
          <th scope="col" className={headCellClassName}>Дата</th>
          <th scope="col" className={headCellClassName}>Категорія</th>
          <th scope="col" className={headCellClassName}>Опис</th>
          <th scope="col" className={headCellClassName}>Рахунок</th>
          <th scope="col" className={cn(headCellClassName, "text-right")}>Сума</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} onSelect={onSelect} />
        ))}
      </tbody>
    </table>
  );
}

type TransactionRowProps = {
  transaction: Transaction;
  onSelect?: (transaction: Transaction) => void;
};

function TransactionRow({ transaction, onSelect }: TransactionRowProps) {
  const { account, category, description } = transaction;
  const isIncome = category.type === "INCOME";

  // рядок поводиться як кнопка: фокус з клавіатури, Enter і пробіл
  const selectProps = onSelect && {
    tabIndex: 0,
    onClick: () => onSelect(transaction),
    onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      // пробіл інакше прокрутив би сторінку
      event.preventDefault();
      onSelect(transaction);
    },
  };

  return (
    <tr
      {...selectProps}
      className={cn(
        "border-b border-surface last:border-0",
        onSelect &&
          "cursor-pointer transition-colors outline-none hover:bg-surface/40 focus-visible:bg-surface/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
      )}
    >
      <td className={cn(cellClassName, "whitespace-nowrap text-muted tabular-nums")}>
        {formatDate(transaction.date)}
      </td>

      <td className={cellClassName}>
        <div className="flex items-center gap-3">
          <CategoryIcon icon={category.icon} color={category.color} className="size-8" />
          <span className="max-w-48 truncate font-medium text-ink" title={category.name}>
            {category.name}
          </span>
        </div>
      </td>

      <td className={cellClassName}>
        {description ? (
          // title — щоб обрізаний опис можна було прочитати при наведенні
          <p className="max-w-80 truncate text-ink" title={description}>
            {description}
          </p>
        ) : (
          <span className="text-gray">—</span>
        )}
      </td>

      <td className={cellClassName}>
        <p className="max-w-48 truncate text-ink" title={account.name}>
          {account.name}
        </p>
      </td>

      <td
        className={cn(
          cellClassName,
          "text-right font-semibold whitespace-nowrap tabular-nums",
          isIncome ? "text-teal" : "text-ink",
        )}
      >
        {/* сума з бекенду завжди додатна, знак беремо з типу категорії */}
        {isIncome ? "+" : "−"}
        {formatMoney(transaction.amount, account.currency)}
      </td>
    </tr>
  );
}

export { TransactionsTable };
export type { TransactionsTableProps };
