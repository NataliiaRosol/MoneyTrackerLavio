import { useState } from "react";
import { Search } from "lucide-react";
import {
  CategoriesGrid,
  CategoryFormModal,
  DeleteCategoryModal,
  useCategories,
  type Category,
} from "@/features/categories";
import { InfoNote, Input, Loader, PageHeader } from "@/shared/ui";

type CategoryModalState = { open: boolean; category: Category | null };

const normalize = (text: string) => text.trim().toLocaleLowerCase("uk");

function CategoriesPage() {
  const { data: categories, isPending } = useCategories();
  const [search, setSearch] = useState("");
  const [formModal, setFormModal] = useState<CategoryModalState>({ open: false, category: null });
  const [deleteModal, setDeleteModal] = useState<CategoryModalState>({ open: false, category: null });

  const openCreate = () => setFormModal({ open: true, category: null });
  const openEdit = (category: Category) => setFormModal({ open: true, category });
  const onFormOpenChange = (open: boolean) => setFormModal((prev) => ({ ...prev, open }));

  const openDelete = (category: Category) => setDeleteModal({ open: true, category });
  const onDeleteOpenChange = (open: boolean) => setDeleteModal((prev) => ({ ...prev, open }));

  // категорії приходять одним списком, тож шукаємо на клієнті
  const query = normalize(search);
  const visibleCategories = query
    ? categories?.filter((category) => normalize(category.name).includes(query))
    : categories;

  return (
    <div>
      <PageHeader title="Категорії" subtitle="Додайте власний зміст до щоденних витрат і доходів." actionText="+ Створити категорію" onAction={openCreate} />

      <div className="mx-10 mb-10 flex flex-col gap-5">
        <InfoNote>Ваші категорії бачать учасники ваших спільних рахунків</InfoNote>

        <div className="max-w-md">
          <Input
            label="Пошук"
            type="search"
            placeholder="За назвою категорії"
            maxLength={100}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            suffix={<Search className="size-4" />}
          />
        </div>

        {isPending ? (
          <Loader />
        ) : (
          <CategoriesGrid
            categories={visibleCategories}
            emptyText={
              query
                ? `За запитом «${search.trim()}» категорій не знайдено.`
                : "Категорій поки немає. Створіть першу, щоб розподіляти витрати й доходи."
            }
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
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
