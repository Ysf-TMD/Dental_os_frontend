import type { Metadata } from "next";
import { DevisPage } from "@/features/devis/components/devis-page";

export const metadata: Metadata = { title: "Devis — DentalOS" };

export default function Page() {
  return <DevisPage />;
}
