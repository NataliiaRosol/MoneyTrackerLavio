import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "@/features/auth";
import { getApiErrorCode, getErrorMessage } from "@/shared/api";
import { Button, Card, Field, FieldError, Form, Input, Text } from "@/shared/ui";
import { ConfirmPasswordModal } from "./ConfirmPasswordModal";
import { useChangeEmail, useUpdateProfile } from "./settings.hooks";

const personalDataSchema = z.object({
  // порожнє імʼя бекенд приймає як null — тоді скрізь показується email
  name: z.string().trim().max(100, "Не більше 100 символів"),
  email: z
    .string()
    .trim()
    .min(1, "Введіть email")
    .pipe(z.email("Некоректний email")),
});

type PersonalDataValues = z.infer<typeof personalDataSchema>;

function toFormValues(user: User): PersonalDataValues {
  return { name: user.name ?? "", email: user.email };
}

type PersonalDataCardProps = {
  user: User;
};

function PersonalDataCard({ user }: PersonalDataCardProps) {
  const updateProfile = useUpdateProfile();
  const changeEmail = useChangeEmail();
  const form = useForm<PersonalDataValues>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: toFormValues(user),
  });
  const {
    register,
    formState: { errors, isDirty, isSubmitting },
  } = form;
  // новий email чекає на підтвердження поточним паролем
  const [pendingValues, setPendingValues] = useState<PersonalDataValues | null>(null);
  const [saved, setSaved] = useState(false);

  const save = async (values: PersonalDataValues, currentPassword?: string) => {
    const name = values.name || null;
    let updated = user;

    // спершу email: він може не пройти (пароль, зайнята адреса), і тоді імʼя теж лишається старим
    if (currentPassword) {
      updated = await changeEmail.mutateAsync({ email: values.email, currentPassword });
    }
    if (name !== user.name) {
      updated = await updateProfile.mutateAsync({ name });
    }

    form.reset(toFormValues(updated));
    setSaved(true);
  };

  const onSubmit = async (values: PersonalDataValues) => {
    setSaved(false);

    // бекенд зберігає email у нижньому регістрі
    if (values.email.toLowerCase() !== user.email) {
      setPendingValues(values);
      return;
    }

    try {
      await save(values);
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  };

  const onConfirmPassword = async (currentPassword: string) => {
    if (!pendingValues) return;

    try {
      await save(pendingValues, currentPassword);
      setPendingValues(null);
    } catch (error) {
      // зайнятий email — помилка поля, а не пароля: закриваємо модалку і показуємо її біля email
      if (getApiErrorCode(error) === "CONFLICT") {
        setPendingValues(null);
        form.setError("email", { message: "Цей email уже зареєстровано" }, { shouldFocus: true });
        return;
      }
      throw error;
    }
  };

  return (
    <Card>
      <Form form={form} onSubmit={onSubmit} className="gap-5">
        <h2 className="text-16 font-semibold text-ink">Особисті дані</h2>

        <Field data-invalid={!!errors.name}>
          <Input
            label="Імʼя"
            autoComplete="name"
            placeholder="Ваше імʼя"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

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
            disabled={!isDirty || isSubmitting || updateProfile.isPending}
            className="h-11 w-48"
          >
            Зберегти зміни
          </Button>
        </div>
      </Form>

      <ConfirmPasswordModal
        open={pendingValues !== null}
        onOpenChange={(open) => !open && setPendingValues(null)}
        title="Підтвердіть зміну email"
        description="Щоб змінити email, введіть поточний пароль."
        confirmText="Змінити email"
        pending={changeEmail.isPending || updateProfile.isPending}
        onConfirm={onConfirmPassword}
      />
    </Card>
  );
}

export { PersonalDataCard };
export type { PersonalDataCardProps };
