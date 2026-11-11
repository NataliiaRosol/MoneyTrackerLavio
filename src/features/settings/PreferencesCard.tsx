import { useState } from "react";
import { useAccounts } from "@/features/accounts";
import type { User } from "@/features/auth";
import { getErrorMessage } from "@/shared/api";
import {
  Button,
  Card,
  Field,
  FieldDescription,
  FieldError,
  Select,
  Text,
} from "@/shared/ui";
import { useSetDefaultAccount } from "./settings.hooks";

// Select працює з рядками, тож «не обрано» позначаємо окремим значенням замість null
const NO_ACCOUNT = "none";

const ERROR_MESSAGES: Record<string, string> = {
  NOT_FOUND: "Рахунок не знайдено. Можливо, його видалили.",
  BAD_REQUEST: "Архівний рахунок не може бути за замовчуванням.",
};

type PreferencesCardProps = {
  user: User;
};

function PreferencesCard({ user }: PreferencesCardProps) {
  // архівні теж: поточний рахунок за замовчуванням могли заархівувати вже після вибору
  const { data: allAccounts } = useAccounts({ includeArchived: true });
  const setDefaultAccount = useSetDefaultAccount();

  const current = user.defaultAccountId ?? NO_ACCOUNT;
  const [accountId, setAccountId] = useState(current);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // бекенд дозволяє лише власні неархівні рахунки
  const accounts = allAccounts?.filter(
    (account) => account.isMine && (!account.archived || account.id === user.defaultAccountId),
  );
  const items = [
    { value: NO_ACCOUNT, label: "Не обрано" },
    ...(accounts ?? []).map((account) => ({
      value: account.id,
      label: `${account.name} · ${account.currency}${account.archived ? " (в архіві)" : ""}`,
    })),
  ];
  const isDirty = accountId !== current;

  const onSave = async () => {
    setSaved(false);
    setError(null);

    try {
      await setDefaultAccount.mutateAsync({
        accountId: accountId === NO_ACCOUNT ? null : accountId,
      });
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err, ERROR_MESSAGES));
    }
  };

  return (
    <Card className="flex flex-col gap-5">
      <h2 className="text-16 font-semibold text-ink">Вподобання</h2>

      <Field data-invalid={!!error}>
        {/* до завантаження рахунків Select показав би id замість назви */}
        {accounts ? (
          <Select
            label="Рахунок за замовчуванням"
            items={items}
            value={accountId}
            onValueChange={(value) => {
              if (!value) return;
              setAccountId(value);
              setError(null);
            }}
            aria-invalid={!!error}
          />
        ) : (
          <Text size="sm" className="text-muted">
            Завантаження…
          </Text>
        )}
        <FieldDescription className="text-12">
          Підставляється, коли ви додаєте нову транзакцію.
        </FieldDescription>
        <FieldError>{error}</FieldError>
      </Field>

      <div className="flex items-center justify-end gap-4">
        {saved && !isDirty && (
          <Text role="status" size="xs" color="teal">
            Збережено
          </Text>
        )}
        <Button
          variant="active"
          disabled={!isDirty || setDefaultAccount.isPending}
          onClick={onSave}
          className="h-11 w-48"
        >
          Зберегти
        </Button>
      </div>
    </Card>
  );
}

export { PreferencesCard };
export type { PreferencesCardProps };
