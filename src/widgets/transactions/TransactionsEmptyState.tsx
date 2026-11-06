import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, Text } from "@/shared/ui";

type TransactionsEmptyStateProps = {
  icon: LucideIcon;
  title: ReactNode;
  description: ReactNode;
  // напр. кнопка «Скинути фільтри»
  action?: ReactNode;
};

function TransactionsEmptyState({ icon: Icon, title, description, action }: TransactionsEmptyStateProps) {
  return (
    <Card className="flex flex-col items-center gap-3 py-12 text-center">
      <span
        aria-hidden
        className="flex size-12 items-center justify-center rounded-full bg-lilac text-primary"
      >
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <Text size="sm" weight="semibold" color="ink">
          {title}
        </Text>
        <Text size="xs" className="max-w-sm text-muted">
          {description}
        </Text>
      </div>
      {action}
    </Card>
  );
}

export { TransactionsEmptyState };
export type { TransactionsEmptyStateProps };
