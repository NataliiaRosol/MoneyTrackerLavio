import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants, Text } from "@/shared/ui";

const homeLinkClassName = cn(
  buttonVariants({ variant: "active" }),
  "mt-8 w-auto px-6",
);

function NotFoundPage() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-white px-6 py-12 text-center">
      <Text as="span" size="xl" weight="bold" className="mb-8 text-primary">
        Lavio
      </Text>

      <Text as="h1" size="display" weight="semibold" className="text-violet">
        404
      </Text>

      <div className="mt-4 flex max-w-md flex-col gap-2">
        <Text as="h2" size="xl" weight="semibold" className="text-ink">
          Сторінку не знайдено
        </Text>
        <Text size="sm" className="text-muted">
          Можливо, її було переміщено або посилання містить помилку.
        </Text>
      </div>

      {/* для гостя RequireAuth на "/" сам перекине на /login */}
      <Link to="/" replace className={homeLinkClassName}>
        На головну
      </Link>
    </main>
  );
}

export default NotFoundPage;
