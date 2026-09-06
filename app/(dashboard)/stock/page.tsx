import type { Metadata } from "next";
import { StockPage } from "@/features/stock/components/stock-page";

export const metadata: Metadata = { title: "Stock — DentalOS" };

export default function Page() {
  return <StockPage />;
}
