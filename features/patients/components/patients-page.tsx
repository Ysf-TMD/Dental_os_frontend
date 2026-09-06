"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { useDataTable } from "@/lib/hooks/use-data-table";
import { Download, Phone, Mail, MoreHorizontal, Eye } from "lucide-react";
import { PatientWizard } from "./patient-wizard";
import type { Patient } from "../types/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2 } from "lucide-react";
import { apiService } from "@/lib/api/api-service";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useToast } from "@/components/ui/toast-provider";
import { AlertModal } from "@/components/ui/alert-modal";

const statusStyle: Record<string, string> = {
  actif: "bg-success/10 text-success border-success/20",
  nouveau: "bg-primary/10 text-primary border-primary/20",
  inactif: "bg-muted text-muted-foreground border-border",
};

export function PatientsPage() {
  const router = useRouter();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
  const { showSuccess, showError } = useToast();
  
  const { data, loading, error, setPage, setPageSize, setSearch, setSort, refresh, meta } = useDataTable<Patient>({
    endpoint: ENDPOINTS.patients,
    initialPageSize: 10,
  });
  console.log("patient data " , data)

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateSuccess = () => {
    setShowWizard(false);
    refresh();
  };

  const handleEditSuccess = () => {
    setSelectedPatient(undefined);
    refresh();
  };

  const handleDelete = async (id: number) => {
    setDeleteModal({ open: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      await apiService.delete(`${ENDPOINTS.patients}/${deleteModal.id}`);
      await refresh();
      setDeleteModal({ open: false, id: null });
      showSuccess('Patient supprimé', 'Le patient a été supprimé avec succès');
    } catch (err) {
      console.error('Failed to delete patient:', err);
      showError('Erreur', 'Échec de la suppression du patient');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: 'first_name',
      header: 'Patient',
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-xs font-semibold">
                {patient.first_name[0]}{patient.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{patient.first_name} {patient.last_name}</div>
              <div className="text-xs text-muted-foreground">
                {patient.gender === "M" ? "Homme" : "Femme"} · {new Date().getFullYear() - parseInt(patient.birth_date.slice(0, 4))} ans
              </div>
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'code',
      header: 'Dossier',
      cell: ({ row }) => <div className="text-xs text-muted-foreground tabular-nums">{row.getValue('code')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'phone',
      header: 'Contact',
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div>
            <div className="flex items-center gap-1.5 text-xs"><Phone className="size-3 text-muted-foreground" />{patient.phone}</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5"><Mail className="size-3" />{patient.email}</div>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'city',
      header: 'Ville',
      cell: ({ row }) => <div className="text-xs">{row.getValue('city')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'last_visit',
      header: 'Dernière visite',
      cell: ({ row }) => <div className="text-xs text-muted-foreground">{row.getValue('last_visit')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'balance',
      header: 'Solde',
      cell: ({ row }) => {
        const balance = row.getValue('balance') as number;
        return (
          <div className="tabular-nums text-sm">
            {balance > 0
              ? <span className="text-destructive font-medium">{balance} MAD</span>
              : <span className="text-muted-foreground">—</span>}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant="outline" className={`capitalize ${statusStyle[status]}`}>{status}</Badge>
        );
      },
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
            <DropdownMenuItem onClick={() => router.push(`/patients/${row.original.id}`)}>
              <Eye className="size-4 mr-2" />
              Voir détails
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedPatient(row.original)}>
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

  if (showWizard || selectedPatient) {
    return (
      <PatientWizard
        mode={selectedPatient ? 'edit' : 'create'}
        initialData={selectedPatient}
        onSuccess={selectedPatient ? handleEditSuccess : handleCreateSuccess}
        onCancel={() => {
          setShowWizard(false);
          setSelectedPatient(undefined);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {meta.totalItems} dossiers · {data.filter((p) => p.status === "actif").length} actifs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download className="size-4" />Exporter</Button>
          <Button size="sm" className="gap-2 shadow-[var(--shadow-glow)]" style={{ backgroundImage: "var(--gradient-primary)" }} onClick={() => setShowWizard(true)}>
            Nouveau patient
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchable
        searchablePlaceholder="Rechercher par nom, dossier, téléphone…"
        pagination
        pageSize={10}
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
        title="Supprimer le patient"
        description="Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
}
