import axios from "axios";

type ApiErrorBody = {
  success: false;
  error: { code: string; message: string; details?: unknown };
};

// бекенд віддає code: VALIDATION_ERROR, UNAUTHORIZED, FORBIDDEN, CONFLICT, TOO_MANY_REQUESTS…
export function getApiErrorCode(error: unknown): string {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return "UNKNOWN";
  if (!error.response) return "NETWORK_ERROR";
  return error.response.data?.error?.code ?? "UNKNOWN";
}

const COMMON_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: "Немає зʼєднання з сервером. Спробуйте ще раз.",
  TOO_MANY_REQUESTS: "Забагато спроб. Спробуйте пізніше.",
};

// тексти помилок бекенду англійською, тому показуємо свої за кодом
export function getErrorMessage(
  error: unknown,
  messages: Record<string, string> = {},
): string {
  const code = getApiErrorCode(error);
  return (
    messages[code] ??
    COMMON_MESSAGES[code] ??
    "Щось пішло не так. Спробуйте ще раз."
  );
}
