import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, type UpdateCategoryInput } from "./categories.api";

export const categoriesQueryKey = ["categories"] as const;

export function useCategories() {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: categoriesApi.list,
  });
}

function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({ mutationFn: categoriesApi.create, onSuccess: invalidate });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateCategoryInput & { id: string }) =>
      categoriesApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({ mutationFn: categoriesApi.remove, onSuccess: invalidate });
}
