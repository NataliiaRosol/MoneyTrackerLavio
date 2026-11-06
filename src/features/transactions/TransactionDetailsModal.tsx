import { Pencil, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AccountIcon, useAccounts } from "@/features/accounts";
import { CATEGORY_TYPE_LABELS, CategoryIcon } from "@/features/categories";
import { formatDate, formatLongDate, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge, Button, Modal } from "@/shared/ui";
import { DeleteTransactionModal } from "./DeleteTransactionModal";
import type { Transaction } from "./transactions.api";
import { TransactionFormModal } from "./TransactionFormModal";

type TransactionDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
};

function TransactionDetailsModal({ open, onOpenChange, transaction }: TransactionDetailsModalProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // після збереження чи видалення показані деталі вже неактуальні — закриваємо й їх
  const close = () => onOpenChange(false);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Деталі транзакції"
      className="w-160"
      footer={
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="cancel"
            className="h-11"
            disabled={!transaction}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 aria-hidden className="size-4" />
            Видалити
          </Button>
          <Button
            variant="active"
            className="h-11"
            disabled={!transaction}
            onClick={() => setEditOpen(true)}
          >
            <Pencil aria-hidden className="size-4" />
            Редагувати
          </Button>
        </div>
      }
    >
      {transaction && <TransactionDetails transaction={transaction} />}

      {/* вкладені модалки: «Скасувати» в них повертає назад до деталей */}
      <TransactionFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        transaction={transaction}
        onSuccess={close}
      />
      <DeleteTransactionModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        transaction={transaction}
        onSuccess={close}
      />
    </Modal>
  );
}

function TransactionDetails({ transaction }: { transaction: Transaction }) {
  const { account, category, description } = transaction;
  const isIncome = category.type === "INCOME";

  // у транзакції немає типу рахунку, а від нього залежить іконка за замовчуванням
  const { data: accounts } = useAccounts({ includeArchived: true });
  const fullAccount = accounts?.find(({ id }) => id === account.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-3">
        <Badge variant={isIncome ? "success" : "danger"} className="px-2.5 py-1 text-13">
          {CATEGORY_TYPE_LABELS[category.type]}
        </Badge>

        <div className="flex flex-col gap-1">
          <p
            className={cn(
              "text-30 font-semibold tabular-nums",
              isIncome ? "text-teal" : "text-ink",
            )}
          >
            {/* сума з бекенду завжди додатна, знак беремо з типу категорії */}
            {isIncome ? "+" : "−"}
            {formatMoney(transaction.amount, account.currency)}
          </p>
          <p className="text-13 text-muted first-letter:uppercase">
            {formatLongDate(transaction.date)}
          </p>
        </div>
      </div>

      <dl className="flex flex-col rounded-2xl border border-surface">
        <DetailsRow label="Рахунок">
          <div className="flex min-w-0 items-center gap-3">
            <AccountIcon
              type={fullAccount?.type ?? "OTHER"}
              icon={account.icon}
              color={account.color}
              className="size-8"
            />
            <span className="truncate font-medium" title={account.name}>
              {account.name}
            </span>
            <Badge>{account.currency}</Badge>
            {fullAccount?.archived && <Badge>В архіві</Badge>}
          </div>
        </DetailsRow>

        <DetailsRow label="Категорія">
          <div className="flex min-w-0 items-center gap-3">
            <CategoryIcon icon={category.icon} color={category.color} className="size-8" />
            <span className="truncate font-medium" title={category.name}>
              {category.name}
            </span>
          </div>
        </DetailsRow>

        <DetailsRow label="Дата">
          <span className="tabular-nums">{formatDate(transaction.date)}</span>
        </DetailsRow>

        <DetailsRow label="Опис" className="items-start">
          {description ? (
            <p className="break-words whitespace-pre-line">{description}</p>
          ) : (
            <span className="text-gray">Без опису</span>
          )}
        </DetailsRow>
      </dl>
    </div>
  );
}

type DetailsRowProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

function DetailsRow({ label, children, className }: DetailsRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-4 border-b border-surface px-5 py-3.5 last:border-0",
        className,
      )}
    >
      <dt className="text-13 text-muted">{label}</dt>
      <dd className="text-14 text-ink">{children}</dd>
    </div>
  );
}

export { TransactionDetailsModal };
export type { TransactionDetailsModalProps };
