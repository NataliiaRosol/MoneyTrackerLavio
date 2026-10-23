import { api, type ApiResponse } from "@/shared/api";

export type User = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  emailVerifiedAt: string | null;
  systemRole: "USER" | "ADMIN";
  baseCurrency: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginInput = { email: string; password: string };
export type RegisterInput = { name?: string; email: string; password: string };
export type AuthResponse = { user: User; accessToken: string };

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
};
