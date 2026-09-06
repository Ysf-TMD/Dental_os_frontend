'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertModal } from '@/components/ui/alert-modal';
import { EditRoleModal } from './edit-role-modal';
import { AddRoleModal } from './add-role-modal';
import { RoleUsersModal } from './role-users-modal';
import { ExportImportActions } from './export-import-actions';
import { useToast } from '@/components/ui/toast-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { useDataTable } from '@/lib/hooks/use-data-table';
import { apiService } from '@/lib/api/api-service';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import type { Role } from '../types';
import type { RoleInput, RoleUpdateInput } from '../schemas/role-schema';

export function RolesList() {
  const { data, loading, error, setPage, setPageSize, setSearch, setSort, setFilter, refresh, meta } = useDataTable<Role>({
    endpoint: ENDPOINTS.roles,
    initialPageSize: 5,
  });
  const { showSuccess, showError } = useToast();

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; role: Role | null }>({
    open: false,
    role: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [usersModal, setUsersModal] = useState<{ open: boolean; roleId: number | null; roleName: string }>({
    open: false,
    roleId: null,
    roleName: '',
  });

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleDelete = async (id: number) => {
    setDeleteModal({ open: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      await apiService.delete(`${ENDPOINTS.roles}/${deleteModal.id}`);
      await refresh();
      setDeleteModal({ open: false, id: null });
      showSuccess('Rôle supprimé', 'Le rôle a été supprimé avec succès');
    } catch (err) {
      console.error('Failed to delete role:', err);
      showError('Erreur', 'Échec de la suppression du rôle');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (role: Role) => {
    setEditModal({ open: true, role });
  };

  const handleSaveRole = async (updatedRole: RoleUpdateInput) => {
    if (!editModal.role) return;
    setIsSaving(true);
    try {
      await apiService.put(`${ENDPOINTS.roles}/${editModal.role.id}`, updatedRole);
      await refresh();
      setEditModal({ open: false, role: null });
      showSuccess('Rôle modifié', 'Le rôle a été modifié avec succès');
    } catch (err) {
      console.error('Failed to update role:', err);
      showError('Erreur', 'Échec de la modification du rôle');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddRole = async (newRole: RoleInput) => {
    setIsAdding(true);
    try {
      await apiService.post(ENDPOINTS.roles, newRole);
      await refresh();
      setAddModal(false);
      showSuccess('Rôle créé', 'Le rôle a été créé avec succès');
    } catch (err) {
      console.error('Failed to create role:', err);
      showError('Erreur', 'Échec de la création du rôle');
    } finally {
      setIsAdding(false);
    }
  };

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'display_name',
      header: 'Display Name',
      cell: ({ row }) => <div>{row.getValue('display_name')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.getValue('description') || '-'}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'users_count',
      header: 'Users',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.getValue('users_count') || 0}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setUsersModal({ open: true, roleId: row.original.id, roleName: row.original.display_name })}
          >
            <Eye className="size-4" />
          </Button>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>
          {row.getValue('is_active') ? 'Active' : 'Inactive'}
        </Badge>
      ),
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Pencil className="size-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-destructive">
              <Trash2 className="size-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Roles</h1>
        <div className="flex items-center gap-2">
          <ExportImportActions
            selectedIds={[]}
            endpoint={ENDPOINTS.roles}
            onImportSuccess={refresh}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Nom' },
              { key: 'display_name', label: 'Nom d\'affichage' },
              { key: 'description', label: 'Description' },
              { key: 'is_active', label: 'Actif' },
              { key: 'created_at', label: 'Date de création' },
              { key: 'updated_at', label: 'Date de modification' },
            ]}
          />
          <Button onClick={() => setAddModal(true)} size="sm">
            Add Role
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchable
        searchablePlaceholder="Search roles..."
        pagination
        showViewToggle
        pageSize={5}
        totalCount={meta.totalItems}
        currentPage={meta.currentPage}
        onSearch={setSearch}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRefresh={refresh}
        onSort={(sorting) => {
          if (sorting.length > 0) {
            setSort(sorting[0].id, sorting[0].desc ? 'desc' : 'asc');
          }
        }}
      />

      <AlertModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={confirmDelete}
        title="Supprimer le rôle"
        description="Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={isDeleting}
      />

      <EditRoleModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, role: null })}
        role={editModal.role}
        onSave={handleSaveRole}
        loading={isSaving}
      />

      <AddRoleModal
        open={addModal}
        onClose={() => setAddModal(false)}
        onSave={handleAddRole}
        loading={isAdding}
      />

      <RoleUsersModal
        open={usersModal.open}
        onClose={() => setUsersModal({ open: false, roleId: null, roleName: '' })}
        roleId={usersModal.roleId}
        roleName={usersModal.roleName}
      />
    </div>
  );
}
