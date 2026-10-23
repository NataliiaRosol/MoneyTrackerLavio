import { Navigate, Outlet, useLocation, type Location } from "react-router-dom";
import { useSession } from "@/shared/api";

const HOME_PATH = "/";

export function RequireAuth() {
  const status = useSession((state) => state.status);
  const location = useLocation();

  // поки при старті йде refresh, ще невідомо, чи юзер залогінений
  if (status === "pending") return null;
  if (status === "guest") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function GuestOnly() {
  const status = useSession((state) => state.status);
  const location = useLocation();

  if (status === "pending") return null;
  if (status === "authenticated") {
    const from = (location.state as { from?: Location } | null)?.from;
    return <Navigate to={from ?? HOME_PATH} replace />;
  }

  return <Outlet />;
}
