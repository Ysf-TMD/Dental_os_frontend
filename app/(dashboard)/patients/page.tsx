import type { Metadata } from "next";
import { PatientsPage } from "@/features/patients/components/patients-page";

export const metadata: Metadata = {
  title: "Patients — DentalOS",
};

export default function Page() {
  return <PatientsPage />;
}
