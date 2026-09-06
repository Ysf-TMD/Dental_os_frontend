import { useState, useCallback, useEffect } from 'react';
import { apiService } from '@/lib/api/api-service';

interface UseDataTableOptions {
  endpoint: string;
  initialPageSize?: number;
}

interface DataTableParams {
  page: number;
  per_page: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  [key: string]: any;
}

interface DataTableResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export function useDataTable<T>({ endpoint, initialPageSize = 10 }: UseDataTableOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  });
  const [params, setParams] = useState<DataTableParams>({
    page: 1,
    per_page: initialPageSize,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.get<DataTableResponse<T>>(endpoint, {
        params,
      });
      setData(response.data);
      setMeta({
        currentPage: response.meta.current_page,
        totalPages: response.meta.last_page,
        totalItems: response.meta.total,
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load data';
      setError(errorMessage);
      console.error('Data fetch error:', err);
      console.error('Error details:', {
        endpoint,
        params,
        status: err?.response?.status,
        data: err?.response?.data,
      });
    } finally {
      setLoading(false);
    }
  }, [endpoint, params]);

  const updateParams = useCallback((newParams: Partial<DataTableParams>) => {
    setParams((prev) => {
      const updated = { ...prev, ...newParams };
      // Reset to page 1 when search or filters change
      if (newParams.search !== undefined || newParams.sort_by !== undefined) {
        updated.page = 1;
      }
      return updated;
    });
  }, []);

  const setPage = useCallback((page: number) => {
    updateParams({ page });
  }, [updateParams]);

  const setPageSize = useCallback((perPage: number) => {
    updateParams({ per_page: perPage, page: 1 });
  }, [updateParams]);

  const setSearch = useCallback((search: string) => {
    updateParams({ search });
  }, [updateParams]);

  const setSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
    updateParams({ sort_by: sortBy, sort_order: sortOrder });
  }, [updateParams]);

  const setFilter = useCallback((key: string, value: any) => {
    updateParams({ [key]: value });
  }, [updateParams]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    params,
    setPage,
    setPageSize,
    setSearch,
    setSort,
    setFilter,
    refresh,
    meta,
  };
}
