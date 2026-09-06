'use client';

import React from 'react';
import { RolePagesMultistep } from './role-pages-multistep';
import { useToast } from '@/components/ui/toast-provider';
import { useRoles, usePages, useAssignPagesToRole } from '@/lib/hooks/use-rbac';

export function RolePagesAssignmentPage() {
  const { showSuccess, showError } = useToast();
  const { data: roles = [] } = useRoles();
  const { data: pages = [] } = usePages(1000);
  const assignPagesMutation = useAssignPagesToRole();

  const handleAssignPages = async (roleId: number, pageIds: number[]) => {
    try {
      await assignPagesMutation.mutateAsync({ roleId, pageIds });
      showSuccess('Pages affectées avec succès', `${pageIds.length} page(s) assignée(s) au rôle`);
    } catch (err) {
      console.error('Failed to save pages:', err);
      showError('Échec de l\'affectation', 'Impossible d\'assigner les pages au rôle');
    }
  };

  const handleRoleSelect = async (roleId: number) => {
    return [];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Affectation Rôles/Pages</h1>
      </div>
      <RolePagesMultistep
        roles={roles.filter(role => role.name !== 'super_admin')}
        allPages={pages}
        assignedPages={[]}
        onAssignPages={handleAssignPages}
        onRoleSelect={handleRoleSelect}
        loading={assignPagesMutation.isPending}
      />
    </div>
  );
}
