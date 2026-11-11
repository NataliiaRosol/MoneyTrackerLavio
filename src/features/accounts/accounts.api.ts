import { api, type ApiResponse } from "@/shared/api";

export const ACCOUNT_TYPES = ["CARD", "CASH", "SAVINGS", "OTHER"] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const CURRENCIES = ["UAH", "USD", "EUR"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const ACCOUNT_ROLES = ["OWNER", "EDITOR", "VIEWER"] as const;

export type AccountRole = (typeof ACCOUNT_ROLES)[number];

export type Account = {
  id: string;
  ownerId: string;
  name: string;
  type: AccountType;
  currency: Currency;
  initialBalance: string;
  icon: string | null;
  color: string | null;
  archived: boolean;
  includeInTotal: boolean;
  createdAt: string;
  updatedAt: string;
  balance: string;
  isMine: boolean;
};

// GET /accounts/:id і PATCH додатково рахують обороти за поточний місяць
export type AccountDetails = Account & {
  monthIncome: string;
  monthExpense: string;
};

// сума власних неархівних рахунків з includeInTotal, переведена в базову валюту юзера за курсами НБУ
export type TotalBalance = {
  currency: Currency;
  total: string;
  // обороти за поточний місяць (UTC), теж у базовій валюті
  monthIncome: string;
  monthExpense: string;
  // скільки рахунків увійшло в total
  accountsCount: number;
  byCurrency: {
    currency: Currency;
    balance: string;
    monthIncome: string;
    monthExpense: string;
  }[];
  // ціна 1 одиниці валюти в UAH, ті самі курси, за якими рахувався total
  rates: Record<Currency, string>;
  ratesDate: string;
};

export type ListAccountsParams = {
  type?: AccountType;
  includeArchived?: boolean;
};

export type CreateAccountInput = {
  name: string;
  type?: AccountType;
  currency: Currency;
  initialBalance?: string;
  icon?: string;
  color?: string;
  // якщо не передати, бекенд не рахує SAVINGS у загальному балансі
  includeInTotal?: boolean;
};

// валюту бекенд змінювати не дає: транзакції вже в ній
export type UpdateAccountInput = {
  name?: string;
  type?: AccountType;
  initialBalance?: string;
  icon?: string | null;
  color?: string | null;
  archived?: boolean;
  includeInTotal?: boolean;
};

export const accountsApi = {
  list: (params: ListAccountsParams = {}) =>
    api
      .get<ApiResponse<Account[]>>("/accounts", { params })
      .then(({ data }) => data.data),

  total: () =>
    api
      .get<ApiResponse<TotalBalance>>("/accounts/total")
      .then(({ data }) => data.data),

  get: (id: string) =>
    api
      .get<ApiResponse<AccountDetails>>(`/accounts/${id}`)
      .then(({ data }) => data.data),

  create: (input: CreateAccountInput) =>
    api
      .post<ApiResponse<Account>>("/accounts", input)
      .then(({ data }) => data.data),

  update: (id: string, input: UpdateAccountInput) =>
    api
      .patch<ApiResponse<AccountDetails>>(`/accounts/${id}`, input)
      .then(({ data }) => data.data),

  // бекенд відповідає 204 без тіла
  remove: (id: string) => api.delete(`/accounts/${id}`).then(() => undefined),
};
