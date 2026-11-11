import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Card,
  Field,
  FieldDescription,
  FieldError,
  Form,
  Input,
  Text,
} from "@/shared/ui";
import { ConfirmPasswordModal } from "./ConfirmPasswordModal";
import { useChangePassword } from "./settings.hooks";

// ті самі правила, що й при реєстрації
const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Щонайменше 8 символів")
      .max(128, "Не більше 128 символів")
      .regex(/\p{L}/u, "Пароль має містити літеру")
      .regex(/\d/, "Пароль має містити цифру"),
    confirmPassword: z.string().min(1, "Повторіть пароль"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

// інших правил бекенд не перевіряє, тож VALIDATION_ERROR тут — новий пароль збігся з поточним
const ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: "Новий пароль має відрізнятися від поточного.",
};

function PasswordCard() {
  const changePassword = useChangePassword();
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
  const {
    register,
    formState: { errors, isDirty },
  } = form;
  const hintId = useId();
  // новий пароль чекає на підтвердження поточним
  const [pendingPassword, setPendingPassword] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onSubmit = ({ newPassword }: PasswordValues) => {
    setSaved(false);
    setPendingPassword(newPassword);
  };

  const onConfirmPassword = async (currentPassword: string) => {
    if (!pendingPassword) return;

    await changePassword.mutateAsync({ currentPassword, newPassword: pendingPassword });
    setPendingPassword(null);
    form.reset();
    setSaved(true);
  };

  return (
    <Card>
      <Form form={form} onSubmit={onSubmit} className="gap-5">
        <h2 className="text-16 font-semibold text-ink">Оновити пароль</h2>

        <div className="flex flex-col gap-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.newPassword}>
              <Input
                label="Пароль"
                type="password"
                autoComplete="new-password"
                placeholder="Новий пароль"
                aria-invalid={!!errors.newPassword}
                aria-describedby={hintId}
                {...register("newPassword")}
              />
              <FieldError errors={[errors.newPassword]} />
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <Input
                label="Повтор пароля"
                type="password"
                autoComplete="new-password"
                placeholder="Повторіть пароль"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              <FieldError errors={[errors.confirmPassword]} />
            </Field>
          </div>

          <FieldDescription id={hintId} className="text-12">
            Щонайменше 8 символів, літера та цифра.
          </FieldDescription>
        </div>

        <div className="flex items-center justify-end gap-4">
          {saved && !isDirty && (
            <Text role="status" size="xs" color="teal">
              Пароль оновлено. На інших пристроях потрібно буде увійти знову.
            </Text>
          )}
          <Button
            type="submit"
            variant="active"
            disabled={!isDirty || changePassword.isPending}
            className="h-11 w-48"
          >
            Зберегти пароль
          </Button>
        </div>
      </Form>

      <ConfirmPasswordModal
        open={pendingPassword !== null}
        onOpenChange={(open) => !open && setPendingPassword(null)}
        title="Підтвердіть зміну пароля"
        description="Щоб встановити новий пароль, введіть поточний."
        confirmText="Змінити пароль"
        pending={changePassword.isPending}
        onConfirm={onConfirmPassword}
        errorMessages={ERROR_MESSAGES}
      />
    </Card>
  );
}

export { PasswordCard };
