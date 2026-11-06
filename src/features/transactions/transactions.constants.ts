import type { TransactionSort } from "./transactions.api";

export const TRANSACTION_SORT_LABELS: Record<TransactionSort, string> = {
  date_desc: "Спочатку нові",
  date_asc: "Спочатку старі",
};
