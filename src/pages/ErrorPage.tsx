import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants, StatusScreen } from "@/shared/ui";
import NotFoundPage from "./NotFoundPage";

const homeLinkClassName = cn(buttonVariants(), "w-auto px-6");

function getErrorText(error: unknown): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (error instanceof Error) return error.message;
  return String(error);
}

// errorElement кореневого роуту: сюди падає будь-яка помилка рендеру сторінки
function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return (
    <StatusScreen
      visual={
        <span
          aria-hidden
          className="flex size-16 items-center justify-center rounded-full bg-rose-pale text-rose"
        >
          <TriangleAlert className="size-7" />
        </span>
      }
      title="Щось пішло не так"
      description="Сталася неочікувана помилка. Спробуйте оновити сторінку, а якщо не допоможе — поверніться на головну."
      actions={
        <>
          {/* повне перезавантаження скидає і стан, і кеш запитів */}
          <Button
            variant="active"
            className="w-auto px-6"
            onClick={() => window.location.reload()}
          >
            Оновити сторінку
          </Button>
          <Link to="/" replace className={homeLinkClassName}>
            На головну
          </Link>
        </>
      }
    >
      {/* текст помилки показуємо тільки в dev, повний stack є в консолі */}
      {import.meta.env.DEV && (
        <pre className="mt-6 max-h-48 w-full max-w-xl overflow-auto rounded-[10px] bg-rose-pale p-4 text-left text-12 whitespace-pre-wrap text-rose">
          {getErrorText(error)}
        </pre>
      )}
    </StatusScreen>
  );
}

export default ErrorPage;
