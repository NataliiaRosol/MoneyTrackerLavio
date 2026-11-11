import { useTotalBalance } from "@/features/accounts";
import { formatMoney, formatMonthYear, formatRates, pluralize } from "@/lib/format";
import arrowIcon from "@/shared/icons/arrow.png";
import walletIcon from "@/shared/icons/wallet.png";
import { Badge, Text } from "@/shared/ui";
import { StatCard } from "./StatCard";

function formatAccountsCount(count: number): string {
  if (count === 0) return "Жоден рахунок не входить у баланс";
  return `Лише ${count} ${pluralize(count, { one: "мій рахунок", few: "мої рахунки", many: "моїх рахунків" })}`;
}

function MonthOverview() {
  const { data, isError } = useTotalBalance();

  const placeholder = isError ? "—" : "…";
  const money = (amount: string | undefined) =>
    data && amount !== undefined ? formatMoney(amount, data.currency) : placeholder;

  const ratesText = data
    ? `Базова валюта: ${data.currency} · ${formatRates(data.rates)}`
    : isError
      ? "Курси НБУ тимчасово недоступні"
      : "…";

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Badge variant="accent" className="px-2 py-1">
          {formatMonthYear(new Date())}
        </Badge>
        <Text size="xs" className="min-w-0 text-muted">
          {ratesText}
        </Text>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          accent
          title="Власний баланс"
          icon={<img src={walletIcon} alt="" />}
          amount={money(data?.total)}
          caption={data ? formatAccountsCount(data.accountsCount) : placeholder}
        />
        <StatCard
          title="Доходи"
          icon={<img src={arrowIcon} alt="" />}
          amount={money(data?.monthIncome)}
          caption="у базовій валюті"
        />
        <StatCard
          title="Витрати"
          // та сама стрілка, розвернута в правий верхній кут
          icon={<img src={arrowIcon} alt="" className="rotate-180" />}
          amount={money(data?.monthExpense)}
          caption="у базовій валюті"
        />
      </div>
    </section>
  );
}

export { MonthOverview };
