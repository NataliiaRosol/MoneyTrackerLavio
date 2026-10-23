import { Outlet } from "react-router-dom";
import { Text } from "@/shared/ui";
import mainImage from "@/assets/main.png";

function AuthLayout() {
  return (
    <div className="flex min-h-dvh w-full bg-white">
      <aside className="hidden w-1/3 flex-col bg-lilac px-10 py-12 lg:flex">
        <Text as="span" size="xl" weight="bold" className="text-primary">
          Lavio
        </Text>

        <div className="mt-10 flex flex-col gap-4">
          <Text as="h1" size="display" weight="semibold" className="text-ink">
            Ваші фінанси.
            <br />У вашому ритмі.
          </Text>
          <Text size="base" className="text-muted">
            Знаходьте баланс між щоденними витратами, великими планами та
            спільними цілями.
          </Text>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <img src={mainImage} alt="Lavio" className="w-full max-w-xs" />
        </div>

        <div className="flex flex-col">
          <Text size="xs" className="leading-7 text-muted">
            Особисте залишається особистим.
          </Text>
          <Text size="xs" className="leading-7 text-muted">
            © {new Date().getFullYear()} Lavio · Політика конфіденційності
          </Text>
        </div>
      </aside>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-6 py-12 lg:w-2/3">
        <Text
          as="span"
          size="xl"
          weight="bold"
          className="mb-8 text-primary lg:hidden"
        >
          Lavio
        </Text>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
