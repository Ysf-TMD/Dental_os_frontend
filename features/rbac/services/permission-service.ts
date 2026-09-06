import { createCrudService } from '@/lib/api/crud-factory';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Permission, PermissionCreate, PermissionUpdate } from '../types';

export const permissionService = createCrudService<Permission, PermissionCreate, PermissionUpdate>(
  ENDPOINTS.permissions
);
