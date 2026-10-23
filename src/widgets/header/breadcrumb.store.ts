import { useEffect } from "react";
import { create } from "zustand";

type BreadcrumbState = {
  current: string | null;
};

export const useBreadcrumbStore = create<BreadcrumbState>()(() => ({
  current: null,
}));

// детальна сторінка (рахунок, транзакція…) додає останню крихту зі своєю назвою; поки назви немає — крихти теж немає
export function useBreadcrumb(label: string | null | undefined) {
  useEffect(() => {
    if (!label) return;

    useBreadcrumbStore.setState({ current: label });
    return () => useBreadcrumbStore.setState({ current: null });
  }, [label]);
}
