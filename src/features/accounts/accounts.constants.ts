import { z } from "zod";
import type { IconName } from "@/shared/icons";
import {
  ACCOUNT_TYPES,
  CURRENCIES,
  type AccountRole,
  type AccountType,
  type Currency,
} from "./accounts.api";

// ті самі обмеження, що й на бекенді: і при створенні, і при перейменуванні
export const accountNameSchema = z
  .string()
  .trim()
  .min(1, "Введіть назву")
  .max(50, "Не більше 50 символів");

// бекенд відповідає CONFLICT, коли назва збігається з іншим рахунком юзера (без урахування регістру)
export const ACCOUNT_NAME_CONFLICT_MESSAGE = "Рахунок з такою назвою вже існує";

export const CURRENCY_LABELS: Record<Currency, string> = {
  UAH: "UAH — Гривня",
  USD: "USD — Долар США",
  EUR: "EUR — Євро",
};

// пункти для Select валюти
export const CURRENCY_ITEMS = CURRENCIES.map((currency) => ({
  value: currency,
  label: CURRENCY_LABELS[currency],
}));

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
