import { createElement } from "react";
import { cn } from "@/lib/utils";
import { getCategoryIcon } from "./categories.icons";

type CategoryIconProps = {
  icon: string | null;
  color: string | null;
  className?: string;
};

function CategoryIcon({ icon, color, className }: CategoryIconProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-lilac text-violet",
        className,
      )}
      // власний колір: іконка в ньому, фон — той самий колір з ~12% непрозорості
      style={color ? { color, backgroundColor: `${color}1f` } : undefined}
    >
      {createElement(getCategoryIcon(icon), { className: "size-4.5" })}
    </span>
  );
}

export { CategoryIcon };
export type { CategoryIconProps };
