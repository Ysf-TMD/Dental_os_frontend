'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertModal } from '@/components/ui/alert-modal';
import { EditPageModal } from './edit-page-modal';
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
import type { Page } from '../types';

export function PagesList() {
  const { data, loading, error, setPage, setPageSize, setSearch, setSort, setFilter, refresh, meta } = useDataTable<Page>({
    endpoint: ENDPOINTS.pages,
    initialPageSize: 5,
  });

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; page: Page | null }>({
    open: false,
    page: null,
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
      // await pageService.remove(deleteModal.id);
      refresh();
      setDeleteModal({ open: false, id: null });
    } catch (err) {
      console.error('Failed to delete page:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (page: Page) => {
    setEditModal({ open: true, page });
  };

  const handleSavePage = async (updatedPage: Partial<Page>) => {
    if (!editModal.page) return;
    setIsSaving(true);
    try {
      await fetch(`${ENDPOINTS.pages}/${editModal.page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPage),
      });
      refresh();
      setEditModal({ open: false, page: null });
    } catch (err) {
      console.error('Failed to update page:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoDetect = async () => {
    try {
      // await pageService.autoDetect();
      refresh();
    } catch (err) {
      console.error('Failed to auto-detect pages:', err);
    }
  };

  const columns: ColumnDef<Page>[] = [
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
      accessorKey: 'path',
      header: 'Path',
      cell: ({ row }) => <div className="text-sm font-mono">{row.getValue('path')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'group_name',
      header: 'Group',
      cell: ({ row }) => <div className="text-sm">{row.getValue('group_name') || '-'}</div>,
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
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => (
        <div className="text-sm">{row.original.permissions?.length || 0}</div>
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
        <h1 className="text-xl font-bold">Pages ({meta.totalItems})</h1>
        <div className="space-x-2">
          <Button onClick={handleAutoDetect} variant="secondary" size="sm">
            Auto Detect
          </Button>
          <Button size="sm">Add Page</Button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchable
        searchablePlaceholder="Search pages..."
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
        title="Supprimer la page"
        description="Êtes-vous sûr de vouloir supprimer cette page ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={isDeleting}
      />

      <EditPageModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, page: null })}
        page={editModal.page}
        onSave={handleSavePage}
        loading={isSaving}
      />
    </div>
  );
}
