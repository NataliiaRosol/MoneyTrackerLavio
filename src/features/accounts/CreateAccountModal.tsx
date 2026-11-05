import { useId, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getApiErrorCode, getErrorMessage } from "@/shared/api";
import { ICON_NAMES, type IconName } from "@/shared/icons";
import {
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  Form,
  Input,
  Modal,
  Select,
} from "@/shared/ui";
import { CURRENCIES } from "./accounts.api";
import {
  ACCOUNT_TYPE_ICON_NAMES,
  CURRENCY_LABELS,
  getAccountTypeByIcon,
} from "./accounts.constants";
import { useCreateAccount } from "./accounts.hooks";
import { AccountIconPicker } from "./AccountIconPicker";

const FORM_ID = "create-account-form";

const accountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Введіть назву")
    .max(50, "Не більше 50 символів"),
  icon: z.enum(ICON_NAMES),
  currency: z.enum(CURRENCIES),
  initialBalance: z
    .string()
    .transform((value) => value.replace(/\s/g, "").replace(",", ".") || "0")
    .pipe(
      z
        .string()
        .regex(/^-?\d{1,15}(\.\d{1,2})?$/, "Введіть суму, наприклад 1500,00"),
    ),
  includeInTotal: z.boolean(),
});

type AccountFormInput = z.input<typeof accountSchema>;
type AccountFormValues = z.output<typeof accountSchema>;

const CURRENCY_ITEMS = CURRENCIES.map((currency) => ({
  value: currency,
  label: CURRENCY_LABELS[currency],
}));

const DEFAULT_VALUES: AccountFormInput = {
  name: "",
  icon: ACCOUNT_TYPE_ICON_NAMES.CARD,
  currency: "UAH",
  initialBalance: "0,00",
  includeInTotal: true,
};

function includeInTotalByIcon(icon: IconName): boolean {
  return getAccountTypeByIcon(icon) !== "SAVINGS";
}

type CreateAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function CreateAccountModal({ open, onOpenChange }: CreateAccountModalProps) {
  const createAccount = useCreateAccount();

  const onSubmit = async (values: AccountFormValues) => {
    await createAccount.mutateAsync({ ...values, type: getAccountTypeByIcon(values.icon) });
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Новий рахунок"
      description="Додайте рахунок, щоб вести кошти окремо."
      confirmText="Створити рахунок"
      formId={FORM_ID}
      confirmDisabled={createAccount.isPending}
    >
      <CreateAccountForm onSubmit={onSubmit} />
    </Modal>
  );
}

type CreateAccountFormProps = {
  onSubmit: (values: AccountFormValues) => Promise<void>;
};

function CreateAccountForm({ onSubmit }: CreateAccountFormProps) {
  const form = useForm<AccountFormInput, unknown, AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;
  const currency = useWatch({ control, name: "currency" });
  const includeInTotalId = useId();
  const [includeInTotalTouched, setIncludeInTotalTouched] = useState(false);

  const handleSubmit = async (values: AccountFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      if (getApiErrorCode(error) === "CONFLICT") {
        form.setError("name", { message: "Рахунок з такою назвою вже існує" });
        return;
      }
      form.setError("root", { message: getErrorMessage(error) });
    }
  };

  return (
    <Form id={FORM_ID} form={form} onSubmit={handleSubmit} className="gap-5">
      <Field data-invalid={!!errors.name}>
        <Input
          label="Назва"
          autoComplete="off"
          placeholder="Наприклад, Основна картка"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        <FieldError errors={[errors.name]} />
      </Field>

      <Controller
        control={control}
        name="icon"
        render={({ field }) => (
          <AccountIconPicker
            value={field.value}
            onChange={(icon) => {
              field.onChange(icon);
              if (!includeInTotalTouched) setValue("includeInTotal", includeInTotalByIcon(icon));
            }}
          />
        )}
      />

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
      </Field>

      <Field data-invalid={!!errors.initialBalance}>
        <Input
          label="Початковий залишок"
          inputMode="decimal"
          autoComplete="off"
          suffix={currency}
          hint="Це стартовий залишок, а не дохід."
          aria-invalid={!!errors.initialBalance}
          {...register("initialBalance")}
        />
        <FieldError errors={[errors.initialBalance]} />
      </Field>

      <Controller
        control={control}
        name="includeInTotal"
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id={includeInTotalId}
              name={field.name}
              checked={field.value}
              onCheckedChange={(checked) => {
                setIncludeInTotalTouched(true);
                field.onChange(checked);
              }}
              inputRef={field.ref}
            />
            <FieldContent>
              <FieldLabel htmlFor={includeInTotalId} className="text-ink">
                Враховувати в загальному балансі
              </FieldLabel>
              <FieldDescription className="text-12">
                Залишок рахунку входить у «Власний баланс».
              </FieldDescription>
            </FieldContent>
          </Field>
        )}
      />

      <FieldError errors={[errors.root]} />
    </Form>
  );
}

export { CreateAccountModal };
export type { CreateAccountModalProps };
