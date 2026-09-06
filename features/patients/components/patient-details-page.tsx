"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, CreditCard, FileText, Heart, AlertTriangle, Pill, Activity, Shield, FileCheck, Stethoscope, User, Edit, Wallet, TrendingUp, Clock, DollarSign, Plus } from "lucide-react";
import { usePatient } from "../hooks/use-patients";
import { useFinancialSummary, useFinancialTransactions, usePaymentPlans } from "../hooks/use-financial";
import type { Patient, FinancialSummary, FinancialTransaction, PaymentPlan } from "../types";
import { InvoiceDialog } from "./financial/invoice-dialog";
import { PaymentDialog } from "./financial/payment-dialog";
import { PaymentPlanDialog } from "./financial/payment-plan-dialog";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface PatientDetailsPageProps {
  patientId: string;
}

export function PatientDetailsPage({ patientId }: PatientDetailsPageProps) {
  const router = useRouter();
  const { data, isLoading, error } = usePatient(patientId);
  const patient = data?.data;
  
  // Financial data hooks
  const { data: financialSummary, isLoading: loadingSummary } = useFinancialSummary(patientId);
  const { data: transactions, isLoading: loadingTransactions, refetch: refetchTransactions } = useFinancialTransactions(patientId);
  const { data: paymentPlans, isLoading: loadingPlans } = usePaymentPlans(patientId);

  console.log('Patient details page financial data:', {
    patientId,
    financialSummary,
    loadingSummary,
    patientBalance: patient?.cached_balance,
    financialSummaryValues: financialSummary ? {
      total_treatments: financialSummary.total_treatments,
      total_paid: financialSummary.total_paid,
      balance: financialSummary.balance,
      last_payment: financialSummary.last_payment,
      last_payment_amount: financialSummary.last_payment_amount,
    } : null
  });

  // Financial history table columns
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

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1400px] mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Patient Info Card Skeleton */}
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <Skeleton className="size-20 rounded-full" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Skeleton */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>

          {/* Overview Tab Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Medical Tab Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="size-4" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-4 w-full" />
              </Card>
            ))}
          </div>

          {/* Financial Tab Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions Skeleton */}
          <div className="flex gap-2">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-9 w-40" />
            ))}
          </div>

          {/* Financial History Table Skeleton */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20 ml-auto" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-destructive">Erreur lors du chargement du patient</div>
      </div>
    );
  }

  const initials = patient.first_name[0] + patient.last_name[0];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{patient.first_name} {patient.last_name}</h1>
          <p className="text-sm text-muted-foreground">Dossier {patient.code}</p>
        </div>
        <Button onClick={() => router.push(`/patients/${patientId}/edit`)}>
          <Edit className="size-4 mr-2" />
          Modifier
        </Button>
      </div>

      {/* Patient Info Card */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="size-20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Informations personnelles</div>
              <div className="font-medium">{patient.gender === "M" ? "Homme" : "Femme"}</div>
              <div className="text-sm text-muted-foreground">
                {new Date().getFullYear() - parseInt(patient.birth_date.slice(0, 4))} ans
              </div>
              <div className="text-sm text-muted-foreground">{patient.birth_date}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Contact</div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-3" />
                {patient.phone}
              </div>
              {patient.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-3" />
                  {patient.email}
                </div>
              )}
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Adresse</div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="size-3" />
                {patient.city}
              </div>
              {patient.address && (
                <div className="text-sm text-muted-foreground">{patient.address}</div>
              )}
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Statut</div>
              <Badge variant="outline" className="capitalize">{patient.status}</Badge>
              <div className="text-sm text-muted-foreground mt-1">
                Solde: {patient.cached_balance > 0 ? `${patient.cached_balance} MAD` : "0 MAD"}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="medical">Médical</TabsTrigger>
          <TabsTrigger value="treatments">Traitements</TabsTrigger>
          <TabsTrigger value="financial">Financier</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Première visite</div>
                  <div className="font-medium">{patient.first_visit_date || "N/A"}</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Stethoscope className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Dernière visite</div>
                  <div className="font-medium">{patient.last_visit || "N/A"}</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Limite de crédit</div>
                  <div className="font-medium">{patient.credit_limit || 0} MAD</div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="size-4 text-primary" />
                <h3 className="font-semibold">Antécédents médicaux</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                Aucune information disponible
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="size-4 text-destructive" />
                <h3 className="font-semibold">Allergies</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                Aucune allergie connue
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Pill className="size-4 text-primary" />
                <h3 className="font-semibold">Médicaments</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                Aucun médicament en cours
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="size-4 text-primary" />
                <h3 className="font-semibold">Habitudes</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                Aucune information disponible
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="treatments" className="space-y-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">
              Aucun traitement en cours
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          {loadingSummary ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Chargement des données financières...</div>
            </div>
          ) : (
            <>
              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="size-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total traitements</div>
                      <div className="text-xl font-bold">{financialSummary?.total_treatments || 0} MAD</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <DollarSign className="size-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Montant payé</div>
                      <div className="text-xl font-bold text-green-600">{financialSummary?.total_paid || 0} MAD</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Wallet className="size-5 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Reste à payer</div>
                      <div className="text-xl font-bold text-orange-600">{financialSummary?.balance || patient.cached_balance} MAD</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Clock className="size-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Dernier paiement</div>
                      <div className="text-sm font-medium">
                        {financialSummary?.last_payment 
                          ? `${new Date(financialSummary.last_payment).toLocaleDateString('fr-FR')} · ${financialSummary?.last_payment_amount || 0} MAD`
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <InvoiceDialog patientId={patientId} onInvoiceCreated={refetchTransactions} />
                <PaymentDialog patientId={patientId} onPaymentCreated={refetchTransactions} />
                <PaymentPlanDialog patientId={patientId} onPlanCreated={() => {}} />
              </div>

              {/* Financial History Table */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Historique financier</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => router.push(`/patients/${patientId}/financial-history`)}
                  >
                    Voir tout
                  </Button>
                </div>
                <DataTable
                  columns={financialColumns}
                  data={transactions || []}
                  loading={loadingTransactions}
                  pagination={false}
                  searchable={false}
                  filterable={false}
                  totalCount={transactions?.length || 0}
                  currentPage={1}
                />
              </Card>

              {/* Payment Plans Section */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Plans de paiement actifs</h3>
                  <Button variant="ghost" size="sm">Gérer</Button>
                </div>
                {loadingPlans ? (
                  <div className="text-center py-4 text-muted-foreground">Chargement...</div>
                ) : paymentPlans && paymentPlans.length > 0 ? (
                  <div className="space-y-3">
                    {paymentPlans.map((plan: PaymentPlan) => (
                      <div key={plan.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium">{plan.number_of_installments} mensualités</div>
                          <div className="text-sm text-muted-foreground">
                            {plan.installment_amount} MAD / mois
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            plan.status === 'active' 
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }
                        >
                          {plan.status === 'active' ? 'Actif' : plan.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Aucun plan de paiement actif
                  </div>
                )}
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">
              Aucun document disponible
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">
              Aucun historique disponible
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
