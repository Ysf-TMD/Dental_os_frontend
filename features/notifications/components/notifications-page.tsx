"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, MessageCircle, Phone, Smartphone, Settings as SettingsIcon } from "lucide-react";
import { notifications } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Email · SMS · WhatsApp · Système</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><SettingsIcon className="size-4" />Modèles & automations</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Email", v: "1 248", i: Mail, c: "bg-primary/10 text-primary" },
          { l: "SMS", v: "624", i: Smartphone, c: "bg-[var(--teal)]/10 text-[var(--teal)]" },
          { l: "WhatsApp", v: "892", i: MessageCircle, c: "bg-success/10 text-success" },
          { l: "Appels", v: "37", i: Phone, c: "bg-accent/10 text-accent" },
        ].map((s) => {
          const Icon = s.i;
          return (
            <Card key={s.l} className="p-4 flex items-center gap-3">
              <div className={`size-10 rounded-lg grid place-items-center ${s.c}`}><Icon className="size-4" /></div>
              <div>
                <div className="text-xs text-muted-foreground uppercase">{s.l}</div>
                <div className="text-lg font-semibold tabular-nums">{s.v}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="divide-y divide-border">
        {notifications.map((n) => (
          <div key={n.id} className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors">
            <div className="size-9 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0"><Bell className="size-4" /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{n.title}</span>
                <Badge variant="outline" className="text-[10px]">{n.channel}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{n.body}</div>
            </div>
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">{n.time}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
