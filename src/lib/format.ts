// суми з бекенду приходять рядком (Decimal), для показу точності Number вистачає
function formatMoney(amount: string | number, currency: string): string {
  return new Intl.NumberFormat("uk-UA", { style: "currency", currency }).format(Number(amount));
}

const pluralRules = new Intl.PluralRules("uk-UA");

type PluralForms = { one: string; few: string; many: string };

// 1 рахунок, 2 рахунки, 5 рахунків; дробові числа йдуть у many
function pluralize(count: number, forms: PluralForms): string {
  const category = pluralRules.select(count);
  return category === "one" || category === "few" ? forms[category] : forms.many;
}

export { formatMoney, pluralize };
