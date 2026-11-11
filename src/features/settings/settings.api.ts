import type { User } from "@/features/auth";
import { api, type ApiResponse } from "@/shared/api";

// null прибирає імʼя
export type UpdateProfileInput = { name: string | null };

// null прибирає рахунок за замовчуванням
export type SetDefaultAccountInput = { accountId: string | null };

// email і пароль бекенд міняє лише з поточним паролем
export type ChangeEmailInput = { email: string; currentPassword: string };

export type ChangePasswordInput = { currentPassword: string; newPassword: string };

export const settingsApi = {
  updateProfile: (input: UpdateProfileInput) =>
    api
      .patch<ApiResponse<User>>("/settings/profile", input)
      .then(({ data }) => data.data),

  setDefaultAccount: (input: SetDefaultAccountInput) =>
    api
      .patch<ApiResponse<User>>("/settings/default-account", input)
      .then(({ data }) => data.data),

  changeEmail: (input: ChangeEmailInput) =>
    api
      .patch<ApiResponse<User>>("/settings/email", input)
      .then(({ data }) => data.data),

  // бекенд відповідає 204 без тіла і завершує всі інші сесії, поточна лишається
  changePassword: (input: ChangePasswordInput) =>
    api.patch("/settings/password", input).then(() => undefined),
};
