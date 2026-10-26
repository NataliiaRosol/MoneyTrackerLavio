import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CardProps = ComponentProps<"div">;

function Card({ className, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn("rounded-2xl border border-surface bg-white p-6", className)}
      {...props}
    />
  );
}

export { Card };
export type { CardProps };
