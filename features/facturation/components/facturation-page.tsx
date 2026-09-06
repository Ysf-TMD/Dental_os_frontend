"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Plus, Send, MoreHorizontal } from "lucide-react";
import { invoices } from "@/lib/mock-data";

const statusStyle: Record<string, string> = {
  payée: "bg-success/10 text-success border-success/30",
  partielle: "bg-warning/10 text-warning border-warning/30",
  "en attente": "bg-primary/10 text-primary border-primary/30",
  "en retard": "bg-destructive/10 text-destructive border-destructive/30",
};

export function FacturationPage() {
  const totals = {
    encaisse: invoices.reduce((a, i) => a + i.paid, 0),
    attente: invoices.filter((i) => i.status !== "payée").reduce((a, i) => a + (i.total - i.paid), 0),
    retard: invoices.filter((i) => i.status === "en retard").reduce((a, i) => a + (i.total - i.paid), 0),
  };

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Facturation</h1>
          <p className="text-sm text-muted-foreground mt-1">{invoices.length} factures · ce mois</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download className="size-4" />PDF / Excel</Button>
          <Button size="sm" className="gap-2 shadow-[var(--shadow-glow)]" style={{ backgroundImage: "var(--gradient-primary)" }}>
            <Plus className="size-4" />Nouvelle facture
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Encaissé</div>
          <div className="text-2xl font-semibold mt-1 tabular-nums">{totals.encaisse.toLocaleString("fr-FR")} <span className="text-sm text-muted-foreground">MAD</span></div>
          <div className="text-xs text-success mt-1">+12,8 % vs mois dernier</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">En attente</div>
          <div className="text-2xl font-semibold mt-1 tabular-nums">{totals.attente.toLocaleString("fr-FR")} <span className="text-sm text-muted-foreground">MAD</span></div>
          <div className="text-xs text-muted-foreground mt-1">{invoices.filter((i) => i.status !== "payée").length} factures</div>
        </Card>
        <Card className="p-5 border-destructive/20">
          <div className="text-xs text-destructive uppercase tracking-wide">En retard</div>
          <div className="text-2xl font-semibold mt-1 tabular-nums text-destructive">{totals.retard.toLocaleString("fr-FR")} <span className="text-sm">MAD</span></div>
          <div className="text-xs text-muted-foreground mt-1">à relancer</div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">N°</th>
                <th className="text-left font-medium px-4 py-3">Patient</th>
                <th className="text-left font-medium px-4 py-3">Émise le</th>
                <th className="text-left font-medium px-4 py-3">Échéance</th>
                <th className="text-right font-medium px-4 py-3">Montant</th>
                <th className="text-right font-medium px-4 py-3">Payé</th>
                <th className="text-left font-medium px-4 py-3">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium tabular-nums">{inv.number}</td>
                  <td className="px-4 py-3">{inv.patient}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{inv.date}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{inv.due}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{inv.total.toLocaleString("fr-FR")} MAD</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{inv.paid.toLocaleString("fr-FR")} MAD</td>
                  <td className="px-4 py-3"><Badge variant="outline" className={`capitalize ${statusStyle[inv.status]}`}>{inv.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="size-8"><Send className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
