import type { ReactNode } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const modalVariants = {
  default: { title: "text-ink", confirm: "active" },
  destructive: { title: "text-rose", confirm: "cancel" },
} as const;

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // викликається після завершення анімації відкриття/закриття
  onOpenChangeComplete?: (open: boolean) => void;
  variant?: keyof typeof modalVariants;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  confirmText: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: () => void;
  // id форми всередині модалки: тоді кнопка підтвердження сабмітить її
  formId?: string;
  confirmDisabled?: boolean;
  className?: string;
};

function Modal({
  open,
  onOpenChange,
  onOpenChangeComplete,
  variant = "default",
  title,
  description,
  children,
  confirmText,
  cancelText = "Скасувати",
  onConfirm,
  formId,
  confirmDisabled,
  className,
}: ModalProps) {
  const styles = modalVariants[variant];

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-[rgb(39_35_57/0.4)] duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup
          data-slot="modal"
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex w-130 max-w-[calc(100%-2rem)] -translate-1/2 flex-col gap-6 rounded-2xl bg-white p-8 outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            // вкладена модалка не малює свій бекдроп, тому затемнюємо батьківську самі
            "data-nested-dialog-open:after:absolute data-nested-dialog-open:after:inset-0 data-nested-dialog-open:after:rounded-[inherit] data-nested-dialog-open:after:bg-[rgb(39_35_57/0.4)]",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <DialogPrimitive.Title
                className={cn("text-22 font-semibold", styles.title)}
              >
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="text-13 text-muted">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>

            {/* хрестик lucide займає половину viewBox: size-5 дає видимі 10×10, -mr-1.25 притискає його до відступу */}
            <DialogPrimitive.Close
              aria-label="Закрити"
              className="mt-1 -mr-1.25 shrink-0 rounded-md text-muted transition-colors outline-none hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <XIcon className="size-5" />
            </DialogPrimitive.Close>
          </div>

          {children}

          <div className="grid grid-cols-2 gap-4">
            <DialogPrimitive.Close render={<Button className="h-11" />}>
              {cancelText}
            </DialogPrimitive.Close>
            <Button
              type={formId ? "submit" : "button"}
              form={formId}
              variant={styles.confirm}
              disabled={confirmDisabled}
              onClick={onConfirm}
              className="h-11"
            >
              {confirmText}
            </Button>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { Modal };
export type { ModalProps };
