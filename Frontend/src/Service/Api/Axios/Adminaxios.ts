import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Store } from "../../../Store/Store";
import {
  setAccessToken,
  logout,
} from "../../../Store/Slices/Auth/AdminAuthSlice";

/* ===================== TYPES ===================== */

interface ApiErrorResponse {
  message: string;
}

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

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===================== REFRESH STATE ===================== */

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (
  error: unknown | null,
  token: string | null = null
): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });

  failedQueue = [];
};

/* ===================== REQUEST INTERCEPTOR ===================== */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Store.getState().adminAuth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

/* ===================== RESPONSE INTERCEPTOR ===================== */

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    
    if (originalRequest.url?.includes("/auth/refresh")) {
      Store.dispatch(logout());
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post<
          RefreshResponse,
          AxiosResponse<RefreshResponse>
        >("/auth/refresh");

        const { accessToken } = response.data;

        Store.dispatch(setAccessToken(accessToken));
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        return api(originalRequest);
      } catch (refreshError: unknown) {
        processQueue(refreshError, null);
        Store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
