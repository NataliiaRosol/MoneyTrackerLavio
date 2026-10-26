import { InfoNote, PageHeader } from "@/shared/ui"

function CategoriesPage() {
  return (
    <div>
      <PageHeader title="Категорії" subtitle="Додайте власний зміст до щоденних витрат і доходів." actionText="+ Створити категорію" />

      <InfoNote className="mx-10 ">Ваші категорії бачать учасники ваших спільних рахунків</InfoNote>

      
    </div>
  )
}

export default CategoriesPage
