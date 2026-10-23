import { Link, matchPath, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/shared/config";
import { useBreadcrumbStore } from "./breadcrumb.store";

const ROOT_LABEL = "Мій простір";

type Crumb = { label: string; to?: string };

function Breadcrumbs() {
  const { pathname } = useLocation();
  const current = useBreadcrumbStore((state) => state.current);

  const section = NAV_ITEMS.find(({ to }) =>
    matchPath({ path: to, end: to === "/" }, pathname),
  );

  const crumbs: Crumb[] = [{ label: ROOT_LABEL }];
  if (section) {
    crumbs.push({ label: section.label, to: current ? section.to : undefined });
  }
  if (current) crumbs.push({ label: current });

  return (
    <nav aria-label="Хлібні крихти">
      <ol className="flex flex-wrap items-center gap-1 text-12 text-muted">
        {crumbs.map(({ label, to }, index) => (
          <li key={index} className="flex items-center gap-1">
            {index > 0 && <span aria-hidden>/</span>}
            {to ? (
              <Link to={to} className="transition-colors hover:text-primary">
                {label}
              </Link>
            ) : (
              <span
                aria-current={index === crumbs.length - 1 ? "page" : undefined}
              >
                {label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export { Breadcrumbs };
