import { create } from "zustand";

type SessionStatus = "pending" | "authenticated" | "guest";

type SessionState = {
  accessToken: string | null;
  status: SessionStatus;
  setAccessToken: (accessToken: string) => void;
  clear: () => void;
};

// access token живе тільки в пам'яті, refresh token — у httpOnly cookie, яку браузер шле сам
export const useSession = create<SessionState>()((set) => ({
  accessToken: null,
  status: "pending",
  setAccessToken: (accessToken) => set({ accessToken, status: "authenticated" }),
  clear: () => set({ accessToken: null, status: "guest" }),
}));
