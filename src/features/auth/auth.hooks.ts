import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorCode, useSession } from "@/shared/api";
import { authApi, type AuthResponse } from "./auth.api";

export const meQueryKey = ["auth", "me"] as const;

export function useMe() {
  const isAuthenticated = useSession((state) => state.status === "authenticated");

  return useQuery({
    queryKey: meQueryKey,
    queryFn: authApi.me,
    enabled: isAuthenticated,
  });
}

// login і register повертають юзера одразу — кладемо його в кеш, щоб не робити зайвий /me
function useStartSession() {
  const queryClient = useQueryClient();

  return ({ user, accessToken }: AuthResponse) => {
    queryClient.setQueryData(meQueryKey, user);
    useSession.getState().setAccessToken(accessToken);
  };
}

export function useLogin() {
  const startSession = useStartSession();
  return useMutation({ mutationFn: authApi.login, onSuccess: startSession });
}

export function useRegister() {
  const startSession = useStartSession();
  return useMutation({ mutationFn: authApi.register, onSuccess: startSession });
}

export function useLogout() {
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => useSession.getState().clear(),
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.verifyEmail,
    // бекенд юзера не повертає, тож перезапитуємо /me і чекаємо на нього:
    // інакше RequireAuth за старим emailVerifiedAt відкинув би назад на «Перевірте пошту»
    onSuccess: () => queryClient.invalidateQueries({ queryKey: meQueryKey }),
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: authApi.forgotPassword });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: authApi.resetPassword,
    // якщо в цьому браузері була сесія, вона вже відкликана: без clear GuestOnly не пустив би на /login
    onSuccess: () => useSession.getState().clear(),
  });
}

export function useResendVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.resendVerification,
    // 400 — пошту вже підтвердили (напр. в іншій вкладці): свіжий /me сам прибере екран підтвердження
    onError: (error) => {
      if (getApiErrorCode(error) === "BAD_REQUEST") {
        return queryClient.invalidateQueries({ queryKey: meQueryKey });
      }
    },
  });
}
