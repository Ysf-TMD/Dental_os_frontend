'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import {  useMyRoles, useMyAccessiblePages } from '@/lib/hooks/use-permissions';
import type { Permission, Page, Role } from '@/features/rbac/types';

interface PermissionContextType {

  roles: Role[];
  accessiblePages: Page[];
  loading: boolean;

  hasRole: (roleName: string) => boolean;
  getAccessiblePages: () => Page[];
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  //const { data: permissions = [], isLoading: permissionsLoading } = useMyPermissions();
  const { data: roles = [], isLoading: rolesLoading } = useMyRoles();
  const { data: accessiblePages = [], isLoading: pagesLoading } = useMyAccessiblePages();


  const loading =   rolesLoading || pagesLoading;

  /*const hasPermission = (permissionName: string): boolean => {
    return permissions.some(p => p.name === permissionName);
  };*/

  const hasRole = (roleName: string): boolean => {
    return roles.some(r => r.name === roleName);
  };

  const getAccessiblePages = (): Page[] => {
      console.log("accessible pages " , accessiblePages)
    return accessiblePages;
  };

  return (
    <PermissionContext.Provider
      value={{
        roles,
        accessiblePages,
        loading,
        hasRole,
        getAccessiblePages,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}
