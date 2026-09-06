import type { Metadata } from "next";
import { DashboardPage } from "@/features/dashboard/components/dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard — DentalOS",
  description: "Vue d'ensemble du cabinet : CA, RDV, paiements, stock.",
};

export default function Page() {
  return <DashboardPage />;
}
