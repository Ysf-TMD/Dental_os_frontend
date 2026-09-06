import type { Metadata } from "next";
import { OdontogrammePage } from "@/features/odontogramme/components/odontogramme-page";

export const metadata: Metadata = { title: "Odontogramme — DentalOS" };

export default function Page() {
  return <OdontogrammePage />;
}
