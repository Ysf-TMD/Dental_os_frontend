import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api/api-service';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Permission, Role, Page } from '@/features/rbac/types';

export function useMyPermissions() {
  return useQuery({
    queryKey: ['auth', 'me', 'permissions'],
    queryFn: async () => {
      const response = await apiService.get<{ data: Permission[] }>(`${ENDPOINTS.auth.me}/permissions`);
      return response.data;
    },
  });
}

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
  const { data: permissions = [] } = useMyPermissions();
  console.log("this is use my permissions " , permissions)

  const pageIds = permissions
    .map(p => p.page_id)
    .filter((id): id is number => id !== null && id !== undefined);

  return useQuery({
    queryKey: ['pages', 'accessible', pageIds],
    queryFn: async () => {
      const response = await apiService.get<{ data: Page[] }>(
        `${ENDPOINTS.pages}?ids=${pageIds.join(',')}&per_page=1000`
      );
      return response.data;
    },
    enabled: pageIds.length > 0,
  });
}
