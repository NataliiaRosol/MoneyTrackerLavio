import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "./text";

type LoaderProps = {
  // на весь екран з логотипом — коли ще нема жодного лейауту (старт застосунку)
  fullScreen?: boolean;
  className?: string;
};

function Loader({ fullScreen = false, className }: LoaderProps) {
  return (
    <div
      role="status"
      aria-label="Завантаження"
      data-slot="loader"
      className={cn(
        "flex w-full items-center justify-center",
        fullScreen ? "min-h-dvh bg-white" : "py-12",
        className,
      )}
    >
      {/* з'являється із затримкою, щоб на швидкій відповіді не блимало */}
      <div className="flex flex-col items-center gap-6 animate-in fade-in delay-300 duration-300 fill-mode-backwards">
        {fullScreen && (
          <Text as="span" size="xl" weight="bold" className="text-primary">
            Lavio
          </Text>
        )}
        <LoaderCircle aria-hidden className="size-8 animate-spin text-violet" />
      </div>
    </div>
  );
}

export { Loader };
export type { LoaderProps };
