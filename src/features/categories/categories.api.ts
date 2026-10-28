import { api, type ApiResponse } from "@/shared/api";
import type { CategoryIconName } from "./categories.icons";

// дзеркало enum CategoryType з бекенду
export const CATEGORY_TYPES = ["EXPENSE", "INCOME"] as const;

export type CategoryType = (typeof CATEGORY_TYPES)[number];

export type Category = {
  id: string;
  userId: string | null;
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  // true — копія дефолтної категорії, яку бекенд створює юзеру при реєстрації
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryInput = {
  name: string;
  type: CategoryType;
  icon?: CategoryIconName;
  color?: string;
};

// тип категорії бекенд змінювати не дає
export type UpdateCategoryInput = {
  name?: string;
  icon?: CategoryIconName | null;
  color?: string | null;
};

export const categoriesApi = {
  list: () =>
    api
      .get<ApiResponse<Category[]>>("/categories")
      .then(({ data }) => data.data),

  create: (input: CreateCategoryInput) =>
    api
      .post<ApiResponse<Category>>("/categories", input)
      .then(({ data }) => data.data),

  update: (id: string, input: UpdateCategoryInput) =>
    api
      .patch<ApiResponse<Category>>(`/categories/${id}`, input)
      .then(({ data }) => data.data),

  // бекенд відповідає 204 без тіла
  remove: (id: string) => api.delete(`/categories/${id}`).then(() => undefined),
};
