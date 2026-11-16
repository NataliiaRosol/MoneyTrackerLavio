import { Navigate, Outlet, useLocation, type Location } from "react-router-dom";
import { useSession } from "@/shared/api";
import { Loader } from "@/shared/ui";
import { useMe } from "./auth.hooks";

const HOME_PATH = "/";
const LOGIN_PATH = "/login";
const CHECK_EMAIL_PATH = "/check-email";

export function RequireAuth() {
  const status = useSession((state) => state.status);
  const location = useLocation();
  const { data: user, isPending: isUserPending } = useMe();

  // поки при старті йде refresh, ще невідомо, чи юзер залогінений
  if (status === "pending") return <Loader fullScreen />;
  if (status === "guest") {
    return <Navigate to={LOGIN_PATH} replace state={{ from: location }} />;
  }

  // у застосунок пускаємо лише з підтвердженою поштою, а про неї знає тільки /me
  if (isUserPending) return <Loader fullScreen />;
  // гейт лише клієнтський (бекенд непідтверджених не блокує), тож якщо /me впав — пускаємо далі
  if (user && !user.emailVerifiedAt) {
    return <Navigate to={CHECK_EMAIL_PATH} replace />;
  }

  return <Outlet />;
}

export function GuestOnly() {
  const status = useSession((state) => state.status);
  const location = useLocation();

  // тут уже відрендерений AuthLayout, тож спінер лише на місці форми
  if (status === "pending") return <Loader />;
  if (status === "authenticated") {
    const from = (location.state as { from?: Location } | null)?.from;
    return <Navigate to={from ?? HOME_PATH} replace />;
  }

  return <Outlet />;
}

// «Перевірте пошту»: лише залогінений юзер із непідтвердженою поштою —
// без сесії не знаємо адресу і не можемо надіслати лист повторно
export function UnverifiedOnly() {
  const status = useSession((state) => state.status);
  const { data: user, isPending: isUserPending } = useMe();

  if (status === "pending") return <Loader />;
  if (status === "guest") return <Navigate to={LOGIN_PATH} replace />;
  if (isUserPending) return <Loader />;
  // підтвердили, зокрема в іншій вкладці: /me перезапитується, коли юзер повертається на цю
  if (!user || user.emailVerifiedAt) return <Navigate to={HOME_PATH} replace />;

  return <Outlet />;
}
