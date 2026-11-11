import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, Text } from "@/shared/ui";

type StatCardProps = {
  title: ReactNode;
  amount: ReactNode;
  caption: ReactNode;
  // картинка-іконка, кладеться в кружечок праворуч від заголовка
  icon: ReactNode;
  // залита картка для головного показника
  accent?: boolean;
};

function StatCard({ title, amount, caption, icon, accent = false }: StatCardProps) {
  return (
    <Card className={cn("flex h-full flex-col gap-4", accent && "border-lavender bg-lilac")}>
      <div className="flex items-center justify-between gap-3">
        <Text size="sm" weight="medium" color="muted">
          {title}
        </Text>
        <span
          aria-hidden
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",

          )}
        >
          {icon}
        </span>
      </div>

      <div className="mt-auto flex min-w-0 flex-col gap-1">
        <Text
          weight="semibold"
          color="ink"
          className="truncate text-28 tabular-nums"
        >
          {amount}
        </Text>
        <Text size="xs" className="text-muted">
          {caption}
        </Text>
      </div>
    </Card>
  );
}

export { StatCard };
export type { StatCardProps };
