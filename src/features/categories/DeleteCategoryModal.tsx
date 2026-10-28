import { getErrorMessage } from "@/shared/api";
import { FieldError, InfoNote, Modal } from "@/shared/ui";
import type { Category } from "./categories.api";
import { useDeleteCategory } from "./categories.hooks";

// транзакції посилаються на категорію з onDelete: NoAction, тож бекенд відповідає FK_ERROR
const DELETE_ERROR_MESSAGES = {
  FK_ERROR: "У цій категорії є транзакції, тому її не можна видалити.",
};

type DeleteCategoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
};

function DeleteCategoryModal({ open, onOpenChange, category }: DeleteCategoryModalProps) {
  const deleteCategory = useDeleteCategory();

  const onConfirm = () => {
    if (!category) return;
    deleteCategory.mutate(category.id, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      // помилку скидаємо, коли модалка вже зникла, інакше вона стрибне по висоті під час анімації
      onOpenChangeComplete={(isOpen) => !isOpen && deleteCategory.reset()}
      variant="destructive"
      title={`Видалити категорію «${category?.name}»?`}
      confirmText="Видалити"
      onConfirm={onConfirm}
      confirmDisabled={deleteCategory.isPending}
    >
      <div className="flex flex-col gap-3">
        <InfoNote title="Цю дію не можна скасувати" className="bg-cream">
          Категорію, у якій уже є транзакції, видалити не вийде.
        </InfoNote>
        {deleteCategory.error && (
          <FieldError
            errors={[{ message: getErrorMessage(deleteCategory.error, DELETE_ERROR_MESSAGES) }]}
          />
        )}
      </div>
    </Modal>
  );
}

export { DeleteCategoryModal };
export type { DeleteCategoryModalProps };
