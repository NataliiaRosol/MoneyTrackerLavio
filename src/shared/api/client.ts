import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useSession } from "./session.store";

export type ApiResponse<T> = { success: true; data: T };

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const { accessToken } = useSession.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;

// бекенд ротує refresh token, тому всі паралельні 401 чекають на один спільний refresh
export function refreshAccessToken() {
  refreshPromise ??= api
    .post<ApiResponse<{ accessToken: string }>>("/auth/refresh")
    .then(({ data }) => {
      useSession.getState().setAccessToken(data.data.accessToken);
      return data.data.accessToken;
    })
    .catch((error: unknown) => {
      useSession.getState().clear();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

const SKIP_REFRESH_URLS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetryableRequestConfig | undefined;

  if (
    error.response?.status !== 401 ||
    !config ||
    config._retry ||
    SKIP_REFRESH_URLS.includes(config.url ?? "")
  ) {
    throw error;
  }

  config._retry = true;
  const accessToken = await refreshAccessToken();
  config.headers.Authorization = `Bearer ${accessToken}`;
  return api(config);
});
