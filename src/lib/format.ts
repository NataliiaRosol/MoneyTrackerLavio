// суми з бекенду приходять рядком (Decimal), для показу точності Number вистачає
function formatMoney(amount: string | number, currency: string): string {
  return new Intl.NumberFormat("uk-UA", { style: "currency", currency }).format(Number(amount));
}

// дата транзакції — @db.Date, приходить як північ UTC, тому форматуємо в UTC, щоб день не зсунувся
const dateFormat = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(date: string): string {
  return dateFormat.format(new Date(date));
}

const longDateFormat = new Intl.DateTimeFormat("uk-UA", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// «четвер, 6 листопада 2026 р.»; як і formatDate, для дат транзакцій у UTC
function formatLongDate(date: string): string {
  return longDateFormat.format(new Date(date));
}

// month без day дає називний відмінок: «листопад», а не «листопада»
const monthFormat = new Intl.DateTimeFormat("uk-UA", { month: "long", timeZone: "UTC" });

// «Листопад 2026»; у UTC, бо бекенд рахує межі місяця в UTC
function formatMonthYear(date: Date): string {
  const month = monthFormat.format(date);
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getUTCFullYear()}`;
}

const rateFormat = new Intl.NumberFormat("uk-UA", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// «1 USD = 41,20 UAH · 1 EUR = 45,00 UAH»; курси НБУ завжди відносно гривні
function formatRates(rates: Record<string, string>): string {
  return Object.entries(rates)
    .filter(([currency]) => currency !== "UAH")
    .map(([currency, rate]) => `1 ${currency} = ${rateFormat.format(Number(rate))} UAH`)
    .join(" · ");
}

const pluralRules = new Intl.PluralRules("uk-UA");

type PluralForms = { one: string; few: string; many: string };

// 1 рахунок, 2 рахунки, 5 рахунків; дробові числа йдуть у many
function pluralize(count: number, forms: PluralForms): string {
  const category = pluralRules.select(count);
  return category === "one" || category === "few" ? forms[category] : forms.many;
}

export { formatDate, formatLongDate, formatMoney, formatMonthYear, formatRates, pluralize };
