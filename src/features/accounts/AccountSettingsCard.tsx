import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { z } from "zod";
import { getApiErrorCode, getErrorMessage } from "@/shared/api";
import {
  Button,
  Card,
  Field,
  FieldDescription,
  FieldError,
  Form,
  Input,
  Select,
  Text,
} from "@/shared/ui";
import { CURRENCIES, type AccountDetails } from "./accounts.api";
import {
  ACCOUNT_NAME_CONFLICT_MESSAGE,
  accountNameSchema,
  CURRENCY_ITEMS,
  CURRENCY_LABELS,
} from "./accounts.constants";
import { useAccount, useUpdateAccount } from "./accounts.hooks";

const settingsSchema = z.object({
  name: accountNameSchema,
  currency: z.enum(CURRENCIES),
});

type AccountSettingsValues = z.infer<typeof settingsSchema>;

const toFormValues = ({ name, currency }: AccountDetails): AccountSettingsValues => ({
  name,
  currency,
});

type AccountSettingsCardProps = {
  account: AccountDetails;
};

function AccountSettingsCard({ account }: AccountSettingsCardProps) {
  const updateAccount = useUpdateAccount();
  // той самий запит, що й на сторінці: потрібен, щоб перепитати рахунок після 409
  const { refetch: refetchAccount } = useAccount(account.id);
  const form = useForm<AccountSettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: toFormValues(account),
  });
  const {
    register,
    control,
    formState: { errors, isDirty, isSubmitting },
  } = form;
  const [saved, setSaved] = useState(false);

  const onSubmit = async (values: AccountSettingsValues) => {
    setSaved(false);

    try {
      // шлемо обидва поля: незмінену валюту бекенд приймає й для рахунку з транзакціями
      const updated = await updateAccount.mutateAsync({ id: account.id, ...values });
      form.reset(toFormValues(updated));
      setSaved(true);
    } catch (error) {
      if (getApiErrorCode(error) !== "CONFLICT") {
        form.setError("root", { message: getErrorMessage(error) });
        return;
      }

      // CONFLICT означає або зайняту назву, або нову валюту для рахунку, де вже є транзакції
      // (наприклад, їх додали з іншої вкладки). Розрізняємо за свіжими даними рахунку
      if (values.currency !== account.currency) {
        const { data: fresh } = await refetchAccount();
        if (fresh?.hasTransactions) {
          // поле вже заблоковане, тож повертаємо в ньому поточну валюту
          form.resetField("currency", { defaultValue: fresh.currency });
          form.setError("root", {
            message: "У рахунку вже зʼявилися транзакції, тому валюту змінити не можна.",
          });
          return;
        }
      }

      form.setError("name", { message: ACCOUNT_NAME_CONFLICT_MESSAGE }, { shouldFocus: true });
    }
  };

  return (
    <Card>
      <Form form={form} onSubmit={onSubmit} className="gap-5">
        <h2 className="text-16 font-semibold text-ink">Налаштування рахунку</h2>

        <div className="grid items-start gap-4 md:grid-cols-2">
          <Field data-invalid={!!errors.name}>
            <Input
              label="Назва рахунку"
              autoComplete="off"
              placeholder="Наприклад, Основна картка"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          {account.hasTransactions ? (
            // суми транзакцій уже в цій валюті, тож бекенд її не змінить
            <Field>
              <Input
                label="Валюта · захищено"
                value={CURRENCY_LABELS[account.currency]}
                readOnly
                suffix={<Lock aria-hidden className="size-4" />}
                hint="Валюту рахунку з транзакціями змінити не можна."
                className="bg-canvas"
              />
            </Field>
          ) : (
            <Field>
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <Select
                    label="Валюта"
                    items={CURRENCY_ITEMS}
                    name={field.name}
                    value={field.value}
                    onValueChange={(value) => value && field.onChange(value)}
                  />
                )}
              />
              <FieldDescription className="text-12">
                Змінити валюту можна, поки в рахунку немає транзакцій.
              </FieldDescription>
            </Field>
          )}
        </div>

        <FieldError errors={[errors.root]} />

        <div className="flex items-center justify-end gap-4">
          {saved && !isDirty && (
            <Text role="status" size="xs" color="teal">
              Зміни збережено
            </Text>
          )}
          <Button
            type="submit"
            variant="active"
            disabled={!isDirty || isSubmitting}
            className="h-11 w-48"
          >
            Зберегти зміни
          </Button>
        </div>
      </Form>
    </Card>
  );
}

export { AccountSettingsCard };
export type { AccountSettingsCardProps };
