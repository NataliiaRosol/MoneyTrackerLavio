import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import { useMe, useVerifyEmail, VerificationActions } from "@/features/auth";
import { getApiErrorCode, getErrorMessage, useSession } from "@/shared/api";
import {
  Button,
  buttonVariants,
  InfoNote,
  Loader,
  StatusScreen,
} from "@/shared/ui";
import badgeCheckIcon from "@/shared/icons/badge-check.png";
import brokenLinkIcon from "@/shared/icons/broken-link.png";

const FOOTNOTE = "Ваші дані залишаються у вашому просторі.";

// бекенд віддає одну помилку на «немає / прострочене / вже використане», щоб не підказувати, що саме не так
const INVALID_LINK_CODES = ["BAD_REQUEST", "VALIDATION_ERROR"];

const loginLinkClassName = buttonVariants({ variant: "active" });

function EmailAddress({ children }: { children: string }) {
  return <span className="font-medium text-ink wrap-anywhere">{children}</span>;
}

// email є лише в залогіненого юзера: бекенд на підтвердження відповідає 204 без тіла
type EmailProps = { email?: string };

function EmailVerified({ email }: EmailProps) {
  return (
    <StatusScreen
      fullScreen={false}
      visual={<img src={badgeCheckIcon} alt="" aria-hidden />}
      title="Пошту підтверджено"
      description={
        <>
          {email && (
            <>
              Адреса <EmailAddress>{email}</EmailAddress> підтверджена.{" "}
            </>
          )}
          Тепер ви можете увійти й почати вести свої фінанси.
        </>
      }
      // залогіненого GuestOnly з /login одразу пропустить на головну
      actions={
        <Link to="/login" replace className={loginLinkClassName}>
          Перейти до входу
        </Link>
      }
      footnote={FOOTNOTE}
    />
  );
}

function LinkExpired({ email }: EmailProps) {
  return (
    <StatusScreen
      fullScreen={false}
      visual={<img src={brokenLinkIcon} alt="" aria-hidden />}
      title="Посилання не діє"
      description={
        <>
          Посилання для підтвердження застаріло або вже було використане.{" "}
          {email ? (
            <>
              Надішліть новий лист на <EmailAddress>{email}</EmailAddress>.
            </>
          ) : (
            "Увійдіть, щоб надіслати новий лист."
          )}
        </>
      }
      // повторне надсилання бекенд дозволяє лише із сесією; гостя після входу
      // RequireAuth сам приведе на «Перевірте пошту», де є ця кнопка
      actions={
        email ? (
          <VerificationActions />
        ) : (
          <Link to="/login" replace className={loginLinkClassName}>
            Перейти до входу
          </Link>
        )
      }
      footnote={FOOTNOTE}
    >
      <InfoNote className="mt-6 w-full text-left">
        Новий лист міститиме актуальне посилання. Старе більше не діятиме.
      </InfoNote>
    </StatusScreen>
  );
}

// мережа або 5xx: посилання, найімовірніше, ще живе — не кажемо, що воно не діє
function VerificationFailed({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <StatusScreen
      fullScreen={false}
      visual={
        <span
          aria-hidden
          className="flex size-10 items-center justify-center rounded-full bg-rose-pale text-rose"
        >
          <TriangleAlert className="size-5" />
        </span>
      }
      title="Не вдалося підтвердити пошту"
      description={getErrorMessage(error)}
      actions={
        <Button variant="active" onClick={onRetry}>
          Спробувати ще раз
        </Button>
      }
    />
  );
}

// сюди веде посилання з листа: /verify-email?token=…
function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const sessionStatus = useSession((state) => state.status);
  const { data: user, isPending: isUserPending } = useMe();
  const { mutate: verifyEmail, status, error } = useVerifyEmail();
  const submittedToken = useRef<string | null>(null);

  useEffect(() => {
    // посилання одноразове, а StrictMode запускає ефект двічі: другий запит отримав би 400
    if (!token || submittedToken.current === token) return;
    submittedToken.current = token;
    verifyEmail(token);
  }, [token, verifyEmail]);

  // чекаємо і на /me: від нього залежить адреса в тексті та чи можна надіслати лист повторно
  const isUserLoading =
    sessionStatus === "pending" ||
    (sessionStatus === "authenticated" && isUserPending);
  const isVerifying = !!token && (status === "idle" || status === "pending");

  if (isUserLoading || isVerifying) return <Loader />;

  // вже підтверджена пошта — це й повторний перехід за використаним посиланням
  if (status === "success" || user?.emailVerifiedAt) {
    return <EmailVerified email={user?.email} />;
  }

  if (token && error && !INVALID_LINK_CODES.includes(getApiErrorCode(error))) {
    return <VerificationFailed error={error} onRetry={() => verifyEmail(token)} />;
  }

  return <LinkExpired email={user?.email} />;
}

export default VerifyEmailPage;
