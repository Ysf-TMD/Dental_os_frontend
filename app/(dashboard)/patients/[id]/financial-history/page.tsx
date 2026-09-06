import type { Metadata } from "next";
import { PatientFinancialHistoryPage } from "@/features/patients/components/patient-financial-history-page";

export const metadata: Metadata = { title: "Historique Financier — DentalOS" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PatientFinancialHistoryPage patientId={id} />;
}
