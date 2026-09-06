"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Gift, Star, TrendingUp } from "lucide-react";

export function CrmPage() {
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
        <p className="text-sm text-muted-foreground mt-1">Fidélisation, segments et campagnes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { l: "Patients fidèles", v: "1 246", i: Heart, c: "bg-destructive/10 text-destructive" },
          { l: "Campagnes actives", v: "3", i: MessageSquare, c: "bg-primary/10 text-primary" },
          { l: "Anniversaires (7j)", v: "18", i: Gift, c: "bg-warning/15 text-warning" },
          { l: "NPS", v: "72", i: Star, c: "bg-success/10 text-success" },
        ].map((s) => {
          const Icon = s.i;
          return (
            <Card key={s.l} className="p-5 flex items-center gap-4">
              <div className={`size-12 rounded-xl grid place-items-center ${s.c}`}><Icon className="size-5" /></div>
              <div>
                <div className="text-2xl font-semibold tabular-nums">{s.v}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Segments dynamiques</h3>
          <div className="space-y-2">
            {[
              { name: "VIP — CA > 10 000 MAD/an", count: 84 },
              { name: "Inactifs — pas vus depuis 12 mois", count: 312 },
              { name: "Ortho actifs", count: 67 },
              { name: "Implants posés < 90 jours", count: 41 },
              { name: "Anniversaires ce mois", count: 73 },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <span className="text-sm">{s.name}</span>
                <Badge variant="outline" className="tabular-nums">{s.count}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Campagnes</h3>
          <div className="space-y-3">
            {[
              { name: "Rappel contrôle annuel", channel: "WhatsApp", sent: 248, open: "84 %" },
              { name: "Promo blanchiment été", channel: "Email + SMS", sent: 412, open: "62 %" },
              { name: "Réactivation inactifs", channel: "SMS", sent: 312, open: "31 %" },
            ].map((c) => (
              <div key={c.name} className="p-3 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{c.name}</span>
                  <Badge variant="outline" className="text-xs">{c.channel}</Badge>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{c.sent} envois</span>
                  <span className="flex items-center gap-1 text-success"><TrendingUp className="size-3" />{c.open} ouverture</span>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">+ Nouvelle campagne</Button>
        </Card>
      </div>
    </div>
  );
}
