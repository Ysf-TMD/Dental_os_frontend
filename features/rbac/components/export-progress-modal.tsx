'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface ExportProgressModalProps {
  open: boolean;
  progress: number;
  status: 'exporting' | 'completed' | 'error';
  error?: string;
}

export function ExportProgressModal({ open, progress, status, error }: ExportProgressModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {status === 'exporting' && 'Export en cours...'}
            {status === 'completed' && 'Export terminé'}
            {status === 'error' && 'Erreur d\'export'}
          </DialogTitle>
          <DialogDescription>
            {status === 'exporting' && `Exportation des données... ${progress}%`}
            {status === 'completed' && 'Les données ont été exportées avec succès'}
            {status === 'error' && error || 'Une erreur est survenue lors de l\'export'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {status === 'exporting' && (
            <Progress value={progress} className="w-full" />
          )}
          {status === 'error' && (
            <div className="text-sm text-red-500 mt-2">
              {error || 'Veuillez réessayer'}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
