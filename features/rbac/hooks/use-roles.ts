import { usePermissions } from '@/lib/context/permission-context';

export function useRoles() {
  const context = usePermissions();
  return {
    roles: context.roles,
    hasRole: context.hasRole,
    loading: context.loading,
  };
}
