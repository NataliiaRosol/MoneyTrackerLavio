import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/shared/api";
import { Button, Text } from "@/shared/ui";
import { useLogout, useResendVerification } from "./auth.hooks";

const RESEND_ERRORS = {
  BAD_REQUEST: "Пошту вже підтверджено.",
  SERVICE_UNAVAILABLE: "Не вдалося надіслати лист. Спробуйте пізніше.",
};

// кнопки для залогіненого юзера з непідтвердженою поштою: «Перевірте пошту» і «Посилання не діє»
function VerificationActions() {
  const resend = useResendVerification();
  const logout = useLogout();
  const navigate = useNavigate();

  // із живою сесією GuestOnly на /login одразу відкинув би назад, тож спершу виходимо
  const backToLogin = () => {
    logout.mutate(undefined, {
      onSettled: () => navigate("/login", { replace: true }),
    });
  };

  return (
    <>
      <Button
        variant="active"
        disabled={resend.isPending}
        onClick={() => resend.mutate()}
      >
        Надіслати повторно
      </Button>
      <Button disabled={logout.isPending} onClick={backToLogin}>
        Повернутися до входу
      </Button>

      {resend.isSuccess && (
        <Text role="status" size="xs" color="teal">
          Новий лист надіслано.
        </Text>
      )}
      {resend.isError && (
        <Text role="alert" size="xs" color="rose">
          {getErrorMessage(resend.error, RESEND_ERRORS)}
        </Text>
      )}
    </>
  );
}

export { VerificationActions };
