import { useEffect, useState } from "react";

// повертає текст, коли він не змінювався delay мс, — щоб не слати запит на кожну літеру.
// очищення ("") застосовується одразу: скидання фільтра не має чекати таймера
function useDebouncedText(value: string, delay = 300): string {
  const [debounced, setDebounced] = useState(value);

  // оновлення власного стану під час рендеру React дозволяє, і так не буде зайвого кадру зі старим текстом
  if (value === "" && debounced !== "") setDebounced("");

  useEffect(() => {
    if (value === "") return;
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return value === "" ? "" : debounced;
}

export { useDebouncedText };
