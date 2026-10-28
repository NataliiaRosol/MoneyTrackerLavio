import { useState } from "react";
import {
  CategoriesCard,
  CategoryFormModal,
  DeleteCategoryModal,
  useCategories,
  type Category,
} from "@/features/categories";
import { InfoNote, PageHeader } from "@/shared/ui";

type CategoryModalState = { open: boolean; category: Category | null };

function CategoriesPage() {
  const { data: categories } = useCategories();
  const [formModal, setFormModal] = useState<CategoryModalState>({ open: false, category: null });
  const [deleteModal, setDeleteModal] = useState<CategoryModalState>({ open: false, category: null });

  const systemCategories = categories?.filter((category) => category.isDefault);
  const ownCategories = categories?.filter((category) => !category.isDefault);

  const openCreate = () => setFormModal({ open: true, category: null });
  const openEdit = (category: Category) => setFormModal({ open: true, category });
  // категорію не скидаємо, щоб заголовок не змінився під час анімації закриття
  const onFormOpenChange = (open: boolean) => setFormModal((prev) => ({ ...prev, open }));

  const openDelete = (category: Category) => setDeleteModal({ open: true, category });
  const onDeleteOpenChange = (open: boolean) => setDeleteModal((prev) => ({ ...prev, open }));

  return (
    <div>
      <PageHeader title="Категорії" subtitle="Додайте власний зміст до щоденних витрат і доходів." actionText="+ Створити категорію" onAction={openCreate} />

      <div className="mx-10 mb-10 flex flex-col gap-5">
        <InfoNote>Ваші категорії бачать учасники ваших спільних рахунків</InfoNote>

        <div className="grid items-start gap-5 lg:grid-cols-2">
          <CategoriesCard
            title="Системні"
            description="Базові категорії доступні в кожному рахунку. Їх можна змінити або видалити."
            categories={systemCategories}
            emptyText="Системних категорій поки немає."
            onEdit={openEdit}
            onDelete={openDelete}
          />
          <CategoriesCard
            title="Мої категорії"
            description="Власні іконки й кольори. Лише ви можете керувати цими категоріями."
            categories={ownCategories}
            emptyText="Ви ще не створили жодної категорії."
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </div>
      </div>

      <CategoryFormModal
        open={formModal.open}
        onOpenChange={onFormOpenChange}
        category={formModal.category}
      />

      <DeleteCategoryModal
        open={deleteModal.open}
        onOpenChange={onDeleteOpenChange}
        category={deleteModal.category}
      />
    </div>
  )
}

export default CategoriesPage
