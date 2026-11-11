import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getApiErrorCode, getErrorMessage } from "@/shared/api";
import { Field, FieldError, Form, Input, Modal } from "@/shared/ui";

const FORM_ID = "confirm-password-form";

const confirmPasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Введіть поточний пароль")
    .max(128, "Не більше 128 символів"),
});

type ConfirmPasswordValues = z.infer<typeof confirmPasswordSchema>;

const ERROR_MESSAGES: Record<string, string> = {
  // акаунт створено через Google — пароля немає
  BAD_REQUEST: "Для цього акаунта пароль не встановлено.",
};

type ConfirmPasswordModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmText: ReactNode;
  pending?: boolean;
  // помилку з бекенду модалка покаже сама; закривати модалку після успіху — справа викликача
  onConfirm: (currentPassword: string) => Promise<void>;
  // тексти помилок за кодом, специфічні для конкретної дії
  errorMessages?: Record<string, string>;
};

function ConfirmPasswordModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  pending,
  onConfirm,
  errorMessages,
}: ConfirmPasswordModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmText={confirmText}
      formId={FORM_ID}
      confirmDisabled={pending}
    >
      {/* вміст модалки монтується лише коли вона відкрита, тож поле щоразу порожнє */}
      <ConfirmPasswordForm onConfirm={onConfirm} errorMessages={errorMessages} />
    </Modal>
  );
}

type ConfirmPasswordFormProps = Pick<ConfirmPasswordModalProps, "onConfirm" | "errorMessages">;

function ConfirmPasswordForm({ onConfirm, errorMessages }: ConfirmPasswordFormProps) {
  const form = useForm<ConfirmPasswordValues>({
    resolver: zodResolver(confirmPasswordSchema),
    defaultValues: { currentPassword: "" },
  });
  const {
    register,
    formState: { errors },
  } = form;

  const onSubmit = async ({ currentPassword }: ConfirmPasswordValues) => {
    try {
      await onConfirm(currentPassword);
    } catch (error) {
      if (getApiErrorCode(error) === "INVALID_PASSWORD") {
        form.setError("currentPassword", { message: "Невірний пароль" }, { shouldFocus: true });
        return;
      }
      form.setError("root", {
        message: getErrorMessage(error, { ...ERROR_MESSAGES, ...errorMessages }),
      });
    }
  };

  return (
    <Form id={FORM_ID} form={form} onSubmit={onSubmit} className="gap-5">
      <Field data-invalid={!!errors.currentPassword}>
        <Input
          label="Поточний пароль"
          type="password"
          autoComplete="current-password"
          placeholder="Введіть поточний пароль"
          aria-invalid={!!errors.currentPassword}
          {...register("currentPassword")}
        />
        <FieldError errors={[errors.currentPassword]} />
      </Field>

      <FieldError errors={[errors.root]} />
    </Form>
  );
}

export { ConfirmPasswordModal };
export type { ConfirmPasswordModalProps };
