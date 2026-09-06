import type { Metadata } from "next";
import { RapportsPage } from "@/features/rapports/components/rapports-page";

export const metadata: Metadata = { title: "Rapports — DentalOS" };

export default function Page() {
  return <RapportsPage />;
}
