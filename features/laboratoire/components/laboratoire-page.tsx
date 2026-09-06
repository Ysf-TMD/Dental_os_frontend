"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { labOrders } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export function LaboratoirePage() {
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Laboratoire</h1>
          <p className="text-sm text-muted-foreground mt-1">Commandes prothèses & travaux externalisés</p>
        </div>
        <Button size="sm" className="gap-2 shadow-[var(--shadow-glow)]" style={{ backgroundImage: "var(--gradient-primary)" }}>
          <Plus className="size-4" />Nouvelle commande
        </Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-3">N°</th>
              <th className="text-left font-medium px-4 py-3">Patient</th>
              <th className="text-left font-medium px-4 py-3">Travail</th>
              <th className="text-left font-medium px-4 py-3">Laboratoire</th>
              <th className="text-left font-medium px-4 py-3">Envoyé</th>
              <th className="text-left font-medium px-4 py-3">Échéance</th>
              <th className="text-left font-medium px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {labOrders.map((l) => (
              <tr key={l.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium tabular-nums">{l.id}</td>
                <td className="px-4 py-3">{l.patient}</td>
                <td className="px-4 py-3">{l.type}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{l.lab}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{l.sent}</td>
                <td className="px-4 py-3 text-xs">{l.due}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={
                    l.status === "Livré" ? "bg-success/10 text-success border-success/30"
                    : l.status === "Retard" ? "bg-destructive/10 text-destructive border-destructive/30"
                    : "bg-primary/10 text-primary border-primary/30"
                  }>{l.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
