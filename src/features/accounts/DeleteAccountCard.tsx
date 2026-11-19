import { useState } from "react";
import { getErrorMessage } from "@/shared/api";
import { Button, Card, FieldError, InfoNote, Modal, Text } from "@/shared/ui";
import type { Account } from "./accounts.api";
import { useDeleteAccount } from "./accounts.hooks";

const DELETE_ERROR_MESSAGES = {
  NOT_FOUND: "Рахунок уже видалено.",
};

type DeleteAccountCardProps = {
  account: Account;
  // після видалення сторінка рахунку вже не має сенсу — напр. перейти до списку
  onDeleted: () => void;
};

function DeleteAccountCard({ account, onDeleted }: DeleteAccountCardProps) {
  const [open, setOpen] = useState(false);
  const deleteAccount = useDeleteAccount();

  const onConfirm = () => deleteAccount.mutate(account.id, { onSuccess: onDeleted });

  return (
    <Card className="flex flex-col items-start gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-16 font-semibold text-ink">Видалення рахунку</h2>
        <Text size="xs" className="text-muted">
          Видалити рахунок і всі його транзакції.
        </Text>
      </div>

      <Button variant="cancel" className="h-11 w-48" onClick={() => setOpen(true)}>
        Видалити рахунок
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        // помилку скидаємо, коли модалка вже зникла, інакше вона стрибне по висоті під час анімації
        onOpenChangeComplete={(isOpen) => !isOpen && deleteAccount.reset()}
        variant="destructive"
        title={`Видалити рахунок «${account.name}»?`}
        confirmText="Видалити"
        onConfirm={onConfirm}
        confirmDisabled={deleteAccount.isPending}
      >
        <div className="flex flex-col gap-3">
          <InfoNote title="Цю дію не можна скасувати" className="bg-cream">
            Разом із рахунком назавжди зникнуть усі його транзакції.
          </InfoNote>
          {deleteAccount.error && (
            <FieldError
              errors={[{ message: getErrorMessage(deleteAccount.error, DELETE_ERROR_MESSAGES) }]}
            />
          )}
        </div>
      </Modal>
    </Card>
  );
}

export { DeleteAccountCard };
export type { DeleteAccountCardProps };
