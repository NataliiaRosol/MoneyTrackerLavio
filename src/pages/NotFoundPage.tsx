import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants, StatusScreen, Text } from "@/shared/ui";

const homeLinkClassName = cn(
  buttonVariants({ variant: "active" }),
  "w-auto px-6",
);

function NotFoundPage() {
  return (
    <StatusScreen
      visual={
        <Text size="display" weight="semibold" className="text-violet">
          404
        </Text>
      }
      title="Сторінку не знайдено"
      description="Можливо, її було переміщено або посилання містить помилку."
      actions={
        // для гостя RequireAuth на "/" сам перекине на /login
        <Link to="/" replace className={homeLinkClassName}>
          На головну
        </Link>
      }
    />
  );
}

export default NotFoundPage;
