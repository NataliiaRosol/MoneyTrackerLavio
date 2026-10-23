import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/api";
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
