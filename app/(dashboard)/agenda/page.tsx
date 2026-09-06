import type { Metadata } from "next";
import { AgendaPage } from "@/features/agenda/components/agenda-page";

export const metadata: Metadata = { title: "Agenda — DentalOS" };

export default function Page() {
  return <AgendaPage />;
}
