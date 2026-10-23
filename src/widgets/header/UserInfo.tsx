import { useMe } from "@/features/auth";
import { Text } from "@/shared/ui";

function UserInfo() {
  const { data: user } = useMe();

  if (!user) return null;

  const name = user.name || user.email;

  return (
    <div className="flex shrink-0 items-center gap-4">
      <span
        aria-hidden
        className="flex size-9 items-center justify-center rounded-full bg-lavender text-16 font-medium text-plum"
      >
        {name.charAt(0).toUpperCase()}
      </span>

      <Text as="span" size="sm" weight="semibold" color="ink">
        {name}
      </Text>
    </div>
  );
}

export { UserInfo };
