"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users, CalendarCheck, TrendingUp, Wallet, AlertTriangle,
  Clock, ArrowUpRight, Activity, Sparkles, ChevronRight, MoreHorizontal,
} from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";
import { appointments, revenueSeries, treatmentMix } from "@/lib/mock-data";
import { useAuth } from "@/lib/context/auth-context";
import { usePatients } from "@/features/patients/hooks/use-patients";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: patientsData } = usePatients();
  const patients = patientsData?.data || [];
  const today = appointments.filter((a) => a.date === new Date().toISOString().slice(0, 10));
  const list = today.length ? today : appointments.slice(0, 6);

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl surface-hero p-6 md:p-8">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "var(--gradient-mesh)" }} />
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -right-10 bottom-0 size-56 rounded-full bg-accent/25 blur-3xl" />
        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <Badge className="mb-3 bg-white/10 text-white border-white/20 backdrop-blur">
              <span className="size-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
              Système opérationnel · v2.4
            </Badge>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white font-[family-name:var(--font-display)]">
              Bonjour, {user?.name ?? "Docteur"}.
            </h1>
            <p className="text-white/70 text-sm mt-1.5 max-w-lg">
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · Vous avez <span className="text-primary font-semibold">{list.length} rendez-vous</span> et 3 paiements à valider.
            </p>
          </div>
          <div className="hidden sm:flex gap-2 shrink-0">
            <Button size="sm" variant="ghost" className="bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur">
              Rapport quotidien
            </Button>
            <Button size="sm" className="bg-white text-slate-900 hover:bg-white/90 gap-1.5">
              <Sparkles className="size-3.5 text-primary" /> Insights IA
            </Button>
          </div>
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* KPI stack */}
        <Card className="col-span-12 md:col-span-6 xl:col-span-3 p-5 card-bento hover:card-bento-hover">
          <div className="flex items-start justify-between">
            <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <Wallet className="size-5" />
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1 h-6">
              <ArrowUpRight className="size-3" /> 18%
            </Badge>
          </div>
          <div className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">CA du jour</div>
          <div className="text-3xl font-semibold tracking-tight font-[family-name:var(--font-display)] mt-1">
            8 420 <span className="text-base text-muted-foreground font-normal">MAD</span>
          </div>
          <div className="mt-3 h-8 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries.slice(-6)}>
                <Area type="monotone" dataKey="ca" stroke="var(--color-primary)" strokeWidth={1.5} fill="var(--color-primary)" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="col-span-12 md:col-span-6 xl:col-span-3 p-5 card-bento hover:card-bento-hover">
          <div className="flex items-start justify-between">
            <div className="size-10 rounded-xl bg-chart-2/10 text-[color:var(--chart-2)] grid place-items-center">
              <Users className="size-5" />
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1 h-6">
              <ArrowUpRight className="size-3" /> 12.4%
            </Badge>
          </div>
          <div className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Patients actifs</div>
          <div className="text-3xl font-semibold tracking-tight font-[family-name:var(--font-display)] mt-1">2 847</div>
          <div className="text-xs text-muted-foreground mt-1">+42 nouveaux ce mois</div>
        </Card>

        <Card className="col-span-12 md:col-span-6 xl:col-span-3 p-5 card-bento hover:card-bento-hover">
          <div className="flex items-start justify-between">
            <div className="size-10 rounded-xl bg-warning/15 text-warning grid place-items-center">
              <CalendarCheck className="size-5" />
            </div>
            <Badge variant="outline" className="h-6 text-[11px]">3 en attente</Badge>
          </div>
          <div className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">RDV aujourd&apos;hui</div>
          <div className="text-3xl font-semibold tracking-tight font-[family-name:var(--font-display)] mt-1">24</div>
          <div className="flex -space-x-1.5 mt-2">
            {list.slice(0, 5).map((a) => (
              <Avatar key={a.id} className="size-6 ring-2 ring-card">
                <AvatarFallback className="text-[9px] bg-muted">{a.patient.split(" ").map((s) => s[0]).join("").slice(0, 2)}</AvatarFallback>
              </Avatar>
            ))}
            <div className="size-6 rounded-full bg-muted ring-2 ring-card grid place-items-center text-[9px] font-medium">+19</div>
          </div>
        </Card>

        <Card className="col-span-12 md:col-span-6 xl:col-span-3 p-5 card-bento hover:card-bento-hover">
          <div className="flex items-start justify-between">
            <div className="size-10 rounded-xl bg-destructive/10 text-destructive grid place-items-center">
              <AlertTriangle className="size-5" />
            </div>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 h-6">Action requise</Badge>
          </div>
          <div className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Alertes</div>
          <div className="text-3xl font-semibold tracking-tight font-[family-name:var(--font-display)] mt-1">
            5 <span className="text-base text-muted-foreground font-normal">critiques</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Stock · 7 factures en retard</div>
        </Card>

        {/* Revenue big card */}
        <Card className="col-span-12 xl:col-span-8 p-6 card-bento">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold font-[family-name:var(--font-display)] text-lg">Chiffre d&apos;affaires</h3>
                <Badge variant="outline" className="text-success border-success/30 bg-success/5 gap-1 h-5 text-[10px]">
                  <ArrowUpRight className="size-2.5" /> +14.2%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">6 derniers mois · MAD</p>
            </div>
            <div className="flex gap-1 rounded-lg border border-border p-0.5 bg-muted/40">
              {["1M", "3M", "6M", "1A"].map((p, i) => (
                <button
                  key={p}
                  className={[
                    "px-2.5 py-1 text-[11px] rounded-md font-medium transition-colors",
                    i === 2 ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueSeries} margin={{ left: -10, right: 0, top: 5 }}>
              <defs>
                <linearGradient id="ca" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="soins" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12, boxShadow: "var(--shadow-elevated)" }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="ca" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#ca)" name="CA total" />
              <Area type="monotone" dataKey="soins" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#soins)" name="Soins" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Treatment mix */}
        <Card className="col-span-12 xl:col-span-4 p-6 card-bento">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold font-[family-name:var(--font-display)] text-lg">Répartition soins</h3>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </div>
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={treatmentMix} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                  {treatmentMix.map((_, i) => (
                    <Cell key={i} fill={`var(--color-chart-${i + 1})`} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-semibold font-[family-name:var(--font-display)]">{treatmentMix.reduce((s, t) => s + t.value, 0)}%</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Total soins</div>
              </div>
            </div>
          </div>
          <ul className="space-y-1.5 mt-3">
            {treatmentMix.map((t, i) => (
              <li key={t.name} className="flex items-center justify-between text-xs py-1">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: `var(--color-chart-${i + 1})` }} />
                  <span className="text-foreground/80">{t.name}</span>
                </span>
                <span className="font-medium tabular-nums">{t.value}%</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Agenda */}
        <Card className="col-span-12 xl:col-span-8 p-6 card-bento">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold font-[family-name:var(--font-display)] text-lg">Agenda du jour</h3>
              <p className="text-xs text-muted-foreground">{list.length} rendez-vous programmés</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 h-8">
              Voir tout <ChevronRight className="size-3.5" />
            </Button>
          </div>
          <div className="space-y-1.5">
            {list.slice(0, 6).map((a) => (
              <div key={a.id} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 border border-transparent hover:border-border transition-all">
                <div className={`w-1 h-10 rounded-full ${a.color}`} />
                <div className="w-16 text-sm tabular-nums font-semibold font-[family-name:var(--font-display)]">{a.start}</div>
                <Avatar className="size-9">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-primary/15 to-accent/15 text-primary font-semibold">
                    {a.patient.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.patient}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.reason} · {a.practitioner}</div>
                </div>
                <Badge
                  variant="outline"
                  className={[
                    "capitalize shrink-0",
                    a.status === "confirmé" && "bg-success/10 text-success border-success/30",
                    a.status === "en attente" && "bg-warning/10 text-warning border-warning/30",
                    a.status === "annulé" && "bg-destructive/10 text-destructive border-destructive/30",
                  ].filter(Boolean).join(" ")}
                >
                  {a.status}
                </Badge>
                <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </Card>

        {/* Activity feed */}
        <Card className="col-span-12 xl:col-span-4 p-6 card-bento">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold font-[family-name:var(--font-display)] text-lg">Activité récente</h3>
              <p className="text-xs text-muted-foreground">Dernières actions</p>
            </div>
            <span className="size-2 rounded-full bg-primary animate-pulse" />
          </div>
          <ol className="relative border-l border-dashed border-border/70 ml-2 space-y-4">
            {[
              { who: "Nora", what: "a créé un dossier", who2: "Yasmine Benali", time: "il y a 4 min", icon: Users, color: "bg-primary/10 text-primary" },
              { who: "Dr. Salma", what: "a clôturé une consultation", who2: "Karim El Idrissi", time: "il y a 12 min", icon: Activity, color: "bg-chart-2/10 text-[color:var(--chart-2)]" },
              { who: "Système", what: "a envoyé un rappel à", who2: "Mehdi Bennani", time: "il y a 32 min", icon: CalendarCheck, color: "bg-accent/15 text-accent-foreground" },
              { who: "Hamza", what: "a encaissé", who2: "FA-2026-0142 · 1 800 MAD", time: "il y a 1 h", icon: Wallet, color: "bg-success/10 text-success" },
              { who: "Stock", what: "alerte critique", who2: "Composite A2", time: "il y a 2 h", icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
            ].map((e, i) => {
              const Icon = e.icon;
              return (
                <li key={i} className="ml-4 relative">
                  <span className={`absolute -left-[26px] top-0 size-6 rounded-lg ring-4 ring-card grid place-items-center ${e.color}`}>
                    <Icon className="size-3" />
                  </span>
                  <div className="text-xs leading-relaxed">
                    <span className="font-medium">{e.who}</span>{" "}
                    <span className="text-muted-foreground">{e.what}</span>{" "}
                    <span className="font-medium">{e.who2}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground/70 mt-0.5">{e.time}</div>
                </li>
              );
            })}
          </ol>
        </Card>

        {/* Recent patients row */}
        <Card className="col-span-12 p-6 card-bento">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold font-[family-name:var(--font-display)] text-lg">Derniers patients</h3>
              <p className="text-xs text-muted-foreground">{patients.length} patients enregistrés</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1 h-8">
              Tous les patients <ChevronRight className="size-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {patients.slice(0, 10).map((p: any) => (
              <div
                key={p.id}
                className="group p-3 rounded-xl border border-border bg-gradient-to-br from-card to-muted/30 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-10 ring-2 ring-background">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/25 text-primary text-xs font-semibold">
                      {p.first_name?.[0]}{p.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{p.first_name} {p.last_name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{p.code}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-muted-foreground">
                  <Clock className="size-3" /> {p.last_visit || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bottom insight strip */}
        <Card className="col-span-12 md:col-span-6 p-6 card-bento bg-gradient-to-br from-primary/5 via-card to-accent/5">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-primary/15 text-primary grid place-items-center shrink-0">
              <TrendingUp className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-primary uppercase tracking-wider">Insight IA</div>
              <div className="font-semibold mt-1 font-[family-name:var(--font-display)]">
                Vos créneaux du mardi 16h–18h ont un taux d&apos;absence de 18%.
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Activez les rappels automatiques 24h avant pour réduire ce taux à ~6%.
              </p>
              <Button size="sm" variant="outline" className="mt-3 h-7 text-[11px]">Activer les rappels</Button>
            </div>
          </div>
        </Card>

        <Card className="col-span-12 md:col-span-6 p-6 card-bento">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-warning/15 text-warning grid place-items-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-warning uppercase tracking-wider">Paiements en attente</div>
              <div className="text-2xl font-semibold mt-1 font-[family-name:var(--font-display)]">12 480 MAD</div>
              <p className="text-xs text-muted-foreground mt-1">
                7 factures à relancer · dont 2 avec plus de 30 jours de retard.
              </p>
              <Button size="sm" variant="outline" className="mt-3 h-7 text-[11px]">Voir les factures</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
