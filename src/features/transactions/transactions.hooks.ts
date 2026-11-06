import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsQueryKey } from "@/features/accounts";
import {
  transactionsApi,
  type ListTransactionsParams,
  type UpdateTransactionInput,
} from "./transactions.api";

export const transactionsQueryKey = ["transactions"] as const;

export function useTransactions(params: ListTransactionsParams = {}) {
  return useQuery({
    queryKey: [...transactionsQueryKey, "list", params],
    queryFn: () => transactionsApi.list(params),
    // під час перемикання сторінки лишаємо попередню, щоб таблиця не зникала
    placeholderData: keepPreviousData,
  });
}

// будь-яка зміна транзакції зачіпає і списки транзакцій, і баланси рахунків
function useInvalidateTransactions() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
      queryClient.invalidateQueries({ queryKey: accountsQueryKey }),
    ]);
}

export function useCreateTransaction() {
  const invalidate = useInvalidateTransactions();
  return useMutation({ mutationFn: transactionsApi.create, onSuccess: invalidate });
}

export function useUpdateTransaction() {
  const invalidate = useInvalidateTransactions();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateTransactionInput & { id: string }) =>
      transactionsApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateTransactions();
  return useMutation({ mutationFn: transactionsApi.remove, onSuccess: invalidate });
}
