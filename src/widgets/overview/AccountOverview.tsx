import type { AccountDetails } from "@/features/accounts";
import { formatMoney, formatMonth } from "@/lib/format";
import arrowIcon from "@/shared/icons/arrow.png";
import walletIcon from "@/shared/icons/wallet.png";
import { StatCard } from "./StatCard";

type AccountOverviewProps = {
  account: AccountDetails;
};

// баланс і обороти одного рахунку, усе у валюті рахунку
function AccountOverview({ account }: AccountOverviewProps) {
  const month = formatMonth(new Date());
  const money = (amount: string) => formatMoney(amount, account.currency);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        accent
        title="Поточний баланс"
        icon={<img src={walletIcon} alt="" />}
        amount={money(account.balance)}
        caption={`Початковий залишок — ${money(account.initialBalance)}`}
      />
      <StatCard
        title={`Витрати за ${month}`}
        // та сама стрілка, що й у доходів, розвернута в правий верхній кут
        icon={<img src={arrowIcon} alt="" className="rotate-180" />}
        amount={money(account.monthExpense)}
        caption="Від початку місяця"
      />
      <StatCard
        title={`Доходи за ${month}`}
        icon={<img src={arrowIcon} alt="" />}
        amount={money(account.monthIncome)}
        caption="Від початку місяця"
      />
    </div>
  );
}

export { AccountOverview };
export type { AccountOverviewProps };
