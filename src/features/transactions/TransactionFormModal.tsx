import { format, parseISO } from "date-fns";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccounts, type Account } from "@/features/accounts";
import { useMe } from "@/features/auth";
import {
  CATEGORY_TYPE_LABELS,
  CATEGORY_TYPES,
  useCategories,
  type Category,
} from "@/features/categories";
import { getErrorMessage } from "@/shared/api";
import {
  DatePicker,
  Field,
  FieldDescription,
  FieldError,
  Form,
  Input,
  Modal,
  SearchSelect,
  SegmentedControl,
  Select,
  Text,
} from "@/shared/ui";
import type {
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from "./transactions.api";
import { useCreateTransaction, useUpdateTransaction } from "./transactions.hooks";

const FORM_ID = "transaction-form";

const transactionSchema = z.object({
  type: z.enum(CATEGORY_TYPES),
  amount: z
    .string()
    .transform((value) => value.replace(/\s/g, "").replace(",", "."))
    .pipe(
      z
        .string()
        .min(1, "Введіть суму")
        .regex(/^\d{1,15}(\.\d{1,2})?$/, "Введіть суму, наприклад 250,00")
        .refine((value) => Number(value) > 0, "Сума має бути більшою за 0"),
    ),
  date: z.date(),
  accountId: z.string().min(1, "Оберіть рахунок"),
  categoryId: z.string().min(1, "Оберіть категорію"),
  description: z.string().trim().max(255, "Не більше 255 символів"),
});

type TransactionFormInput = z.input<typeof transactionSchema>;
type TransactionFormValues = z.output<typeof transactionSchema>;

const TYPE_ITEMS = CATEGORY_TYPES.map((type) => ({
  value: type,
  label: CATEGORY_TYPE_LABELS[type],
}));

const CREATE_ERROR_MESSAGES: Record<string, string> = {
  NOT_FOUND: "Рахунок або категорію не знайдено. Можливо, їх щойно видалили.",
  BAD_REQUEST: "До архівного рахунку не можна додати транзакцію.",
};

const UPDATE_ERROR_MESSAGES: Record<string, string> = {
  NOT_FOUND: "Транзакцію, рахунок або категорію не знайдено. Можливо, їх щойно видалили.",
  BAD_REQUEST: "На архівний рахунок не можна перенести транзакцію.",
};

// "1250.5" → "1250,50": у тому ж вигляді, у якому суму вводять у поле
function toAmountInput(amount: string): string {
  const [whole, fraction = ""] = amount.split(".");
  return `${whole},${fraction.replace(/0+$/, "").padEnd(2, "0")}`;
}

function toFormValues(
  transaction: Transaction | null,
  accounts: Account[],
  defaultAccountId: string | null,
): TransactionFormInput {
  if (!transaction) {
    // рахунок за замовчуванням із налаштувань, якщо він є серед доступних
    const defaultAccount = accounts.find(({ id }) => id === defaultAccountId) ?? accounts[0];

    return {
      type: "EXPENSE",
      amount: "",
      date: new Date(),
      accountId: defaultAccount?.id ?? "",
      categoryId: "",
      description: "",
    };
  }

  return {
    type: transaction.category.type,
    amount: toAmountInput(transaction.amount),
    // "YYYY-MM-DD" без часу date-fns читає як локальну північ — так само працює календар
    date: parseISO(transaction.date.slice(0, 10)),
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    description: transaction.description ?? "",
  };
}

function toInput(values: TransactionFormValues): CreateTransactionInput {
  return {
    accountId: values.accountId,
    categoryId: values.categoryId,
    amount: values.amount,
    // дата з календаря — локальна північ, тож і форматуємо в локальному часі
    date: format(values.date, "yyyy-MM-dd"),
    description: values.description,
  };
}

// шлемо лише змінене: незмінний, але архівний рахунок бекенд відхилив би
function getChanges(transaction: Transaction, input: CreateTransactionInput): UpdateTransactionInput {
  const description = input.description || null;

  return {
    ...(input.accountId !== transaction.accountId && { accountId: input.accountId }),
    ...(input.categoryId !== transaction.categoryId && { categoryId: input.categoryId }),
    ...(Number(input.amount) !== Number(transaction.amount) && { amount: input.amount }),
    ...(input.date !== transaction.date.slice(0, 10) && { date: input.date }),
    ...(description !== transaction.description && { description }),
  };
}

type TransactionFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // не передано — створення нової транзакції
  transaction?: Transaction | null;
  // після успішного збереження, коли модалка вже закривається
  onSuccess?: () => void;
};

function TransactionFormModal({
  open,
  onOpenChange,
  transaction = null,
  onSuccess,
}: TransactionFormModalProps) {
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  // архівні теж, бо транзакція, яку редагуємо, може бути саме на такому рахунку
  const { data: allAccounts } = useAccounts({ includeArchived: true });
  const { data: categories } = useCategories();
  const { data: me } = useMe();

  // бекенд приймає транзакції лише на власні неархівні рахунки;
  // поточний рахунок транзакції лишаємо в списку, навіть якщо він уже в архіві
  const accounts = allAccounts?.filter(
    (account) => account.isMine && (!account.archived || account.id === transaction?.accountId),
  );
  const ready = !!accounts && !!categories;
  const isPending = createTransaction.isPending || updateTransaction.isPending;

  const onSubmit = async (values: TransactionFormValues) => {
    const input = toInput(values);

    if (transaction) {
      const changes = getChanges(transaction, input);
      // порожній PATCH бекенд не приймає, та й запит тоді не потрібен
      if (Object.keys(changes).length > 0) {
        await updateTransaction.mutateAsync({ id: transaction.id, ...changes });
      }
    } else {
      await createTransaction.mutateAsync({ ...input, description: input.description || undefined });
    }

    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={transaction ? "Редагувати транзакцію" : "Нова транзакція"}
      description={
        transaction
          ? "Змініть суму, дату, рахунок, категорію чи опис."
          : "Запишіть витрату чи дохід на один із ваших рахунків."
      }
      confirmText={transaction ? "Зберегти зміни" : "Зберегти"}
      formId={FORM_ID}
      confirmDisabled={!ready || accounts.length === 0 || isPending}
      className="w-160"
    >
      {/* форму монтуємо, коли є рахунки й категорії: від них залежать значення за замовчуванням */}
      {ready ? (
        <TransactionForm
          key={transaction?.id ?? "new"}
          transaction={transaction}
          accounts={accounts}
          categories={categories}
          defaultAccountId={me?.defaultAccountId ?? null}
          onSubmit={onSubmit}
        />
      ) : (
        <Text size="sm" className="text-muted">
          Завантаження…
        </Text>
      )}
    </Modal>
  );
}

type TransactionFormProps = {
  transaction: Transaction | null;
  accounts: Account[];
  categories: Category[];
  defaultAccountId: string | null;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
};

function TransactionForm({
  transaction,
  accounts,
  categories,
  defaultAccountId,
  onSubmit,
}: TransactionFormProps) {
  const form = useForm<TransactionFormInput, unknown, TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: toFormValues(transaction, accounts, defaultAccountId),
  });
  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = form;
  const [type, accountId] = useWatch({ control, name: ["type", "accountId"] });

  const currency = accounts.find(({ id }) => id === accountId)?.currency;

  const accountItems = accounts.map((account) => ({
    value: account.id,
    label: `${account.name} · ${account.currency}${account.archived ? " (в архіві)" : ""}`,
  }));

  const categoryItems = categories
    .filter((category) => category.type === type)
    .map((category) => ({ value: category.id, label: category.name }));

  const handleSubmit = async (values: TransactionFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const messages = transaction ? UPDATE_ERROR_MESSAGES : CREATE_ERROR_MESSAGES;
      form.setError("root", { message: getErrorMessage(error, messages) });
    }
  };

  return (
    <Form id={FORM_ID} form={form} onSubmit={handleSubmit} className="gap-5">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <SegmentedControl
            aria-label="Тип транзакції"
            items={TYPE_ITEMS}
            value={field.value}
            onValueChange={(next) => {
              field.onChange(next);
              // категорія іншого типу до нової транзакції не підходить — скидаємо її
              const category = categories.find(({ id }) => id === getValues("categoryId"));
              if (category && category.type !== next) setValue("categoryId", "");
            }}
          />
        )}
      />

      <div className="grid grid-cols-2 items-start gap-4">
        <Field data-invalid={!!errors.amount}>
          <Input
            label="Сума"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0,00"
            suffix={currency}
            aria-invalid={!!errors.amount}
            {...register("amount")}
          />
          <FieldError errors={[errors.amount]} />
        </Field>

        <Field>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker label="Дата" value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>

        <Field data-invalid={!!errors.accountId}>
          <Controller
            control={control}
            name="accountId"
            render={({ field }) => (
              <Select
                label="Рахунок"
                items={accountItems}
                placeholder="Оберіть рахунок"
                name={field.name}
                value={field.value || null}
                onValueChange={(value) => value && field.onChange(value)}
                disabled={accounts.length === 0}
                aria-invalid={!!errors.accountId}
              />
            )}
          />
          {accounts.length === 0 ? (
            <FieldDescription className="text-12">
              Спершу <Link to="/accounts">створіть рахунок</Link>.
            </FieldDescription>
          ) : (
            <FieldError errors={[errors.accountId]} />
          )}
        </Field>

        <Field data-invalid={!!errors.categoryId}>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <SearchSelect
                label="Категорія"
                items={categoryItems}
                placeholder="Оберіть категорію"
                searchPlaceholder="Пошук категорії"
                emptyText="Категорій з такою назвою немає"
                name={field.name}
                value={field.value || null}
                onValueChange={(value) => value && field.onChange(value)}
                disabled={categoryItems.length === 0}
                aria-invalid={!!errors.categoryId}
              />
            )}
          />
          {categoryItems.length === 0 ? (
            <FieldDescription className="text-12">
              Категорій цього типу немає. <Link to="/categories">Створіть категорію</Link>.
            </FieldDescription>
          ) : (
            <FieldError errors={[errors.categoryId]} />
          )}
        </Field>
      </div>

      <Field data-invalid={!!errors.description}>
        <Input
          label="Опис"
          autoComplete="off"
          placeholder="Необовʼязково, наприклад «Кава з колегами»"
          maxLength={255}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        <FieldError errors={[errors.description]} />
      </Field>

      <FieldError errors={[errors.root]} />
    </Form>
  );
}

export { TransactionFormModal };
export type { TransactionFormModalProps };
