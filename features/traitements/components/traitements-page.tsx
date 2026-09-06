"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import {useDataTable} from "@/lib/hooks/use-data-table";
import type {Patient} from "@/features/patients/types";
import {ENDPOINTS} from "@/lib/api/endpoints";


const types = [
  { name: "Composite occlusal 36", tooth: "36", price: 450, status: "En cours" },
  { name: "Couronne céramique 24", tooth: "24", price: 4800, status: "Planifié" },
  { name: "Extraction 48", tooth: "48", price: 600, status: "Terminé" },
  { name: "Implant 46", tooth: "46", price: 8500, status: "En cours" },
  { name: "Dévitalisation 16", tooth: "16", price: 1800, status: "Planifié" },
  { name: "Détartrage complet", tooth: "—", price: 400, status: "Terminé" },
  { name: "Bridge 24-26", tooth: "24-26", price: 9200, status: "En cours" },
  { name: "Bague orthodontique", tooth: "—", price: 12000, status: "En cours" },
];

const statusStyle: Record<string, string> = {
  "En cours": "bg-primary/10 text-primary border-primary/30",
  "Planifié": "bg-warning/10 text-warning border-warning/30",
  "Terminé": "bg-success/10 text-success border-success/30",
};


export function TraitementsPage() {

  const { data: patients, loading, error, setPage, setPageSize, setSearch, setSort, refresh, meta } = useDataTable<Patient>({
    endpoint: ENDPOINTS.patients,
    initialPageSize: 10,
  });
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Traitements</h1>
          <p className="text-sm text-muted-foreground mt-1">Plans de soins en cours</p>
        </div>
        <Button size="sm" className="gap-2 shadow-[var(--shadow-glow)]" style={{ backgroundImage: "var(--gradient-primary)" }}>
          <Plus className="size-4" />Ajouter un traitement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {types.map((t, i) => {
          const p = patients[i % patients.length];
          return (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p?.firstName} {p?.lastName}</div>
                </div>
                <Badge variant="outline" className={statusStyle[t.status]}>{t.status}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Dent · <span className="font-mono text-foreground">{t.tooth}</span></span>
                <span className="text-base font-semibold text-foreground tabular-nums">{t.price.toLocaleString("fr-FR")} MAD</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
