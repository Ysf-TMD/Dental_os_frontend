"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Filter, X } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { useFinancialTransactions } from "../hooks/use-financial";
import type { FinancialTransaction } from "../types";

interface PatientFinancialHistoryPageProps {
  patientId: string;
}

export function PatientFinancialHistoryPage({ patientId }: PatientFinancialHistoryPageProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionType, setTransactionType] = useState("");
  
  const filters = {
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    type: transactionType || undefined,
  };
  
  const { data: transactions, isLoading } = useFinancialTransactions(patientId, filters);
  
  console.log('Financial history page state:', { 
    patientId, 
    filters, 
    transactions, 
    isLoading,
    transactionsCount: transactions?.length 
  });

  const financialColumns: ColumnDef<FinancialTransaction>[] = [
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString('fr-FR'),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <Badge 
            variant="outline" 
            className={
              type === 'invoice' 
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : type === 'payment'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-gray-50 text-gray-700 border-gray-200'
            }
          >
            {type === 'invoice' ? 'Facture' : 
             type === 'payment' ? 'Paiement' : 
             type === 'refund' ? 'Remboursement' : 'Ajustement'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "reference",
      header: "Référence",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.getValue("reference") || `TRX-${row.original.id}`}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }) => {
        const type = row.original.type;
        const amount = row.getValue("amount") as number;
        return (
          <span className={`font-medium ${
            type === 'invoice' ? 'text-red-600' : 'text-green-600'
          }`}>
            {type === 'invoice' ? '+' : '-'}{amount} MAD
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: () => (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Validé
        </Badge>
      ),
    },
  ];

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setTransactionType("");
  };

  const hasActiveFilters = startDate || endDate || transactionType;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Historique Financier</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Patient #{patientId} · {transactions?.length || 0} transactions
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="size-4" />
                Filtrer
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:max-w-[500px]">
              <SheetHeader>
                <SheetTitle>Filtrer les transactions</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Date de début</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Date de fin</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transaction-type">Type de transaction</Label>
                  <select
                    id="transaction-type"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Tous les types</option>
                    <option value="invoice">Facture</option>
                    <option value="payment">Paiement</option>
                    <option value="refund">Remboursement</option>
                  </select>
                </div>
              </div>
              <SheetFooter className="flex gap-2">
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="gap-2">
                    <X className="size-4" />
                    Effacer
                  </Button>
                )}
                <Button onClick={() => setShowFilters(false)}>
                  Appliquer
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Exporter
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <DataTable
          columns={financialColumns}
          data={transactions || []}
          loading={isLoading}
          pagination={true}
          searchable={true}
          filterable={true}
        />
      </Card>
    </div>
  );
}
