import type { Metadata } from "next";
import { PatientEditPage } from "@/features/patients/components/patient-edit-page";

export const metadata: Metadata = { title: "Modifier Patient — DentalOS" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PatientEditPage patientId={id} />;
}
