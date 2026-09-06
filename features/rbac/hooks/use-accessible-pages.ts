import { usePermissions } from '@/lib/context/permission-context';

export function useAccessiblePages() {
  const context = usePermissions();
  return {
    accessiblePages: context.accessiblePages,
    getAccessiblePages: context.getAccessiblePages,
    loading: context.loading,
  };
}
