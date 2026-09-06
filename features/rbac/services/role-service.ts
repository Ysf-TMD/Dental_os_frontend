import { createCrudService } from '@/lib/api/crud-factory';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { apiService } from '@/lib/api/api-service';
import type { Role, RoleCreate, RoleUpdate } from '../types';

const baseService = createCrudService<Role, RoleCreate, RoleUpdate>(ENDPOINTS.roles);

export const roleService = {
  ...baseService,

  assignToUser: (roleId: number, userId: number) =>
    apiService.post<{ data: Role }>(`${ENDPOINTS.roles}/${roleId}/users/${userId}`, {}),

  removeFromUser: (roleId: number, userId: number) =>
    apiService.delete<void>(`${ENDPOINTS.roles}/${roleId}/users/${userId}`),

  getUsers: (roleId: number) =>
    apiService.get<{ data: any[] }>(`${ENDPOINTS.roles}/${roleId}/users`),
};
