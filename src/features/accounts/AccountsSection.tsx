import { useState, type ReactNode } from "react";
import { pluralize } from "@/lib/format";
import { Button, Card, Text } from "@/shared/ui";
import type { Account } from "./accounts.api";
import { AccountCard } from "./AccountCard";

const PREVIEW_COUNT = 3;

type AccountsSectionProps = {
  title: ReactNode;
  accounts: Account[] | undefined;
  emptyText: ReactNode;
};

function AccountsSection({ title, accounts, emptyText }: AccountsSectionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!accounts) return null;

  const hasMore = accounts.length > PREVIEW_COUNT;
  const visible = expanded ? accounts : accounts.slice(0, PREVIEW_COUNT);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-16 font-semibold text-ink">{title}</h2>
        <div className="flex items-center gap-4">
          <Text size="xs" className="text-muted">
            {accounts.length}{" "}
            {pluralize(accounts.length, { one: "рахунок", few: "рахунки", many: "рахунків" })}
          </Text>
          {hasMore && (
            <Button variant="link" className="text-12" onClick={() => setExpanded((prev) => !prev)}>
              {expanded ? "Згорнути" : "Переглянути всі"}
            </Button>
          )}
        </div>
      </div>

      {accounts.length === 0 ? (
        <Card>
          <Text size="xs" className="text-muted">
            {emptyText}
          </Text>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((account) => (
            <li key={account.id}>
              <AccountCard account={account} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export { AccountsSection };
export type { AccountsSectionProps };
