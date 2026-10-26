import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import infoIcon from "@/shared/icons/info.svg";

type InfoNoteProps = {
  // з заголовком текст стає другорядним (muted)
  title?: ReactNode;
  children: ReactNode;
  className?: string;
};

function InfoNote({ title, children, className }: InfoNoteProps) {
  return (
    <div
      data-slot="info-note"
      className={cn("flex items-center gap-3 bg-lilac p-4 rounded-[10px]", className)}
    >
      <img src={infoIcon} alt="" aria-hidden className="shrink-0" />
      <div className="flex min-w-0 flex-col gap-1">
        {title && <p className="text-12 font-semibold text-ink">{title}</p>}
        <p className={cn("text-12", title ? "text-muted" : "text-ink")}>
          {children}
        </p>
      </div>
    </div>
  );
}

export { InfoNote };
export type { InfoNoteProps };
