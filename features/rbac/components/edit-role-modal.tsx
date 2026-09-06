'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { roleUpdateSchema, type RoleUpdateInput } from '../schemas/role-schema';
import type { Role } from '../types';

interface EditRoleModalProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  onSave: (role: RoleUpdateInput) => Promise<void>;
  loading?: boolean;
}

export function EditRoleModal({ open, onClose, role, onSave, loading }: EditRoleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleUpdateInput>({
    resolver: zodResolver(roleUpdateSchema),
    defaultValues: {
      name: '',
      display_name: '',
      description: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        display_name: role.display_name,
        description: role.description || '',
        is_active: role.is_active,
      });
    }
  }, [role, reset]);

  const onSubmit = async (data: any) => {
    await onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le rôle</DialogTitle>
          <DialogDescription>
            Modifiez les informations du rôle ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                {...register('name')}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="display_name">Nom d'affichage</Label>
              <Input
                id="display_name"
                {...register('display_name')}
                disabled={loading}
              />
              {errors.display_name && (
                <p className="text-sm text-red-500">{errors.display_name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                disabled={loading}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                {...register('is_active')}
                disabled={loading}
              />
              <Label htmlFor="is_active">Actif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
