import type { Metadata } from "next";
import { FacturationPage } from "@/features/facturation/components/facturation-page";

export const metadata: Metadata = { title: "Facturation — DentalOS" };

export default function Page() {
  return <FacturationPage />;
}
