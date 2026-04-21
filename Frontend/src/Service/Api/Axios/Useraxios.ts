import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { Store } from "../../../Store/Store";
import {
  setuserAccessToken,
  logout,
} from "../../../Store/Slices/Auth/UserAuthSlice";

/* ===================== TYPES ===================== */

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/settings",
];

interface RefreshResponse {
  success: boolean;
  accessToken: string;
}

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

/* ===================== AXIOS INSTANCE ===================== */

const userApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // REQUIRED for refresh cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===================== REFRESH STATE ===================== */

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (
  error: unknown | null,
  token: string | null = null,
): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });

  failedQueue = [];
};

/* ===================== REQUEST INTERCEPTOR ===================== */
userApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      config.url?.includes(route),
    );

    if (isPublicRoute) {
      return config;
    }

    const token = Store.getState().userAuth.accesstoken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ===================== RESPONSE INTERCEPTOR ===================== */
userApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      originalRequest.url?.includes(route),
    );

    if (isPublicRoute) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(userApi(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await userApi.post("/auth/refresh");
        const { accessToken } = response.data as RefreshResponse;

        Store.dispatch(setuserAccessToken(accessToken));
        userApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return userApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        Store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default userApi;
