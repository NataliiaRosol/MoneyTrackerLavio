import { useState, type ReactNode } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./Calendar";
import { PopoverField } from "./PopoverField";

type DatePickerProps = {
  label: ReactNode;
  value: Date | undefined;
  onChange: (date: Date) => void;
  placeholder?: ReactNode;
  "aria-invalid"?: boolean;
  className?: string;
};

/** Поле з вибором одного дня: календар відкривається в поповері. */
function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Оберіть дату",
  "aria-invalid": ariaInvalid,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <PopoverField
      label={label}
      valueText={value ? format(value, "dd.MM.yyyy") : null}
      placeholder={placeholder}
      icon={<CalendarIcon />}
      open={open}
      onOpenChange={setOpen}
      aria-invalid={ariaInvalid}
      className={className}
    >
      <Calendar
        selected={value}
        defaultMonth={value}
        onSelect={(date) => {
          // повторний клік по обраному дню знімає вибір — лишаємо попередню дату
          if (date) onChange(date);
          setOpen(false);
        }}
        className="border-0"
      />
    </PopoverField>
  );
}

export { DatePicker };
export type { DatePickerProps };
