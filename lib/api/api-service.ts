import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Centralized API service.
 * - Sends credentials (httpOnly cookies) with every request (Sanctum SPA auth).
 * - Automatically fetches the CSRF cookie before mutating requests.
 * - Normalizes API errors.
 */
class ApiService {
  private client: AxiosInstance;
  private csrfReady = false;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      withCredentials: true,
      withXSRFToken: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor: ensure CSRF cookie exists for mutating requests
    this.client.interceptors.request.use(async (config) => {
      const method = (config.method ?? "get").toLowerCase();
      if (!this.csrfReady && ["post", "put", "patch", "delete"].includes(method)) {
        await this.fetchCsrfCookie();
      }
      return config;
    });

    // Response interceptor: normalize errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
        if (error.response?.status === 401) {
          // Session expired — notify the app
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
          }
        }
        if (error.response?.status === 419) {
          // CSRF token mismatch — refresh cookie and retry once
          this.csrfReady = false;
          await this.fetchCsrfCookie();
          if (error.config && !(error.config as { _retried?: boolean })._retried) {
            (error.config as { _retried?: boolean })._retried = true;
            return this.client.request(error.config);
          }
        }
        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private normalizeError(
    error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>
  ): ApiError {
    return {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.message ??
        error.message ??
        "Une erreur est survenue",
      errors: error.response?.data?.errors ?? {},
    };
  }

  async fetchCsrfCookie(): Promise<void> {
    await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    this.csrfReady = true;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export type ApiError = {
  status: number;
  message: string;
  errors: Record<string, string[]>;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export const apiService = new ApiService();
