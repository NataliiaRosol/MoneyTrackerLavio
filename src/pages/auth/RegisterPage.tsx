import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useRegister } from "@/features/auth";
import { getApiErrorCode, getErrorMessage } from "@/shared/api";
import {
  Button,
  buttonVariants,
  Field,
  FieldDescription,
  FieldError,
  Form,
  Input,
  Text,
} from "@/shared/ui";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Введіть імʼя"),
    email: z
      .string()
      .trim()
      .min(1, "Введіть email")
      .pipe(z.email("Некоректний email")),
    password: z
      .string()
      .min(8, "Щонайменше 8 символів")
      .regex(/\p{L}/u, "Пароль має містити літеру")
      .regex(/\d/, "Пароль має містити цифру"),
    confirmPassword: z.string().min(1, "Повторіть пароль"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

const linkClassName = cn(buttonVariants({ variant: "link" }));

function RegisterPage() {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;
  const registration = useRegister();

  // бекенд одразу створює сесію, тож після успіху GuestOnly перекине на головну (/)
  const onSubmit = async ({ name, email, password }: RegisterValues) => {
    try {
      await registration.mutateAsync({ name, email, password });
    } catch (error) {
      if (getApiErrorCode(error) === "CONFLICT") {
        form.setError("email", { message: "Цей email уже зареєстровано" });
        return;
      }
      form.setError("root", { message: getErrorMessage(error) });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <Text as="h1" size="xl" weight="semibold" className="text-ink">
          Почнімо з простого
        </Text>
        <Text size="sm" className="text-muted">
          Створіть свій простір фінансового спокою.
        </Text>
      </div>

      <Form form={form} onSubmit={onSubmit} className="mt-5.5 gap-5.5">
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

        <Field data-invalid={!!errors.password}>
          <Input
            label="Пароль"
            type="password"
            autoComplete="new-password"
            placeholder="Створіть пароль"
            aria-invalid={!!errors.password}
            aria-describedby="password-hint"
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
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
          <FieldDescription id="password-hint">
            Щонайменше 8 символів, літера та цифра.
          </FieldDescription>
        </Field>

        <FieldError errors={[errors.root]} />

        <Button type="submit" variant="active" disabled={isSubmitting}>
          Зареєструватися
        </Button>
      </Form>

      <Text size="sm" className="mt-5.5 text-center text-muted">
        Уже маєте акаунт?{" "}
        <Link to="/login" className={linkClassName}>
          Увійти
        </Link>
      </Text>
    </div>
  );
}

export default RegisterPage;
