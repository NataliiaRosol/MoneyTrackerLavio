import { createElement } from "react";
import { cn } from "@/lib/utils";
import { ICONS, isIconName } from "@/shared/icons";
import type { AccountType } from "./accounts.api";
import { ACCOUNT_TYPE_ICON_NAMES } from "./accounts.constants";

type AccountIconProps = {
  type: AccountType;
  icon: string | null;
  color: string | null;
  className?: string;
};

function AccountIcon({ type, icon, color, className }: AccountIconProps) {
  const name = icon && isIconName(icon) ? icon : ACCOUNT_TYPE_ICON_NAMES[type];

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-lilac text-violet",
        className,
      )}
      style={color ? { color, backgroundColor: `${color}1f` } : undefined}
    >
      {createElement(ICONS[name], { className: "size-4.5" })}
    </span>
  );
}

export { AccountIcon };
export type { AccountIconProps };
