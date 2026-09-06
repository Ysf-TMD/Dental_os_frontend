import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api/api-service';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Role, Page } from '@/features/rbac/types';



export function useMyRoles() {
  return useQuery({
    queryKey: ['auth', 'me', 'roles'],
    queryFn: async () => {
      const response = await apiService.get<{ data: Role[] }>(`${ENDPOINTS.auth.me}/roles`);
      return response.data;
    },
  });
}

export function useMyAccessiblePages() {


  return useQuery({
    queryKey: ['pages', 'accessible'],
    queryFn: async () => {
      const response = await apiService.get<{ data: Page[] }>(
        `${ENDPOINTS.pages}?per_page=1000`
      );
      return response.data;
    },
  });
}
