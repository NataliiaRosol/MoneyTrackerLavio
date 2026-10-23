import { Breadcrumbs } from "./Breadcrumbs";
import { UserInfo } from "./UserInfo";

function Header() {
  return (
    <header className="relative flex h-20 shrink-0 items-center justify-between gap-4 border-b border-surface px-10 shadow-[0_1px_6px_rgb(39_35_57/0.04)]">
      <Breadcrumbs />
      <UserInfo />
    </header>
  );
}

export { Header };
