"use client";

import { Odontogram } from "./odontogram";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { patients } from "@/lib/mock-data";
import { FileText, History } from "lucide-react";
import {useDataTable} from "@/lib/hooks/use-data-table";
import type {Patient} from "@/features/patients/types";
import {ENDPOINTS} from "@/lib/api/endpoints";

export function OdontogrammePage() {
    const { data: patients, loading, error, setPage, setPageSize, setSearch, setSort, refresh, meta } = useDataTable<Patient>({
        endpoint: ENDPOINTS.patients,
        initialPageSize: 10,
    });
  const p = patients[0];
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Odontogramme</h1>
          <p className="text-sm text-muted-foreground mt-1">Schéma dentaire interactif (FDI 11–48)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><History className="size-4" />Historique</Button>
          <Button size="sm" className="gap-2"><FileText className="size-4" />Plan de traitement</Button>
        </div>
      </div>

      <Card className="p-4 flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">{p?.firstName}{p?.lastName}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="font-semibold">{p?.firstName} {p?.lastName}</div>
          <div className="text-xs text-muted-foreground">{p?.code} · {p?.gender === "M" ? "Homme" : "Femme"} · {new Date().getFullYear() - parseInt(p?.birthDate?.slice(0, 4))} ans · {p?.phone}</div>
        </div>
        <Badge variant="outline" className="bg-success/10 text-success border-success/30">Suivi régulier</Badge>
      </Card>

      <Odontogram />
    </div>
  );
}
