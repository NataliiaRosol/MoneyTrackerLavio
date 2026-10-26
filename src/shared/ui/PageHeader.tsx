import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type PageHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  // кнопка показується лише коли передано actionText
  actionText?: ReactNode;
  onAction?: () => void;
  actionDisabled?: boolean;
  className?: string;
};

function PageHeader({
  title,
  subtitle,
  actionText,
  onAction,
  actionDisabled,
  className,
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "mx-10 mt-10 mb-7.5 flex items-center justify-between gap-6",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-30 font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-12 text-muted">{subtitle}</p>}
      </div>

      {actionText && (
        <Button
          variant="active"
          disabled={actionDisabled}
          onClick={onAction}
          className="h-11 w-48"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}

export { PageHeader };
export type { PageHeaderProps };
