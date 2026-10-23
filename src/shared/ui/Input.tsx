import type { ReactNode } from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

type InputProps = Omit<InputPrimitive.Props, "className"> & {
  label: ReactNode;
  className?: string;
};

function Input({ label, className, ...props }: InputProps) {
  return (
    <label
      className={cn(
        "flex flex-col rounded-[10px] border border-surface px-3.5 pt-2.5 pb-4.75 transition-colors has-focus-visible:border-violet has-aria-invalid:border-rose has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
    >
      <span className="text-muted text-xs mb-1">{label}</span>
      <InputPrimitive
        data-slot="input"
        className="w-full min-w-0 text-ink outline-none placeholder:text-gray disabled:cursor-not-allowed"
        {...props}
      />
    </label>
  );
}

export { Input };
export type { InputProps };
