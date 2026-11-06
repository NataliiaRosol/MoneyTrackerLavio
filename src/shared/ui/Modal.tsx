import { createContext, useContext, type ReactNode } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const modalVariants = {
  default: { title: "text-ink", confirm: "active" },
  destructive: { title: "text-rose", confirm: "cancel" },
} as const;

type ModalBaseProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // викликається після завершення анімації відкриття/закриття
  onOpenChangeComplete?: (open: boolean) => void;
  variant?: keyof typeof modalVariants;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
};

// стандартні кнопки внизу: «Скасувати» і підтвердження
type ModalActionsProps = {
  footer?: never;
  confirmText: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: () => void;
  // id форми всередині модалки: тоді кнопка підтвердження сабмітить її
  formId?: string;
  confirmDisabled?: boolean;
};

// власні кнопки замість стандартних; закрити модалку лишається хрестиком, Esc чи кліком повз
type ModalFooterProps = {
  footer: ReactNode;
  confirmText?: never;
  cancelText?: never;
  onConfirm?: never;
  formId?: never;
  confirmDisabled?: never;
};

type ModalProps = ModalBaseProps & (ModalActionsProps | ModalFooterProps);

// true всередині іншої модалки: так вкладена дізнається, що вона вкладена
const NestedModalContext = createContext(false);

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
  footer,
  className,
}: ModalProps) {
  const styles = modalVariants[variant];
  const nested = useContext(NestedModalContext);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
    >
      <DialogPrimitive.Portal>
        {/* Base UI закриває модалку кліком повз лише по її власному бекдропу, а вкладеній його за замовчуванням не малює.
            Тому малюємо завжди, але у вкладеної він прозорий: затемнення вже дає батьківська */}
        <DialogPrimitive.Backdrop
          forceRender
          className={cn(
            "fixed inset-0 z-50",
            !nested &&
              "bg-[rgb(39_35_57/0.4)] duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
          )}
        />
        <DialogPrimitive.Popup
          data-slot="modal"
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-130 max-w-[calc(100%-2rem)] -translate-1/2 flex-col gap-6 rounded-2xl bg-white p-8 outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            // бекдроп вкладеної модалки прозорий, тому батьківську затемнюємо самі
            "data-nested-dialog-open:after:absolute data-nested-dialog-open:after:inset-0 data-nested-dialog-open:after:rounded-[inherit] data-nested-dialog-open:after:bg-[rgb(39_35_57/0.4)]",
            className,
          )}
        >
          <NestedModalContext.Provider value>
            <div className="flex shrink-0 items-start justify-between gap-4">
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

            {/* скролиться лише контент, шапка й кнопки лишаються на місці; -m-1 p-1 не дає overflow обрізати focus-ring */}
            {children && (
              <div className="-m-1 min-h-0 flex-1 overflow-y-auto p-1">{children}</div>
            )}

            {footer !== undefined ? (
              <div className="shrink-0">{footer}</div>
            ) : (
              <div className="grid shrink-0 grid-cols-2 gap-4">
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
            )}
          </NestedModalContext.Provider>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { Modal };
export type { ModalProps };
