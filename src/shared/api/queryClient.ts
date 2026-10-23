import { QueryClient } from "@tanstack/react-query";
import { useSession } from "./session.store";

export const queryClient = new QueryClient();

// після logout або невдалого refresh прибираємо з кешу дані попереднього юзера
useSession.subscribe((state, prevState) => {
  if (prevState.status === "authenticated" && state.status === "guest") {
    queryClient.clear();
  }
});
