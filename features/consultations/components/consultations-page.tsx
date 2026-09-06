"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { patients } from "@/lib/mock-data";
import { Plus, Stethoscope } from "lucide-react";

const motifs = ["Contrôle annuel", "Douleur dent 36", "Suite traitement carie", "Saignement gingival", "Contrôle ortho", "Pose couronne", "Détartrage", "Avis implant"];

export function ConsultationsPage() {
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Consultations</h1>
          <p className="text-sm text-muted-foreground mt-1">Historique des consultations cliniques</p>
        </div>
        <Button size="sm" className="gap-2 shadow-[var(--shadow-glow)]" style={{ backgroundImage: "var(--gradient-primary)" }}>
          <Plus className="size-4" />Nouvelle consultation
        </Button>
      </div>

      <Card className="divide-y divide-border">
        {patients.slice(0, 10).map((p, i) => (
          <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
            <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Stethoscope className="size-4" /></div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{p.firstName} {p.lastName}</div>
              <div className="text-xs text-muted-foreground">{motifs[i % motifs.length]} · {["Dr. Amine", "Dr. Salma", "Dr. Karim"][i % 3]}</div>
            </div>
            <Badge variant="outline">{p.lastVisit}</Badge>
            <Badge variant="outline" className={i % 4 === 0 ? "bg-warning/10 text-warning border-warning/30" : "bg-success/10 text-success border-success/30"}>
              {i % 4 === 0 ? "À suivre" : "Clôturée"}
            </Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}
