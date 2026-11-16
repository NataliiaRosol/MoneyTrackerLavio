import { useMe, VerificationActions } from "@/features/auth";
import { InfoNote, StatusScreen } from "@/shared/ui";
import mailCheckIcon from "@/shared/icons/mail-check.png";

// сюди RequireAuth відправляє юзера з непідтвердженою поштою: після реєстрації, логіну чи зміни email.
// UnverifiedOnly гарантує, що /me уже завантажений
function CheckEmailPage() {
  const { data: user } = useMe();

  if (!user) return null;

  return (
    <StatusScreen
      fullScreen={false}
      visual={<img src={mailCheckIcon} alt="" aria-hidden />}
      title="Перевірте пошту"
      description={
        <>
          Ми надіслали лист із посиланням для підтвердження на{" "}
          <span className="font-medium text-ink wrap-anywhere">{user.email}</span>.
        </>
      }
      actions={<VerificationActions />}
    >
      <InfoNote className="mt-6 w-full text-left">
        Посилання діє 24 години. Якщо листа немає, перевірте папку «Спам».
      </InfoNote>
    </StatusScreen>
  );
}

export default CheckEmailPage;
