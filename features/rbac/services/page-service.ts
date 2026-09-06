import { createCrudService } from '@/lib/api/crud-factory';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { apiService } from '@/lib/api/api-service';
import type { Page, PageCreate, PageUpdate } from '../types';

const baseService = createCrudService<Page, PageCreate, PageUpdate>(ENDPOINTS.pages);

export const pageService = {
  ...baseService,

  syncPermissions: (pageId: number, permissionIds: number[]) =>
    apiService.post<{ data: Page }>(`${ENDPOINTS.pages}/${pageId}/sync-permissions`, {
      permission_ids: permissionIds,
    }),

  autoDetect: () =>
    apiService.post<{ data: Page[] }>(`${ENDPOINTS.pages}/auto-detect`, {}),
};
