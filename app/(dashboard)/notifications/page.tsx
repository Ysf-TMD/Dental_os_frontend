import type { Metadata } from "next";
import { NotificationsPage } from "@/features/notifications/components/notifications-page";

export const metadata: Metadata = { title: "Notifications — DentalOS" };

export default function Page() {
  return <NotificationsPage />;
}
