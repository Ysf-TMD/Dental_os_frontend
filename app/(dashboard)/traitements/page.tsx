import type { Metadata } from "next";
import { TraitementsPage } from "@/features/traitements/components/traitements-page";

export const metadata: Metadata = { title: "Traitements — DentalOS" };

export default function Page() {
  return <TraitementsPage />;
}
