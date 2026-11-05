import { formatMoney } from "@/lib/format";
import { InfoNote } from "@/shared/ui";
import type { TotalBalance } from "./accounts.api";
import { useTotalBalance } from "./accounts.hooks";

const rateFormat = new Intl.NumberFormat("uk-UA", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// «1 USD = 41,20 UAH · 1 EUR = 45,00 UAH»; курси НБУ завжди відносно гривні
function formatRates(rates: TotalBalance["rates"]): string {
  return Object.entries(rates)
    .filter(([currency]) => currency !== "UAH")
    .map(([currency, rate]) => `1 ${currency} = ${rateFormat.format(Number(rate))} UAH`)
    .join(" · ");
}

function OwnBalanceNote() {
  const { data, isError } = useTotalBalance();

  // 503 — бекенд не дістав курсів НБУ і не має збережених
  const total = data ? formatMoney(data.total, data.currency) : isError ? "недоступний" : "…";

  return (
    <InfoNote title={`Власний баланс — ${total}`}>
      <span className="block">Сума лише моїх рахунків. Спільні рахунки нижче не включені.{" "}
        {data && `${formatRates(data.rates)}`}
      </span>
    </InfoNote>
  );
}

export { OwnBalanceNote };
