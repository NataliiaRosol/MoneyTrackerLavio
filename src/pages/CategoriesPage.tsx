import { useState } from "react";
import {
  CategoriesGrid,
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

  const openCreate = () => setFormModal({ open: true, category: null });
  const openEdit = (category: Category) => setFormModal({ open: true, category });
  const onFormOpenChange = (open: boolean) => setFormModal((prev) => ({ ...prev, open }));

  const openDelete = (category: Category) => setDeleteModal({ open: true, category });
  const onDeleteOpenChange = (open: boolean) => setDeleteModal((prev) => ({ ...prev, open }));

  return (
    <div>
      <PageHeader title="Категорії" subtitle="Додайте власний зміст до щоденних витрат і доходів." actionText="+ Створити категорію" onAction={openCreate} />

      <div className="mx-10 mb-10 flex flex-col gap-5">
        <InfoNote>Ваші категорії бачать учасники ваших спільних рахунків</InfoNote>

        <CategoriesGrid
          categories={categories}
          emptyText="Категорій поки немає. Створіть першу, щоб розподіляти витрати й доходи."
          onEdit={openEdit}
          onDelete={openDelete}
        />
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
