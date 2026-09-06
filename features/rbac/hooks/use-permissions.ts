import { usePermissions as usePermissionContext } from '@/lib/context/permission-context';

export function usePermissions() {
  const context = usePermissionContext();
  return {
    permissions: context.permissions,
    hasPermission: context.hasPermission,
    loading: context.loading,
    refreshPermissions: context.refreshPermissions,
  };
}
