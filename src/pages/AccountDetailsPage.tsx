import { useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AccountSettingsCard,
  DeleteAccountCard,
  useAccount,
  type AccountDetails,
} from "@/features/accounts";
import { TransactionFormModal } from "@/features/transactions";
import { cn } from "@/lib/utils";
import { getApiErrorCode, getErrorMessage } from "@/shared/api";
import {
  buttonVariants,
  Card,
  InfoNote,
  Loader,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from "@/shared/ui";
import { useBreadcrumb } from "@/widgets/header";
import { AccountOverview } from "@/widgets/overview";
import {
  EMPTY_TRANSACTION_FILTERS,
  hasActiveFilters,
  TransactionFilters,
  TransactionsList,
  useTransactionFilterParams,
  type TransactionFiltersValue,
} from "@/widgets/transactions";

// «Мій рахунок · UAH · в архіві»
function getSubtitle(account: AccountDetails): string {
  return [
    account.isMine ? "Мій рахунок" : "Спільний рахунок",
    account.currency,
    account.archived && "в архіві",
  ]
    .filter(Boolean)
    .join(" · ");
}

function AccountDetailsPage() {
  // маршрут /accounts/:accountId, тож параметр є завжди
  const { accountId } = useParams<"accountId">();

  // перехід на інший рахунок — нова сторінка: фільтри й вкладка не переносяться з попереднього
  return <AccountDetailsView key={accountId} accountId={accountId!} />;
}

function AccountDetailsView({ accountId }: { accountId: string }) {
  const { data: account, isPending, error } = useAccount(accountId);
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();
  useBreadcrumb(account?.name);

  return (
    <div>
      <div className="mx-10 mt-10">
        <Link to="/accounts" className={cn(buttonVariants({ variant: "link" }))}>
          ← Усі рахунки
        </Link>
      </div>

      {isPending ? (
        <Loader />
      ) : error ? (
        <AccountError error={error} />
      ) : (
        <>
          <PageHeader
            className="mt-4"
            title={account.name}
            subtitle={getSubtitle(account)}
            actionText="+ Додати транзакцію"
            onAction={() => setCreateOpen(true)}
            // бекенд приймає транзакції лише на власні неархівні рахунки
            actionDisabled={!account.isMine || account.archived}
          />

          <Tabs defaultValue="transactions" className="mx-10 mb-10 gap-7.5">
            <TabsList className="border-b border-surface">
              <TabsTrigger value="transactions">Транзакції</TabsTrigger>
              <TabsTrigger value="access">Доступ</TabsTrigger>
              <TabsTrigger value="settings">Налаштування</TabsTrigger>
            </TabsList>

            {/* не розмонтовуємо, щоб сортування й сторінка таблиці не скидалися при перемиканні вкладок */}
            <TabsContent value="transactions" keepMounted>
              <AccountTransactions account={account} />
            </TabsContent>

            <TabsContent value="access">
              <TabPlaceholder>
                Незабаром тут можна буде запросити інших людей до рахунку й керувати їхніми ролями.
              </TabPlaceholder>
            </TabsContent>

            <TabsContent value="settings">
              <div className="flex flex-col gap-5">
                <AccountSettingsCard account={account} />
                <DeleteAccountCard
                  account={account}
                  onDeleted={() => navigate("/accounts", { replace: true })}
                />
              </div>
            </TabsContent>
          </Tabs>

          <TransactionFormModal
            open={createOpen}
            onOpenChange={setCreateOpen}
            defaultAccountId={account.id}
          />
        </>
      )}
    </div>
  );
}

function AccountTransactions({ account }: { account: AccountDetails }) {
  const [filters, setFilters] = useState<TransactionFiltersValue>(EMPTY_TRANSACTION_FILTERS);
  const params = useTransactionFilterParams(filters);

  return (
    <div className="flex flex-col gap-7.5">
      {account.archived && (
        <InfoNote>Рахунок в архіві: нові транзакції до нього додати не можна.</InfoNote>
      )}

      <AccountOverview account={account} />

      <TransactionFilters variant="account" value={filters} onChange={setFilters} />

      <TransactionsList
        filters={{ ...params, accountIds: [account.id] }}
        hasActiveFilters={hasActiveFilters(filters)}
        onResetFilters={() => setFilters(EMPTY_TRANSACTION_FILTERS)}
        emptyDescription="Додайте першу витрату чи дохід на цей рахунок, і вона зʼявиться тут."
      />
    </div>
  );
}

function TabPlaceholder({ children }: { children: ReactNode }) {
  return (
    <Card>
      <Text size="xs" className="text-muted">
        {children}
      </Text>
    </Card>
  );
}

function AccountError({ error }: { error: Error }) {
  // 404 — і для видаленого, і для чужого рахунку: бекенд їх не розрізняє
  const notFound = getApiErrorCode(error) === "NOT_FOUND";

  return (
    <Card className="mx-10 mt-4 mb-10 flex flex-col gap-1">
      <Text size="sm" weight="semibold" color="ink">
        {notFound ? "Рахунок не знайдено" : "Не вдалося завантажити рахунок"}
      </Text>
      <Text size="xs" className="text-muted">
        {notFound
          ? "Можливо, його видалили або посилання містить помилку."
          : getErrorMessage(error)}
      </Text>
    </Card>
  );
}

export default AccountDetailsPage;
