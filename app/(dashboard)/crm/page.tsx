import type { Metadata } from "next";
import { CrmPage } from "@/features/crm/components/crm-page";

export const metadata: Metadata = { title: "CRM — DentalOS" };

export default function Page() {
  return <CrmPage />;
}
