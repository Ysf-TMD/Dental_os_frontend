import type { Metadata } from "next";
import { ParametresPage } from "@/features/parametres/components/parametres-page";

export const metadata: Metadata = { title: "Paramètres — DentalOS" };

export default function Page() {
  return <ParametresPage />;
}
