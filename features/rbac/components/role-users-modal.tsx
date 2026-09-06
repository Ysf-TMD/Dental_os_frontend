'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { apiService } from '@/lib/api/api-service';
import { ENDPOINTS } from '@/lib/api/endpoints';

interface User {
  id: number;
  name: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface RoleUsersModalProps {
  open: boolean;
  onClose: () => void;
  roleId: number | null;
  roleName: string;
}

export function RoleUsersModal({ open, onClose, roleId, roleName }: RoleUsersModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && roleId) {
      loadUsers();
    }
  }, [open, roleId]);

  const loadUsers = async () => {
    if (!roleId) return;
    setLoading(true);
    try {
      const response = await apiService.get<{ users: User[] }>(`${ENDPOINTS.roles}/${roleId}/users`);
      setUsers(response.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'first_name',
      header: 'First Name',
      cell: ({ row }) => <div>{row.getValue('first_name') || '-'}</div>,
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
      cell: ({ row }) => <div>{row.getValue('last_name') || '-'}</div>,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Utilisateurs du rôle: {roleName}</DialogTitle>
          <DialogDescription>
            Liste des utilisateurs assignés à ce rôle.
          </DialogDescription>
        </DialogHeader>
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          pagination
          pageSize={10}
        />
      </DialogContent>
    </Dialog>
  );
}
