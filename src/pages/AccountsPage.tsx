import { useState } from "react";
import {
  AccountsSection,
  CreateAccountModal,
  OwnBalanceNote,
  useAccounts,
} from "@/features/accounts";
import { PageHeader } from "@/shared/ui";

function AccountsPage() {
  const { data: accounts } = useAccounts();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Рахунки"
        subtitle="Окремі простори для ваших коштів і спільних планів."
        actionText="+ Створити рахунок"
        onAction={() => setCreateOpen(true)}
      />

      <div className="mx-10 mb-10 flex flex-col gap-7.5">
        <OwnBalanceNote />

        <AccountsSection
          title="Мої"
          accounts={accounts}
          emptyText="Рахунків поки немає. Створіть перший, щоб почати відстежувати витрати й доходи."
        />
      </div>

      <CreateAccountModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}

export default AccountsPage
