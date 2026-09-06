import type { Metadata } from "next";
import { PatientDetailsPage } from "@/features/patients/components/patient-details-page";

export const metadata: Metadata = {
  title: "Détails Patient — DentalOS",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PatientDetailsPage patientId={id} />;
}
