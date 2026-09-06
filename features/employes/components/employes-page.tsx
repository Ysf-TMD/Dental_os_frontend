"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { employees } from "@/lib/mock-data";
import { Plus, Mail } from "lucide-react";

export function EmployesPage() {
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employés</h1>
          <p className="text-sm text-muted-foreground mt-1">{employees.length} membres · rôles et permissions</p>
        </div>
        <Button size="sm" className="gap-2 shadow-[var(--shadow-glow)]" style={{ backgroundImage: "var(--gradient-primary)" }}>
          <Plus className="size-4" />Inviter un membre
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {employees.map((e) => (
          <Card key={e.id} className="p-5">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarFallback className={`${e.color} text-white font-semibold`}>{e.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-semibold truncate">{e.name}</div>
                <div className="text-xs text-muted-foreground truncate">{e.role}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Mail className="size-3" />{e.email}</div>
            <div className="mt-3 flex gap-1.5 flex-wrap">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Agenda</Badge>
              <Badge variant="outline" className="bg-[var(--teal)]/10 text-[var(--teal)] border-[var(--teal)]/20">Dossiers</Badge>
              {e.role.includes("Comptable") && <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Facturation</Badge>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
