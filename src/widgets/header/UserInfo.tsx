import { Menu } from "@base-ui/react/menu";
import { useLogout, useMe } from "@/features/auth";
import { Text } from "@/shared/ui";
import exitIcon from "@/shared/icons/exit.svg";

function UserInfo() {
  const { data: user } = useMe();
  const logout = useLogout();

  if (!user) return null;

  const name = user.name || user.email;

  return (
    <Menu.Root>
      <Menu.Trigger className="flex shrink-0 cursor-pointer items-center gap-4 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <span
          aria-hidden
          className="flex size-9 items-center justify-center rounded-full bg-lavender text-16 font-medium text-plum"
        >
          {name.charAt(0).toUpperCase()}
        </span>

        <Text as="span" size="sm" weight="semibold" color="ink">
          {name}
        </Text>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={12} className="z-50">
          <Menu.Popup className="flex w-60 origin-(--transform-origin) flex-col gap-3.75 rounded-2xl border border-surface bg-white p-5 shadow-[0_4px_16px_rgb(39_35_57/0.08)] outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            {/* без імені в name вже лежить email — не дублюємо його */}
            {user.name && (
              <Text size="sm" weight="semibold" color="ink" className="truncate">
                {user.name}
              </Text>
            )}
            <Text size="xs" className="truncate text-muted">
              {user.email}
            </Text>

            <Menu.Separator className="h-px bg-surface" />

            <Menu.Item
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
              className="flex cursor-pointer items-center gap-2 rounded-md text-13 text-rose outline-none transition-opacity data-disabled:cursor-default data-disabled:opacity-50 data-highlighted:opacity-80"
            >
              <img src={exitIcon} alt="" aria-hidden className="shrink-0" />
              Вийти
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export { UserInfo };
