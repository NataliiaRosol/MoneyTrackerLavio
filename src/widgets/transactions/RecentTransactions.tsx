import { Receipt } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTransactions } from "@/features/transactions";
import { cn } from "@/lib/utils";
import { buttonVariants, Loader } from "@/shared/ui";
import { TransactionsEmptyState } from "./TransactionsEmptyState";
import { TransactionsTableCard } from "./TransactionsTableCard";

const PAGE_SIZE = 10;

function RecentTransactions() {
  const [page, setPage] = useState(1);
  const { data, isPending, isPlaceholderData } = useTransactions({ page, limit: PAGE_SIZE });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-16 font-semibold text-ink">Останні транзакції</h2>
        <Link
          to="/transactions"
          className={cn(buttonVariants({ variant: "link", className: "text-12" }))}
        >
          Усі транзакції →
        </Link>
      </div>

      {/* лише перше завантаження: при зміні сторінки keepPreviousData тримає попередню */}
      {isPending && <Loader />}

      {data &&
        (data.meta.total === 0 ? (
          <TransactionsEmptyState
            icon={Receipt}
            title="Транзакцій ще немає"
            description="Додайте першу витрату чи дохід, і тут зʼявляться останні транзакції з усіх ваших рахунків і категорій."
          />
        ) : (
          <TransactionsTableCard
            data={data}
            page={page}
            onPageChange={setPage}
            isPlaceholderData={isPlaceholderData}
          />
        ))}
    </section>
  );
}

export { RecentTransactions };
