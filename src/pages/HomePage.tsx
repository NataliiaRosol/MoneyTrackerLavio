import { useState } from "react";
import { useMe } from "@/features/auth";
import { TransactionFormModal } from "@/features/transactions";
import { PageHeader } from "@/shared/ui";
import { RecentTransactions } from "@/widgets/transactions";

function HomePage() {
  const { data: user } = useMe();
  const name = user ? user.name || user.email : "";
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title={`Доброго дня, ${name}!`}
        subtitle="Ваші фінанси в балансі. Ось що відбувається цього місяця."
        actionText="+ Додати транзакцію"
        onAction={() => setCreateOpen(true)}
      />

      <div className="mx-10 mb-10 flex flex-col gap-7.5">
        <RecentTransactions />
      </div>

      <TransactionFormModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

export default HomePage;
