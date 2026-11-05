import { useId, type ReactNode } from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

type InputProps = Omit<InputPrimitive.Props, "className"> & {
  label: ReactNode;
  hint?: ReactNode;
  suffix?: ReactNode;
  className?: string;
};

function Input({
  label,
  hint,
  suffix,
  className,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputProps) {
  const hintId = useId();
  const describedBy = [ariaDescribedBy, hint ? hintId : undefined].filter(Boolean).join(" ");

  return (
    <div data-slot="input-field" className="flex flex-col gap-2">
      <label
        className={cn(
          "flex flex-col rounded-[10px] border border-surface px-3.5 pt-2.5 pb-4.75 transition-colors has-focus-visible:border-violet has-aria-invalid:border-rose has-disabled:cursor-not-allowed has-disabled:opacity-50",
          className,
        )}
      >
        <span className="text-muted text-xs mb-1">{label}</span>
        <span className="flex items-center gap-2">
          <InputPrimitive
            data-slot="input"
            className="w-full min-w-0 text-ink outline-none placeholder:text-gray disabled:cursor-not-allowed"
            aria-describedby={describedBy || undefined}
            {...props}
          />
          {suffix && <span className="shrink-0 text-muted">{suffix}</span>}
        </span>
      </label>
      {hint && (
        <p id={hintId} className="text-12 text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export { Input };
export type { InputProps };
