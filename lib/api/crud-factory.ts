import { apiService, type PaginatedResponse } from "./api-service";

export type QueryParams = Record<string, string | number | boolean | undefined>;

/**
 * Generic CRUD service factory — centralizes API access per resource.
 * Each feature service is created from this factory to stay DRY.
 */
export function createCrudService<T, TCreate = Partial<T>, TUpdate = Partial<T>>(
  endpoint: string
) {
  return {
    list: (params?: QueryParams) =>
      apiService.get<PaginatedResponse<T>>(endpoint, { params }),

    all: (params?: QueryParams) =>
      apiService.get<{ data: T[] }>(endpoint, {
        params: { ...params, per_page: "all" },
      }),

    get: (id: number | string) =>
      apiService.get<{ data: T }>(`${endpoint}/${id}`),

    create: (data: TCreate) =>
      apiService.post<{ data: T }>(endpoint, data),

    update: (id: number | string, data: TUpdate) =>
      apiService.put<{ data: T }>(`${endpoint}/${id}`, data),

    remove: (id: number | string) =>
      apiService.delete<void>(`${endpoint}/${id}`),
  };
}

export type CrudService<T, TCreate = Partial<T>, TUpdate = Partial<T>> =
  ReturnType<typeof createCrudService<T, TCreate, TUpdate>>;
