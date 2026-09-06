'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/lib/api/api-service';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { RolePermissionsMultistep } from './role-permissions-multistep';
import type { Role, Permission } from '../types';

export function RolePermissionsAssignmentPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [assignedPermissions, setAssignedPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadRoles = async () => {
    try {
      const response = await apiService.get<{ data: Role[] }>(ENDPOINTS.roles);
      setRoles(response.data);
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await apiService.get<{ data: Permission[] }>(ENDPOINTS.permissions);
      setPermissions(response.data);
    } catch (err) {
      console.error('Failed to load permissions:', err);
    }
  };

  const loadRolePermissions = async (roleId: number) => {
    try {
      const response = await apiService.get<{ data: Permission[] }>(`${ENDPOINTS.roles}/${roleId}/permissions`);
      setAssignedPermissions(response.data);
    } catch (err) {
      console.error('Failed to load role permissions:', err);
    }
  };

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const handleAssignPermissions = async (roleId: number, permissionIds: number[]) => {
    setSaving(true);
    try {
      await apiService.post(`${ENDPOINTS.roles}/${roleId}/permissions`, {
        permission_ids: permissionIds,
      });
      await loadRolePermissions(roleId);
    } catch (err) {
      console.error('Failed to save permissions:', err);
      alert('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Affectation Rôles/Permissions</h1>
      </div>
      <RolePermissionsMultistep
        roles={roles}
        allPermissions={permissions}
        assignedPermissions={assignedPermissions}
        onAssignPermissions={handleAssignPermissions}
        loading={saving}
      />
    </div>
  );
}
