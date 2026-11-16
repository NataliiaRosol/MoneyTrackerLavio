import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResetPassword } from "@/features/auth";
import { getApiErrorCode, getErrorMessage } from "@/shared/api";
import {
  Button,
  buttonVariants,
  Field,
  FieldDescription,
  FieldError,
  Form,
  InfoNote,
  PasswordInput,
  StatusScreen,
  Text,
} from "@/shared/ui";
import shieldCheckIcon from "@/shared/icons/shield-check.png";
import brokenLinkIcon from "@/shared/icons/broken-link.png";

// ті самі правила, що й при реєстрації
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Щонайменше 8 символів")
      .max(128, "Не більше 128 символів")
      .regex(/\p{L}/u, "Пароль має містити літеру")
      .regex(/\d/, "Пароль має містити цифру"),
    confirmPassword: z.string().min(1, "Повторіть пароль"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

// бекенд віддає одну помилку на «немає / прострочене / вже використане»;
// пароль уже перевірений на клієнті, тож VALIDATION_ERROR — це теж зіпсований токен
const INVALID_LINK_CODES = ["BAD_REQUEST", "VALIDATION_ERROR"];

const activeLinkClassName = buttonVariants({ variant: "active" });
const defaultLinkClassName = buttonVariants();

type Status = "form" | "success" | "invalid-link";

// сюди веде посилання з листа: /reset-password?token=…&email=…
function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  // лише для тексту: чий пароль змінюється, вирішує токен
  const email = searchParams.get("email");
  const [status, setStatus] = useState<Status>("form");

  if (status === "success") return <PasswordChanged />;
  if (!token || status === "invalid-link") return <LinkExpired />;

  return (
    <ResetPasswordForm
      token={token}
      email={email}
      onSuccess={() => setStatus("success")}
      onInvalidLink={() => setStatus("invalid-link")}
    />
  );
}

type ResetPasswordFormProps = {
  token: string;
  email: string | null;
  onSuccess: () => void;
  onInvalidLink: () => void;
};

function ResetPasswordForm({
  token,
  email,
  onSuccess,
  onInvalidLink,
}: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;
  const resetPassword = useResetPassword();
  const hintId = useId();

  const onSubmit = async ({ password }: ResetPasswordValues) => {
    try {
      await resetPassword.mutateAsync({ token, password });
      onSuccess();
    } catch (error) {
      if (INVALID_LINK_CODES.includes(getApiErrorCode(error))) {
        onInvalidLink();
        return;
      }
      form.setError("root", { message: getErrorMessage(error) });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <Text as="h1" size="xl" weight="semibold" className="text-ink">
          Новий пароль
        </Text>
        <Text size="sm" className="text-muted">
          {email ? (
            <>
              Створіть надійний пароль для{" "}
              <span className="font-medium text-ink wrap-anywhere">{email}</span>.
            </>
          ) : (
            "Створіть надійний пароль для свого акаунту."
          )}
        </Text>
      </div>

      <Form form={form} onSubmit={onSubmit} className="mt-5.5 gap-5.5">
        <Field data-invalid={!!errors.password}>
          <PasswordInput
            label="Новий пароль"
            autoComplete="new-password"
            placeholder="Створіть пароль"
            aria-invalid={!!errors.password}
            aria-describedby={hintId}
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
          <FieldDescription id={hintId}>
            Щонайменше 8 символів, літера та цифра.
          </FieldDescription>
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <PasswordInput
            label="Повтор нового пароля"
            autoComplete="new-password"
            placeholder="Повторіть пароль"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          <FieldError errors={[errors.confirmPassword]} />
        </Field>

        <InfoNote>Після зміни пароля всі інші сеанси буде завершено.</InfoNote>

        <FieldError errors={[errors.root]} />

        <Button type="submit" variant="active" disabled={isSubmitting}>
          Зберегти новий пароль
        </Button>
      </Form>
    </div>
  );
}

function PasswordChanged() {
  return (
    <StatusScreen
      fullScreen={false}
      visual={<img src={shieldCheckIcon} alt="" aria-hidden />}
      title="Пароль змінено"
      description="Новий пароль збережено. Увійдіть з ним, щоб повернутися до свого простору."
      actions={
        <Link to="/login" replace className={activeLinkClassName}>
          Увійти
        </Link>
      }
    />
  );
}

function LinkExpired() {
  return (
    <StatusScreen
      fullScreen={false}
      visual={<img src={brokenLinkIcon} alt="" aria-hidden />}
      title="Посилання не діє"
      description="Посилання для відновлення пароля застаріло або вже було використане. Надішліть новий лист."
      actions={
        <>
          <Link to="/forgot-password" replace className={activeLinkClassName}>
            Надіслати нове посилання
          </Link>
          <Link to="/login" replace className={defaultLinkClassName}>
            Повернутися до входу
          </Link>
        </>
      }
    />
  );
}

export default ResetPasswordPage;
