'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { apiService } from '@/lib/api/api-service';
import { useToast } from '@/components/ui/toast-provider';
import { ExportModal } from './export-modal';
import { ExportProgressModal } from './export-progress-modal';

interface ExportImportActionsProps {
  selectedIds: number[];
  endpoint: string;
  onImportSuccess?: () => void;
  columns?: { key: string; label: string }[];
}

export function ExportImportActions({ selectedIds, endpoint, onImportSuccess, columns = [] }: ExportImportActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useToast();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'exporting' | 'completed' | 'error'>('exporting');
  const [exportError, setExportError] = useState<string>();

  const handleExport = async (selectedColumns: string[], format: 'csv' | 'xlsx' | 'pdf') => {
    setProgressModalOpen(true);
    setExportProgress(0);
    setExportStatus('exporting');
    setExportError(undefined);

    let progressInterval: NodeJS.Timeout | null = null;

    try {
      // Simulate progress
      progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            if (progressInterval) clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiService.post(`${endpoint}/export`, {
        ids: selectedIds,
        columns: selectedColumns,
        format,
      }, {
        responseType: 'blob',
      });

      if (progressInterval) clearInterval(progressInterval);
      setExportProgress(100);
      setExportStatus('completed');

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response as any]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `export_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setTimeout(() => {
        setProgressModalOpen(false);
        showSuccess('Export réussi', `Les données ont été exportées en ${format.toUpperCase()}`);
      }, 1500);
    } catch (err) {
      if (progressInterval) clearInterval(progressInterval);
      setExportStatus('error');
      setExportError((err as any)?.message || 'Échec de l\'export des données');

      setTimeout(() => {
        setProgressModalOpen(false);
        showError('Erreur', 'Échec de l\'export des données');
      }, 2000);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiService.post(`${endpoint}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccess('Import réussi', `${(response as any).imported} éléments importés`);
      onImportSuccess?.();
    } catch (err) {
      console.error('Import failed:', err);
      showError('Erreur', 'Échec de l\'import des données');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleImport}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExportModalOpen(true)}
        >
          <Download className="size-4 mr-2" />
          Exporter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-4 mr-2" />
          Importer
        </Button>
      </div>

      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
        columns={columns}
      />

      <ExportProgressModal
        open={progressModalOpen}
        progress={exportProgress}
        status={exportStatus}
        error={exportError}
      />
    </>
  );
}
