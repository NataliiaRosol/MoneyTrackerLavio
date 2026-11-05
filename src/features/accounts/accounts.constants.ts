import type { IconName } from "@/shared/icons";
import { ACCOUNT_TYPES, type AccountRole, type AccountType, type Currency } from "./accounts.api";

export const CURRENCY_LABELS: Record<Currency, string> = {
  UAH: "UAH — Гривня",
  USD: "USD — Долар США",
  EUR: "EUR — Євро",
};

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  CARD: "Картка",
  CASH: "Готівка",
  SAVINGS: "Заощадження",
  OTHER: "Інше",
};

// іконка за замовчуванням, якщо в рахунку не вибрана власна
export const ACCOUNT_TYPE_ICON_NAMES: Record<AccountType, IconName> = {
  CARD: "credit-card",
  CASH: "banknote",
  SAVINGS: "piggy-bank",
  OTHER: "wallet",
};

// тип рахунку визначається вибраною іконкою: власна іконка з повного списку — це OTHER
export function getAccountTypeByIcon(icon: IconName): AccountType {
  return ACCOUNT_TYPES.find((type) => ACCOUNT_TYPE_ICON_NAMES[type] === icon) ?? "OTHER";
}

export const ACCOUNT_ROLE_LABELS: Record<AccountRole, string> = {
  OWNER: "Власник",
  EDITOR: "Редактор",
  VIEWER: "Читач",
};
