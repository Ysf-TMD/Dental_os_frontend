import type { Metadata } from "next";
import { EmployesPage } from "@/features/employes/components/employes-page";

export const metadata: Metadata = { title: "Employés — DentalOS" };

export default function Page() {
  return <EmployesPage />;
}
