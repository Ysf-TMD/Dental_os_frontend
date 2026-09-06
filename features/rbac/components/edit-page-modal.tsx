'use client';

import React, { useEffect } from 'react';
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
import { IconSelector } from '@/components/ui/icon-selector';
import type { Page } from '../types';

interface EditPageModalProps {
  open: boolean;
  onClose: () => void;
  page: Page | null;
  onSave: (page: Partial<Page>) => Promise<void>;
  loading?: boolean;
}

export function EditPageModal({ open, onClose, page, onSave, loading }: EditPageModalProps) {
  const [formData, setFormData] = React.useState<Partial<Page>>({
    name: '',
    display_name: '',
    path: '',
    icon: '',
    group_name: '',
    is_active: true,
  });

  useEffect(() => {
    if (page) {
      setFormData({
        name: page.name,
        display_name: page.display_name,
        path: page.path,
        icon: String(page.icon || ''),
        group_name: page.group_name || '',
        is_active: page.is_active,
      });
    } else {
      setFormData({
        name: '',
        display_name: '',
        path: '',
        icon: '',
        group_name: '',
        is_active: true,
      });
    }
  }, [page, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la page</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la page ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="display_name">Nom d'affichage</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                disabled={loading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="path">Chemin (path)</Label>
              <Input
                id="path"
                value={formData.path}
                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                disabled={loading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icône</Label>
              <IconSelector
                value={formData.icon && typeof formData.icon === 'string' ? formData.icon : ''}
                onChange={(icon) => setFormData({ ...formData, icon })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="group_name">Groupe</Label>
              <Input
                id="group_name"
                value={formData.group_name}
                onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
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
