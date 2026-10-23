import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Text } from "@/shared/ui";
import { NAV_ITEMS } from "./sidebar.constants";

function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-dvh w-60 shrink-0 flex-col border-r border-surface bg-white px-5 pt-8">
      <Text as="span" size="lg" weight="bold" color="primary">
        Lavio
      </Text>

      <nav className="mt-8">
        <ul className="flex flex-col gap-4">
          {NAV_ITEMS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 text-14 text-muted transition-colors hover:text-primary",
                    isActive && "text-primary",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        aria-hidden
                        className="size-2.5 shrink-0 rounded-full bg-primary"
                      />
                    )}
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export { Sidebar };
