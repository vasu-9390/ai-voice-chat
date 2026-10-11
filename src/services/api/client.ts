import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('cognivoice_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 & Refresh Token Handling
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Automatic 401 Handling & Refresh Token flow
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('cognivoice_refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem('cognivoice_access_token', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('cognivoice_refresh_token', newRefreshToken);
          }

          processQueue(null, accessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr as AxiosError, null);
          localStorage.removeItem('cognivoice_access_token');
          localStorage.removeItem('cognivoice_refresh_token');
          window.dispatchEvent(new CustomEvent('auth:expired'));
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      } else {
        localStorage.removeItem('cognivoice_access_token');
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
    }

    return Promise.reject(error);
  }
);
