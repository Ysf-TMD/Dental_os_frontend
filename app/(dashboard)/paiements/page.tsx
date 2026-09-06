import type { Metadata } from "next";
import { PaiementsPage } from "@/features/paiements/components/paiements-page";

export const metadata: Metadata = { title: "Paiements — DentalOS" };

export default function Page() {
  return <PaiementsPage />;
}
