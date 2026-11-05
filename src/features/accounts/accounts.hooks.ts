import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  accountsApi,
  type ListAccountsParams,
  type UpdateAccountInput,
} from "./accounts.api";

export const accountsQueryKey = ["accounts"] as const;

export function useAccounts(params: ListAccountsParams = {}) {
  return useQuery({
    queryKey: [...accountsQueryKey, "list", params],
    queryFn: () => accountsApi.list(params),
  });
}

export function useTotalBalance() {
  return useQuery({
    queryKey: [...accountsQueryKey, "total"],
    queryFn: accountsApi.total,
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: [...accountsQueryKey, "detail", id],
    queryFn: () => accountsApi.get(id),
  });
}

function useInvalidateAccounts() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: accountsQueryKey });
}

export function useCreateAccount() {
  const invalidate = useInvalidateAccounts();
  return useMutation({ mutationFn: accountsApi.create, onSuccess: invalidate });
}

export function useUpdateAccount() {
  const invalidate = useInvalidateAccounts();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateAccountInput & { id: string }) =>
      accountsApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteAccount() {
  const invalidate = useInvalidateAccounts();
  return useMutation({ mutationFn: accountsApi.remove, onSuccess: invalidate });
}
