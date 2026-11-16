import { api, type ApiResponse } from "@/shared/api";

export type User = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  emailVerifiedAt: string | null;
  systemRole: "USER" | "ADMIN";
  baseCurrency: string;
  // підставляється в нову транзакцію; null — не обрано
  defaultAccountId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LoginInput = { email: string; password: string };
export type RegisterInput = { name?: string; email: string; password: string };
export type AuthResponse = { user: User; accessToken: string };
export type ResetPasswordInput = { token: string; password: string };

export const authApi = {
  login: (input: LoginInput) =>
    api
      .post<ApiResponse<AuthResponse>>("/auth/login", input)
      .then(({ data }) => data.data),

  register: (input: RegisterInput) =>
    api
      .post<ApiResponse<AuthResponse>>("/auth/register", input)
      .then(({ data }) => data.data),

  me: () => api.get<ApiResponse<User>>("/auth/me").then(({ data }) => data.data),

  logout: () => api.post("/auth/logout").then(() => undefined),

  // публічний і віддає 204 без юзера: посилання можуть відкрити там, де ніхто не залогінений
  verifyEmail: (token: string) =>
    api.post("/auth/verify-email", { token }).then(() => undefined),

  // лише із сесією; новий лист робить попереднє посилання недійсним
  resendVerification: () =>
    api.post("/auth/verify-email/resend").then(() => undefined),

  // завжди 204, навіть для незареєстрованого email — щоб не видавати, хто є в системі
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }).then(() => undefined),

  // посилання одноразове; автологіну немає — бекенд завершує всі сеанси і стирає refresh cookie
  resetPassword: (input: ResetPasswordInput) =>
    api.post("/auth/reset-password", input).then(() => undefined),
};
