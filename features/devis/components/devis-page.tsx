"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { FileSpreadsheet, Plus, ArrowRight } from "lucide-react";

export function DevisPage() {
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Devis</h1>
          <p className="text-sm text-muted-foreground mt-1">Propositions de traitement</p>
        </div>
        <Button size="sm" className="gap-2 shadow-[var(--shadow-glow)]" style={{ backgroundImage: "var(--gradient-primary)" }}>
          <Plus className="size-4" />Nouveau devis
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {patients.slice(0, 9).map((p, i) => {
          const total = 2400 + (i * 871) % 18000;
          const status = (["Envoyé", "Accepté", "Brouillon", "Refusé", "Envoyé"] as const)[i % 5];
          const color =
            status === "Accepté" ? "bg-success/10 text-success border-success/30" :
            status === "Envoyé" ? "bg-primary/10 text-primary border-primary/30" :
            status === "Refusé" ? "bg-destructive/10 text-destructive border-destructive/30" :
            "bg-muted text-muted-foreground border-border";
          return (
            <Card key={p.id} className="p-5 hover:shadow-[var(--shadow-glow)] transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><FileSpreadsheet className="size-4" /></div>
                <Badge variant="outline" className={color}>{status}</Badge>
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">DV-2026-{(420 + i).toString().padStart(4, "0")}</div>
              <div className="font-semibold mt-1">{p.firstName} {p.lastName}</div>
              <div className="text-xs text-muted-foreground">3 actes · plan de traitement</div>
              <div className="flex items-baseline justify-between mt-4 pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-lg font-semibold tabular-nums">{total.toLocaleString("fr-FR")} MAD</span>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-2 justify-between">Ouvrir <ArrowRight className="size-4" /></Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
