import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "./Input";

type PasswordInputProps = Omit<InputProps, "type" | "suffix">;

function PasswordInput({ label, disabled, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const labelId = useId();
  const Icon = visible ? EyeOff : Eye;

  return (
    <Input
      // Name the input by its label only, so the toggle's aria-label isn't read as part of it.
      label={<span id={labelId}>{label}</span>}
      aria-labelledby={labelId}
      type={visible ? "text" : "password"}
      disabled={disabled}
      suffix={
        <button
          type="button"
          aria-label={visible ? "Сховати пароль" : "Показати пароль"}
          disabled={disabled}
          // Keep focus (and caret position) in the input when clicking with a mouse.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setVisible((v) => !v)}
          className="flex cursor-pointer items-center rounded-sm outline-none transition-colors hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed"
        >
          <Icon className="size-4" />
        </button>
      }
      {...props}
    />
  );
}

export { PasswordInput };
export type { PasswordInputProps };
