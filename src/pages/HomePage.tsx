import { useMe } from "@/features/auth";
import { PageHeader } from "@/shared/ui";

function HomePage() {
  const { data: user } = useMe();
  const name = user ? user.name || user.email : "";

  return (
    <div>
      <PageHeader title={`Доброго дня, ${name}!`} subtitle="Ваші фінанси в балансі. Ось що відбувається цього місяця." actionText="+ Додати транзакцію" />
    </div>
  );
}

export default HomePage;
