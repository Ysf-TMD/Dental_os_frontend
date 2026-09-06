'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (selectedColumns: string[], format: 'csv' | 'xlsx' | 'pdf') => void;
  columns: { key: string; label: string }[];
}

export function ExportModal({ open, onClose, onExport, columns }: ExportModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(c => c.key));
  const [selectAll, setSelectAll] = useState(true);
  const [format, setFormat] = useState<'csv' | 'xlsx' | 'pdf'>('csv');

  const handleToggleColumn = (columnKey: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(columnKey)) {
        const newSelection = prev.filter(c => c !== columnKey);
        setSelectAll(newSelection.length === columns.length);
        return newSelection;
      } else {
        const newSelection = [...prev, columnKey];
        setSelectAll(newSelection.length === columns.length);
        return newSelection;
      }
    });
  };

  const handleToggleAll = () => {
    if (selectAll) {
      setSelectedColumns([]);
      setSelectAll(false);
    } else {
      setSelectedColumns(columns.map(c => c.key));
      setSelectAll(true);
    }
  };

  const handleExport = () => {
    onExport(selectedColumns, format);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exporter les données</DialogTitle>
          <DialogDescription>
            Sélectionnez les colonnes et le format d'export
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Format d'export</Label>
            <div className="flex gap-2">
              {(['csv', 'xlsx', 'pdf'] as const).map((fmt) => (
                <Button
                  key={fmt}
                  variant={format === fmt ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat(fmt)}
                >
                  {fmt.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="select-all"
              checked={selectAll}
              onCheckedChange={handleToggleAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium cursor-pointer"
            >
              Tout sélectionner
            </label>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center space-x-2">
                <Checkbox
                  id={column.key}
                  checked={selectedColumns.includes(column.key)}
                  onCheckedChange={() => handleToggleColumn(column.key)}
                />
                <label
                  htmlFor={column.key}
                  className="text-sm cursor-pointer"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleExport} disabled={selectedColumns.length === 0}>
            Exporter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
