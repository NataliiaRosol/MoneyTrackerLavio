import { CATEGORY_TYPE_LABELS } from "@/features/categories";
import { formatDate, formatMoney } from "@/lib/format";
import { getErrorMessage } from "@/shared/api";
import { FieldError, InfoNote, Modal } from "@/shared/ui";
import type { Transaction } from "./transactions.api";
import { useDeleteTransaction } from "./transactions.hooks";

const DELETE_ERROR_MESSAGES = {
  NOT_FOUND: "Транзакцію не знайдено. Можливо, її вже видалили.",
};

type DeleteTransactionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  // після успішного видалення, коли модалка вже закривається
  onSuccess?: () => void;
};

function DeleteTransactionModal({
  open,
  onOpenChange,
  transaction,
  onSuccess,
}: DeleteTransactionModalProps) {
  const deleteTransaction = useDeleteTransaction();

  const onConfirm = () => {
    if (!transaction) return;
    deleteTransaction.mutate(transaction.id, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      // помилку скидаємо, коли модалка вже зникла, інакше вона стрибне по висоті під час анімації
      onOpenChangeComplete={(isOpen) => !isOpen && deleteTransaction.reset()}
      variant="destructive"
      title="Видалити транзакцію?"
      description={
        transaction &&
        `${CATEGORY_TYPE_LABELS[transaction.category.type]} ${formatMoney(transaction.amount, transaction.account.currency)} · ${transaction.category.name} · ${formatDate(transaction.date)}`
      }
      confirmText="Видалити"
      onConfirm={onConfirm}
      confirmDisabled={deleteTransaction.isPending}
    >
      <div className="flex flex-col gap-3">
        <InfoNote title="Цю дію не можна скасувати" className="bg-cream">
          Баланс рахунку «{transaction?.account.name}» перерахується без цієї транзакції.
        </InfoNote>
        {deleteTransaction.error && (
          <FieldError
            errors={[{ message: getErrorMessage(deleteTransaction.error, DELETE_ERROR_MESSAGES) }]}
          />
        )}
      </div>
    </Modal>
  );
}

export { DeleteTransactionModal };
export type { DeleteTransactionModalProps };
