import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api/api-service';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Role, Page } from '@/features/rbac/types';

// Roles hooks
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await apiService.get<{ data: Role[] }>(ENDPOINTS.roles);
      return response.data;
    },
  });
}

export function usePublicRoles() {
  return useQuery({
    queryKey: ['roles', 'public'],
    queryFn: async () => {
      const response = await apiService.get<{ data: Role[] }>(ENDPOINTS.publicRoles);
      return response.data;
    },
  });
}

// Pages hooks
export function usePages(perPage = 1000) {
  return useQuery({
    queryKey: ['pages', { perPage }],
    queryFn: async () => {
      const response = await apiService.get<{ data: Page[] }>(`${ENDPOINTS.pages}?per_page=${perPage}`);
      return response.data;
    },
  });
}

export function usePagesByIds(pageIds: number[]) {
  return useQuery({
    queryKey: ['pages', 'byIds', pageIds],
    queryFn: async () => {
      const response = await apiService.get<{ data: Page[] }>(
        `${ENDPOINTS.pages}?ids=${pageIds.join(',')}&per_page=1000`
      );
      return response.data;
    },
    enabled: pageIds.length > 0,
  });
}

export function useRolePages(roleId: number) {
  return useQuery({
    queryKey: ['roles', roleId, 'pages'],
    queryFn: async () => {
      const response = await apiService.get<{ data: Page[] }>(`${ENDPOINTS.roles}/${roleId}/pages`);
      return response.data;
    },
    enabled: !!roleId,
  });
}

// Mutation hooks
export function useAssignPagesToRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, pageIds }: { roleId: number; pageIds: number[] }) => {
      await apiService.post(`${ENDPOINTS.roles}/${roleId}/pages`, {
        page_ids: pageIds,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles', variables.roleId, 'pages'] });
    },
  });
}
