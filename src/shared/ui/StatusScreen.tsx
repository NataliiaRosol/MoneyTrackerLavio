import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Text } from "./text";

type StatusScreenProps = {
  // велике «404» або іконка над заголовком
  visual: ReactNode;
  title: ReactNode;
  description: ReactNode;
  // кнопки під текстом
  actions?: ReactNode;
  // додатковий блок між текстом і кнопками, напр. деталі помилки
  children?: ReactNode;
  // дрібний текст під кнопками
  footnote?: ReactNode;
  // на весь екран з логотипом — коли немає жодного лейауту (404, глобальна помилка).
  // false — всередині AuthLayout: логотип дає він, кнопки на всю ширину одна під одною, як у формах
  fullScreen?: boolean;
};

// заглушка-статус: 404, глобальна помилка, екрани підтвердження пошти
function StatusScreen({
  visual,
  title,
  description,
  actions,
  children,
  footnote,
  fullScreen = true,
}: StatusScreenProps) {
  const Root = fullScreen ? "main" : "div";

  return (
    <Root
      className={cn(
        "flex w-full flex-col items-center text-center",
        fullScreen && "min-h-dvh justify-center bg-white px-6 py-12",
      )}
    >
      {fullScreen && (
        <Text as="span" size="xl" weight="bold" className="mb-8 text-primary">
          Lavio
        </Text>
      )}

      {visual}

      <div className="mt-4 flex max-w-md flex-col gap-2">
        <Text as="h1" size="xl" weight="semibold" className="text-ink">
          {title}
        </Text>
        <Text size="sm" className="text-muted">
          {description}
        </Text>
      </div>

      {children}

      {actions && (
        <div
          className={cn(
            "mt-8 flex gap-3",
            fullScreen
              ? "flex-wrap items-center justify-center"
              : "w-full flex-col",
          )}
        >
          {actions}
        </div>
      )}

      {footnote && (
        <Text size="xs" className="mt-6 text-muted">
          {footnote}
        </Text>
      )}
    </Root>
  );
}

export { StatusScreen };
export type { StatusScreenProps };
