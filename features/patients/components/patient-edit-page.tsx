"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { usePatient, useUpdatePatient } from "../hooks/use-patients";

interface PatientEditPageProps {
  patientId: string;
}

export function PatientEditPage({ patientId }: PatientEditPageProps) {
  const router = useRouter();
  const { data: patientData, isLoading } = usePatient(patientId);
  const updatePatient = useUpdatePatient();

  const patient = patientData?.data;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data: any = Object.fromEntries(formData.entries());
    
    // Add required fields that might be missing
    data.gender = patient?.gender || 'M';
    data.nationality = patient?.nationality || 'Marocain';
    data.status = patient?.status || 'actif';
    data.balance = patient?.balance || 0;
    data.credit_limit = patient?.credit_limit || 0;
    data.discount_rate = patient?.discount_rate || 0;
    
    updatePatient.mutate(
      { id: parseInt(patientId), data },
      {
        onSuccess: () => {
          router.push(`/patients/${patientId}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Modifier Patient</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {patient?.first_name} {patient?.last_name}
            </p>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prénom</label>
              <input
                name="first_name"
                defaultValue={patient?.first_name}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <input
                name="last_name"
                defaultValue={patient?.last_name}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={patient?.email}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <input
                name="phone"
                defaultValue={patient?.phone}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de naissance</label>
              <input
                name="birth_date"
                type="date"
                defaultValue={patient?.birth_date}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ville</label>
              <input
                name="city"
                defaultValue={patient?.city}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Adresse</label>
            <textarea
              name="address"
              defaultValue={patient?.address}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button type="submit" disabled={updatePatient.isPending} className="gap-2">
              <Save className="size-4" />
              {updatePatient.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
