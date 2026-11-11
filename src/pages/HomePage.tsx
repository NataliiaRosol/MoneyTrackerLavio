import { useState } from "react";
import { useMe } from "@/features/auth";
import { TransactionFormModal } from "@/features/transactions";
import { PageHeader } from "@/shared/ui";
import { MonthOverview } from "@/widgets/overview";
import { RecentTransactions } from "@/widgets/transactions";

function HomePage() {
  const { data: user } = useMe();
  const name = user ? user.name || user.email : "";
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div>
      <PageHeader
        // поки юзер вантажиться, не показуємо «Доброго дня, !»
        title={name ? `Доброго дня, ${name}!` : "Доброго дня!"}
        subtitle="Ваші фінанси в балансі. Ось що відбувається цього місяця."
        actionText="+ Додати транзакцію"
        onAction={() => setCreateOpen(true)}
      />

      <div className="mx-10 mb-10 flex flex-col gap-7.5">
        <MonthOverview />
        <RecentTransactions />
      </div>

      <TransactionFormModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

export default HomePage;
