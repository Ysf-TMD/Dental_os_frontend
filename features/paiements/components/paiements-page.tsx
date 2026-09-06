"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { invoices } from "@/lib/mock-data";
import { CreditCard, Banknote, Building2, Plus } from "lucide-react";

const methods = [Banknote, CreditCard, Building2] as const;
const methodLabels = ["Espèces", "Carte bancaire", "Virement"];

export function PaiementsPage() {
  const paid = invoices.filter((i) => i.paid > 0);
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Paiements</h1>
          <p className="text-sm text-muted-foreground mt-1">Encaissements et historique</p>
        </div>
        <Button size="sm" className="gap-2 shadow-[var(--shadow-glow)]" style={{ backgroundImage: "var(--gradient-primary)" }}>
          <Plus className="size-4" />Encaisser
        </Button>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-3">Date</th>
              <th className="text-left font-medium px-4 py-3">Facture</th>
              <th className="text-left font-medium px-4 py-3">Patient</th>
              <th className="text-left font-medium px-4 py-3">Méthode</th>
              <th className="text-right font-medium px-4 py-3">Montant</th>
            </tr>
          </thead>
          <tbody>
            {paid.map((i, idx) => {
              const Icon = methods[idx % methods.length];
              return (
                <tr key={i.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{i.date}</td>
                  <td className="px-4 py-3 font-medium tabular-nums">{i.number}</td>
                  <td className="px-4 py-3">{i.patient}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="gap-1.5"><Icon className="size-3" />{methodLabels[idx % 3]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-success">+{i.paid.toLocaleString("fr-FR")} MAD</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
