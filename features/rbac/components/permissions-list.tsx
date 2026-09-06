'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertModal } from '@/components/ui/alert-modal';
import { EditPermissionModal } from './edit-permission-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { useDataTable } from '@/lib/hooks/use-data-table';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Permission } from '../types';

export function PermissionsList() {
  const { data, loading, error, setPage, setPageSize, setSearch, setSort, setFilter, refresh, meta } = useDataTable<Permission>({
    endpoint: ENDPOINTS.permissions,
    initialPageSize: 5,
  });

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; permission: Permission | null }>({
    open: false,
    permission: null,
  });
  const [isSaving, setIsSaving] = useState(false);

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
      // await permissionService.remove(deleteModal.id);
      refresh();
      setDeleteModal({ open: false, id: null });
    } catch (err) {
      console.error('Failed to delete permission:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (permission: Permission) => {
    setEditModal({ open: true, permission });
  };

  const handleSavePermission = async (updatedPermission: Partial<Permission>) => {
    if (!editModal.permission) return;
    setIsSaving(true);
    try {
      await fetch(`${ENDPOINTS.permissions}/${editModal.permission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPermission),
      });
      refresh();
      setEditModal({ open: false, permission: null });
    } catch (err) {
      console.error('Failed to update permission:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const columns: ColumnDef<Permission>[] = [
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
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue('action')}
        </Badge>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'group_name',
      header: 'Group',
      cell: ({ row }) => <div className="text-sm">{row.getValue('group_name') || '-'}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.getValue('description') || '-'}</div>,
      enableSorting: false,
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
        <h1 className="text-xl font-bold">Permissions</h1>
        <Button size="sm">Add Permission</Button>
      </div>

      {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchable
        searchablePlaceholder="Search permissions..."
        pagination
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
        title="Supprimer la permission"
        description="Êtes-vous sûr de vouloir supprimer cette permission ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={isDeleting}
      />

      <EditPermissionModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, permission: null })}
        permission={editModal.permission}
        onSave={handleSavePermission}
        loading={isSaving}
      />
    </div>
  );
}
