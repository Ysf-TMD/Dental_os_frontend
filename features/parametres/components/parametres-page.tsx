"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, KeyRound, Bell, CreditCard, Globe, Shield, Palette } from "lucide-react";
import { ColorThemeSelector } from "./color-theme-selector";

export function ParametresPage() {
  const [activeSection, setActiveSection] = useState("cabinet");

  const sections = [
    { id: "cabinet", i: Building2, l: "Cabinet" },
    { id: "security", i: KeyRound, l: "Sécurité & MFA" },
    { id: "roles", i: Shield, l: "Rôles & permissions" },
    { id: "colors", i: Palette, l: "Couleurs" },
    { id: "notifications", i: Bell, l: "Notifications" },
    { id: "billing", i: CreditCard, l: "Facturation SaaS" },
    { id: "language", i: Globe, l: "Langue & devise" },
  ];

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">Configuration du cabinet</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1">
          {sections.map((it) => {
            const Icon = it.i;
            return (
              <button
                key={it.id}
                onClick={() => setActiveSection(it.id)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === it.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="size-4" />
                {it.l}
              </button>
            );
          })}
        </nav>

        <div className="space-y-4">
          {activeSection === "cabinet" && (
            <Card className="p-5">
              <h3 className="font-semibold mb-1">Informations du cabinet</h3>
              <p className="text-xs text-muted-foreground mb-4">Visible sur factures et portail patient</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><Label>Nom du cabinet</Label><Input defaultValue="Cabinet Dentaire Atlas" className="mt-1.5" /></div>
                <div><Label>Téléphone</Label><Input defaultValue="+212 5 37 67 89 00" className="mt-1.5" /></div>
                <div className="md:col-span-2"><Label>Adresse</Label><Input defaultValue="12 avenue Mehdi Ben Barka, Agdal, Rabat" className="mt-1.5" /></div>
                <div><Label>ICE</Label><Input defaultValue="001234567000089" className="mt-1.5" /></div>
                <div><Label>RC</Label><Input defaultValue="124589" className="mt-1.5" /></div>
              </div>
            </Card>
          )}

          {activeSection === "security" && (
            <Card className="p-5">
              <h3 className="font-semibold mb-3">Sécurité</h3>
              <div className="space-y-3">
                {[
                  { l: "Authentification à deux facteurs (TOTP)", d: "Demandé à chaque connexion", on: true },
                  { l: "Verrouillage session après 15 min", d: "Recommandé HDS", on: true },
                  { l: "Journal d'audit complet", d: "Toutes les mutations sont tracées", on: true },
                  { l: "Chiffrement CIN & notes médicales", d: "AES-256 au repos", on: true },
                ].map((r) => (
                  <div key={r.l} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border">
                    <div>
                      <div className="text-sm font-medium">{r.l}</div>
                      <div className="text-xs text-muted-foreground">{r.d}</div>
                    </div>
                    <Switch defaultChecked={r.on} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSection === "colors" && <ColorThemeSelector />}

          {activeSection === "billing" && (
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Plan actuel</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Renouvellement le 12 juillet 2026</p>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Pro</Badge>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-3xl font-semibold tabular-nums">890 <span className="text-base font-normal text-muted-foreground">MAD / mois</span></div>
                  <div className="text-xs text-muted-foreground">jusqu&apos;à 5 praticiens · 2 établissements</div>
                </div>
                <Button variant="outline">Changer de plan</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
