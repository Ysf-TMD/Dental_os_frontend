"use client";

import { Card } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const monthly = [
  { m: "Jan", implants: 12, couronnes: 28, ortho: 18 },
  { m: "Fév", implants: 15, couronnes: 31, ortho: 21 },
  { m: "Mar", implants: 18, couronnes: 36, ortho: 24 },
  { m: "Avr", implants: 14, couronnes: 33, ortho: 27 },
  { m: "Mai", implants: 21, couronnes: 39, ortho: 30 },
  { m: "Juin", implants: 25, couronnes: 44, ortho: 33 },
];

export function RapportsPage() {
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Rapports</h1>
          <p className="text-sm text-muted-foreground mt-1">Performance clinique et financière</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download className="size-4" />Export PDF</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="size-4" />Export Excel</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { label: "CA semestriel", value: "1 124 350 MAD", delta: "+18,4 %", color: "text-success" },
          { label: "Nouveaux patients", value: "247", delta: "+12 ce mois", color: "text-primary" },
          { label: "Taux de fidélisation", value: "84,2 %", delta: "+3,1 pt", color: "text-success" },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</div>
            <div className="text-2xl font-semibold mt-1 tabular-nums">{s.value}</div>
            <div className={`text-xs mt-1 ${s.color}`}>{s.delta}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-1">Volume de soins par mois</h3>
        <p className="text-xs text-muted-foreground mb-4">Implants · Couronnes · Orthodontie</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="implants" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="couronnes" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="ortho" fill="var(--color-chart-3)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
