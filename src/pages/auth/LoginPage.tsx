import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useLogin } from "@/features/auth";
import { getErrorMessage } from "@/shared/api";
import {
  Button,
  buttonVariants,
  Field,
  FieldError,
  Form,
  Input,
  Text,
} from "@/shared/ui";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Введіть email")
    .pipe(z.email("Некоректний email")),
  password: z.string().min(1, "Введіть пароль"),
  remember: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;

const linkClassName = cn(buttonVariants({ variant: "link" }));

function LoginPage() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;
  const login = useLogin();

  // після успіху GuestOnly сам перекине на головну (/)
  const onSubmit = async ({ email, password }: LoginValues) => {
    try {
      await login.mutateAsync({ email, password });
    } catch (error) {
      form.setError("root", {
        message: getErrorMessage(error, {
          UNAUTHORIZED: "Невірний email або пароль",
          FORBIDDEN: "Акаунт заблоковано",
        }),
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <Text as="h1" size="xl" weight="semibold" className="text-ink">
          Раді бачити вас знову
        </Text>
        <Text size="sm" className="text-muted">
          Увійдіть, щоб навести лад у фінансах.
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

        <Field data-invalid={!!errors.password}>
          <Input
            label="Пароль"
            type="password"
            autoComplete="current-password"
            placeholder="Введіть пароль"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        <div className="flex items-center justify-end gap-4">
          {/* <Controller
            control={control}
            name="remember"
            render={({ field }) => (
              <Field orientation="horizontal" className="w-auto">
                <Checkbox
                  id="remember"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  inputRef={field.ref}
                />
                <FieldLabel htmlFor="remember">Запам’ятати мене</FieldLabel>
              </Field>
            )}
          /> */}

          <Link to="/forgot-password" className={linkClassName}>
            Забули пароль?
          </Link>
        </div>

        <FieldError errors={[errors.root]} />

        <Button type="submit" variant="active" disabled={isSubmitting}>
          Увійти
        </Button>
      </Form>

      <Text size="sm" className="mt-5.5 text-center text-muted">
        Ще немає акаунту?{" "}
        <Link to="/register" className={linkClassName}>
          Зареєструватися
        </Link>
      </Text>
    </div>
  );
}

export default LoginPage;
