import type { Metadata } from "next";
import { LaboratoirePage } from "@/features/laboratoire/components/laboratoire-page";

export const metadata: Metadata = { title: "Laboratoire — DentalOS" };

export default function Page() {
  return <LaboratoirePage />;
}
