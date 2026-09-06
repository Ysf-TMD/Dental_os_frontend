"use client";

import { Fragment, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react";
import { appointments } from "@/lib/mock-data";

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const hours = Array.from({ length: 10 }, (_, i) => 8 + i); // 08..17

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // monday=0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function AgendaPage() {
  const [cursor, setCursor] = useState(() => startOfWeek(new Date()));
  const [view, setView] = useState<"jour" | "semaine" | "mois">("semaine");

  const weekDates = days.map((_, i) => {
    const d = new Date(cursor); d.setDate(d.getDate() + i); return d;
  });

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>
          <p className="text-sm text-muted-foreground mt-1">3 praticiens · cabinet Agdal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Filter className="size-4" />Praticiens</Button>
          <Button size="sm" className="gap-2 shadow-[var(--shadow-glow)]" style={{ backgroundImage: "var(--gradient-primary)" }}>
            <Plus className="size-4" />Nouveau RDV
          </Button>
        </div>
      </div>

      <Card className="p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => { const d = new Date(cursor); d.setDate(d.getDate() - 7); setCursor(d); }}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCursor(startOfWeek(new Date()))}>Aujourd&apos;hui</Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => { const d = new Date(cursor); d.setDate(d.getDate() + 7); setCursor(d); }}>
            <ChevronRight className="size-4" />
          </Button>
          <div className="ml-3 text-sm font-medium">
            {weekDates[0].toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} – {weekDates[5].toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        <div className="flex gap-1 bg-muted p-1 rounded-md">
          {(["jour", "semaine", "mois"] as const).map((v) => (
            <button key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition-all ${view === v ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {v}
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[64px_repeat(6,1fr)] border-b border-border bg-muted/30 text-xs">
          <div />
          {weekDates.map((d, i) => {
            const isToday = d.toDateString() === new Date().toDateString();
            return (
              <div key={i} className={`p-3 text-center border-l border-border ${isToday ? "bg-primary/5" : ""}`}>
                <div className="text-muted-foreground uppercase tracking-wide text-[10px]">{days[i]}</div>
                <div className={`text-base font-semibold mt-0.5 ${isToday ? "text-primary" : ""}`}>{d.getDate()}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-[64px_repeat(6,1fr)] relative">
          {hours.map((h) => (
            <Fragment key={h}>
              <div className="border-t border-border h-16 text-[11px] text-muted-foreground p-2 tabular-nums">{h}:00</div>
              {days.map((_, di) => (
                <div key={`c-${h}-${di}`} className="border-t border-l border-border h-16 relative hover:bg-muted/30 transition-colors" />
              ))}
            </Fragment>
          ))}

          {/* Render appointments */}
          {appointments.slice(0, 14).map((a, i) => {
            const dayCol = (i % 6) + 1;
            const hour = parseInt(a.start.split(":")[0]);
            const min = parseInt(a.start.split(":")[1]);
            const top = (hour - 8) * 64 + (min / 60) * 64;
            return (
              <div
                key={a.id}
                className="absolute rounded-md p-2 shadow-sm cursor-pointer hover:shadow-[var(--shadow-glow)] transition-all overflow-hidden text-white"
                style={{
                  top: `${top}px`,
                  height: "56px",
                  left: `calc(64px + (100% - 64px) * ${(dayCol - 1) / 6} + 4px)`,
                  width: `calc((100% - 64px) / 6 - 8px)`,
                  background:
                    a.color.includes("primary") ? "linear-gradient(135deg, oklch(0.62 0.22 264), oklch(0.55 0.22 264))" :
                    a.color.includes("teal") ? "linear-gradient(135deg, oklch(0.74 0.13 184), oklch(0.65 0.13 184))" :
                    a.color.includes("accent") ? "linear-gradient(135deg, oklch(0.74 0.15 230), oklch(0.65 0.15 230))" :
                    "linear-gradient(135deg, oklch(0.82 0.16 70), oklch(0.72 0.16 70))",
                }}
              >
                <div className="text-[10px] font-semibold opacity-90">{a.start}</div>
                <div className="text-[11px] font-medium truncate">{a.patient}</div>
                <div className="text-[10px] opacity-90 truncate">{a.reason}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-primary" />Dr. Amine</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-[var(--teal)]" />Dr. Salma</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-accent" />Dr. Karim</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-warning" />Disponibilité</span>
      </div>
    </div>
  );
}
