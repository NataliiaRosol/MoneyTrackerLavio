import { formatMoney, formatRates } from "@/lib/format";
import { InfoNote } from "@/shared/ui";
import { useTotalBalance } from "./accounts.hooks";

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
