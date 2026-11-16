import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { pluralize } from "@/lib/format";
import { useForgotPassword } from "@/features/auth";
import { getErrorMessage } from "@/shared/api";
import {
  Button,
  buttonVariants,
  Field,
  FieldError,
  Form,
  InfoNote,
  Input,
  StatusScreen,
  Text,
} from "@/shared/ui";
import planeIcon from "@/shared/icons/plane.png";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Введіть email")
    .pipe(z.email("Некоректний email")),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const RESEND_DELAY_SECONDS = 60;

function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  return sentTo ? (
    <EmailSent email={sentTo} />
  ) : (
    <ForgotPasswordForm onSent={setSentTo} />
  );
}

function ForgotPasswordForm({ onSent }: { onSent: (email: string) => void }) {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;
  const forgotPassword = useForgotPassword();

  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    try {
      await forgotPassword.mutateAsync(email);
      onSent(email);
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <Text as="h1" size="xl" weight="semibold" className="text-ink">
          Забули пароль?
        </Text>
        <Text size="sm" className="text-muted">
          Вкажіть email. Ми надішлемо посилання для створення нового пароля.
        </Text>
      </div>

      <Form form={form} onSubmit={onSubmit} className="mt-5.5 gap-5.5">
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

        <Button type="submit" variant="active" disabled={isSubmitting}>
          Надіслати посилання
        </Button>
      </Form>

      <Text size="sm" className="mt-5.5 text-center">
        <Link to="/login" className={buttonVariants({ variant: "link" })}>
          Повернутися до входу
        </Link>
      </Text>
    </div>
  );
}

// бекенд відповідає однаково для будь-якого email, тож і текст нейтральний: «якщо акаунт існує»
function EmailSent({ email }: { email: string }) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY_SECONDS);
  const resend = useForgotPassword();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timeout = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  const onResend = () => {
    resend.mutate(email, {
      onSuccess: () => setSecondsLeft(RESEND_DELAY_SECONDS),
    });
  };

  return (
    <StatusScreen
      fullScreen={false}
      visual={<img src={planeIcon} alt="" aria-hidden />}
      title="Лист уже в дорозі"
      description={
        <>
          Якщо акаунт із адресою{" "}
          <span className="font-medium text-ink wrap-anywhere">{email}</span>{" "}
          існує, ви отримаєте інструкцію для відновлення пароля.
        </>
      }
      actions={
        <Link to="/login" className={buttonVariants({ variant: "active" })}>
          Повернутися до входу
        </Link>
      }
      footnote={
        secondsLeft > 0 ? (
          `Надіслати ще раз можна через ${secondsLeft} ${pluralize(secondsLeft, {
            one: "секунду",
            few: "секунди",
            many: "секунд",
          })}.`
        ) : (
          <>
            <Button
              variant="link"
              className="text-12"
              disabled={resend.isPending}
              onClick={onResend}
            >
              Надіслати ще раз
            </Button>
            {resend.isError && (
              <Text as="span" role="alert" size="xs" color="rose" className="mt-1 block">
                {getErrorMessage(resend.error)}
              </Text>
            )}
          </>
        )
      }
    >
      <InfoNote className="mt-6 w-full text-left">
        Посилання діє 30 хвилин. Перевірте також папку «Спам».
      </InfoNote>
    </StatusScreen>
  );
}

export default ForgotPasswordPage;
