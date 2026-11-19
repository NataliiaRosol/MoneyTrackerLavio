import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge, Card, Text } from "@/shared/ui";
import type { Account, AccountRole } from "./accounts.api";
import { ACCOUNT_ROLE_LABELS } from "./accounts.constants";
import { AccountIcon } from "./AccountIcon";

type AccountCardProps = {
  account: Account;
};

function AccountCard({ account }: AccountCardProps) {
  const role: AccountRole | null = account.isMine ? "OWNER" : null;

  return (
    <Link
      to={`/accounts/${account.id}`}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="flex h-full flex-col gap-4 transition-colors group-hover:border-lavender">
        <div className="flex items-start justify-between gap-3">
          <AccountIcon type={account.type} icon={account.icon} color={account.color} />
          {role && <Badge variant="accent">{ACCOUNT_ROLE_LABELS[role]}</Badge>}
        </div>

        <div className="flex min-w-0 flex-col gap-0.5">
          <Text weight="semibold" color="ink" className="truncate" title={account.name}>
            {account.name}
          </Text>
          <Text size="xs" className="text-muted">
            {account.currency}
          </Text>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <Text
            weight="semibold"
            className={cn(
              "text-22 tabular-nums",
              Number(account.balance) < 0 ? "text-rose" : "text-ink",
            )}
          >
            {formatMoney(account.balance, account.currency)}
          </Text>
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-lilac text-primary"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

export { AccountCard };
export type { AccountCardProps };
