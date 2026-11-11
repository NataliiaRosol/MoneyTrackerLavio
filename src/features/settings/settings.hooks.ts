import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meQueryKey, type User } from "@/features/auth";
import { settingsApi } from "./settings.api";

// бекенд повертає оновленого юзера — кладемо його в кеш замість повторного /me
function useSetMe() {
  const queryClient = useQueryClient();
  return (user: User) => queryClient.setQueryData(meQueryKey, user);
}

export function useUpdateProfile() {
  const setMe = useSetMe();
  return useMutation({ mutationFn: settingsApi.updateProfile, onSuccess: setMe });
}

export function useSetDefaultAccount() {
  const setMe = useSetMe();
  return useMutation({ mutationFn: settingsApi.setDefaultAccount, onSuccess: setMe });
}

export function useChangeEmail() {
  const setMe = useSetMe();
  return useMutation({ mutationFn: settingsApi.changeEmail, onSuccess: setMe });
}

export function useChangePassword() {
  return useMutation({ mutationFn: settingsApi.changePassword });
}
