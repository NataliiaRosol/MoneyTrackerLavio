import type { ReactNode } from "react";
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
};

// повноекранна заглушка для 404 і глобальної помилки
function StatusScreen({
  visual,
  title,
  description,
  actions,
  children,
}: StatusScreenProps) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-white px-6 py-12 text-center">
      <Text as="span" size="xl" weight="bold" className="mb-8 text-primary">
        Lavio
      </Text>

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
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {actions}
        </div>
      )}
    </main>
  );
}

export { StatusScreen };
export type { StatusScreenProps };
