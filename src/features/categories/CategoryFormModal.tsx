import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getApiErrorCode, getErrorMessage } from "@/shared/api";
import {
  Field,
  FieldDescription,
  FieldError,
  Form,
  Input,
  Modal,
  Select,
} from "@/shared/ui";
import { CATEGORY_TYPES, type Category } from "./categories.api";
import { CATEGORY_TYPE_LABELS } from "./categories.constants";
import { useCreateCategory, useUpdateCategory } from "./categories.hooks";
import { CATEGORY_ICON_NAMES, isCategoryIconName } from "./categories.icons";
import { CategoryIconPicker } from "./CategoryIconPicker";

const FORM_ID = "category-form";

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Введіть назву")
    .max(50, "Не більше 50 символів"),
  type: z.enum(CATEGORY_TYPES),
  icon: z.enum(CATEGORY_ICON_NAMES).nullable(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const TYPE_ITEMS = CATEGORY_TYPES.map((type) => ({
  value: type,
  label: CATEGORY_TYPE_LABELS[type],
}));

function toFormValues(category: Category | null): CategoryFormValues {
  return {
    name: category?.name ?? "",
    type: category?.type ?? "EXPENSE",
    // у старих записах може бути іконка, якої вже немає в списку
    icon: category?.icon && isCategoryIconName(category.icon) ? category.icon : null,
  };
}

type CategoryFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // null — створення нової категорії
  category: Category | null;
};

function CategoryFormModal({ open, onOpenChange, category }: CategoryFormModalProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const onSubmit = async ({ name, type, icon }: CategoryFormValues) => {
    if (category) {
      await updateCategory.mutateAsync({ id: category.id, name, icon });
    } else {
      // бекенд приймає icon лише як рядок або відсутнє поле, не null
      await createCategory.mutateAsync({ name, type, icon: icon ?? undefined });
    }
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={category ? "Редагувати категорію" : "Нова категорія"}
      description="Ваші категорії використовуються у ваших рахунках."
      confirmText={category ? "Зберегти зміни" : "Створити категорію"}
      formId={FORM_ID}
      confirmDisabled={createCategory.isPending || updateCategory.isPending}
    >
      {/* вміст модалки розмонтовується після закриття, тож кожне відкриття стартує з defaultValues */}
      <CategoryForm key={category?.id ?? "new"} category={category} onSubmit={onSubmit} />
    </Modal>
  );
}

type CategoryFormProps = {
  category: Category | null;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
};

function CategoryForm({ category, onSubmit }: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: toFormValues(category),
  });
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      if (getApiErrorCode(error) === "CONFLICT") {
        form.setError("name", { message: "Категорія з такою назвою вже існує" });
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
          placeholder="Введіть назву"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        <FieldError errors={[errors.name]} />
      </Field>

      <Field>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              label="Тип"
              items={TYPE_ITEMS}
              name={field.name}
              value={field.value}
              onValueChange={(value) => value && field.onChange(value)}
              disabled={!!category}
            />
          )}
        />
        {category && (
          <FieldDescription className="text-12">
            Тип не можна змінити після створення.
          </FieldDescription>
        )}
      </Field>

      <Controller
        control={control}
        name="icon"
        render={({ field }) => (
          <CategoryIconPicker value={field.value} onChange={field.onChange} />
        )}
      />

      <FieldError errors={[errors.root]} />
    </Form>
  );
}

export { CategoryFormModal };
export type { CategoryFormModalProps };
