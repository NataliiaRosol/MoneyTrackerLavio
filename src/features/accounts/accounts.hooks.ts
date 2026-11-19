import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meQueryKey } from "@/features/auth";
import { getApiErrorCode } from "@/shared/api";
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
    // чужий чи видалений рахунок не з'явиться від повтору — одразу показуємо «не знайдено»
    retry: (failureCount, error) => getApiErrorCode(error) !== "NOT_FOUND" && failureCount < 3,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountsApi.remove,
    onSuccess: (_, id) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: accountsQueryKey,
          // сам видалений рахунок не перезапитуємо: його сторінка встигла б показати «не знайдено» до переходу
          predicate: ({ queryKey }) => !(queryKey[1] === "detail" && queryKey[2] === id),
        }),
        // бекенд обнуляє рахунок за замовчуванням, якщо видалили саме його
        queryClient.invalidateQueries({ queryKey: meQueryKey }),
      ]),
  });
}
