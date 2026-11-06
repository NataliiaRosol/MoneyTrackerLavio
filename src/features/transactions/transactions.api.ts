import type { Currency } from "@/features/accounts";
import type { CategoryType } from "@/features/categories";
import { api, type ApiResponse, type PaginatedResponse, type PaginationMeta } from "@/shared/api";

export type Transaction = {
  id: string;
  accountId: string;
  categoryId: string;
  authorId: string | null;
  // завжди додатна: дохід це чи витрата, визначає тип категорії
  amount: string;
  // "YYYY-MM-DD" бекенд віддає як північ UTC
  date: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  account: {
    id: string;
    name: string;
    currency: Currency;
    icon: string | null;
    color: string | null;
  };
  category: {
    id: string;
    name: string;
    type: CategoryType;
    icon: string | null;
    color: string | null;
  };
};

// дзеркало TRANSACTION_SORTS з бекенду
export const TRANSACTION_SORTS = ["date_desc", "date_asc"] as const;

export type TransactionSort = (typeof TRANSACTION_SORTS)[number];

// усі діапазони включні, дати у форматі "YYYY-MM-DD"
export type ListTransactionsParams = {
  accountIds?: string[];
  categoryIds?: string[];
  type?: CategoryType;
  from?: string;
  to?: string;
  search?: string;
  minAmount?: string;
  maxAmount?: string;
  // за замовчуванням бекенд віддає від нових до старих (date_desc)
  sort?: TransactionSort;
  page?: number;
  // бекенд дозволяє до 100, за замовчуванням 20
  limit?: number;
};

export type CreateTransactionInput = {
  // лише власний неархівний рахунок, інакше бекенд відповість 404 / 400
  accountId: string;
  // дохід це чи витрата, визначає тип категорії
  categoryId: string;
  // додатна, до 15 цифр і 4 знаків після крапки
  amount: string;
  // "YYYY-MM-DD"
  date: string;
  description?: string;
};

// PATCH шле лише змінені поля; порожній опис (null) бекенд прибирає
export type UpdateTransactionInput = Partial<Omit<CreateTransactionInput, "description">> & {
  description?: string | null;
};

export type TransactionsPage = {
  items: Transaction[];
  meta: PaginationMeta;
};

export const transactionsApi = {
  list: ({ accountIds, categoryIds, ...params }: ListTransactionsParams = {}) =>
    api
      .get<PaginatedResponse<Transaction>>("/transactions", {
        // масиви бекенд чекає через кому, а не axios-овим accountIds[]=
        params: {
          ...params,
          accountIds: accountIds?.join(","),
          categoryIds: categoryIds?.join(","),
        },
      })
      .then(({ data }): TransactionsPage => ({ items: data.data, meta: data.meta })),

  create: (input: CreateTransactionInput) =>
    api
      .post<ApiResponse<Transaction>>("/transactions", input)
      .then(({ data }) => data.data),

  update: (id: string, input: UpdateTransactionInput) =>
    api
      .patch<ApiResponse<Transaction>>(`/transactions/${id}`, input)
      .then(({ data }) => data.data),

  remove: (id: string) => api.delete(`/transactions/${id}`).then(() => undefined),
};
