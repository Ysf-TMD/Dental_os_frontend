import type { Metadata } from "next";
import { ConsultationsPage } from "@/features/consultations/components/consultations-page";

export const metadata: Metadata = { title: "Consultations — DentalOS" };

export default function Page() {
  return <ConsultationsPage />;
}
