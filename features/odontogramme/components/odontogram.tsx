"use client";

import { useState } from "react";

const upper = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lower = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const statuses = [
  { key: "saine", label: "Saine", color: "fill-white stroke-border" },
  { key: "carie", label: "Carie", color: "fill-warning stroke-warning" },
  { key: "extraction", label: "Extraction", color: "fill-destructive stroke-destructive" },
  { key: "implant", label: "Implant", color: "fill-primary stroke-primary" },
  { key: "couronne", label: "Couronne", color: "fill-[var(--teal)] stroke-[var(--teal)]" },
  { key: "devital", label: "Dévitalisation", color: "fill-accent stroke-accent" },
  { key: "bridge", label: "Bridge", color: "fill-purple-400 stroke-purple-500" },
  { key: "ortho", label: "Orthodontie", color: "fill-pink-400 stroke-pink-500" },
] as const;

type StatusKey = (typeof statuses)[number]["key"];

export function Odontogram() {
  const [teeth, setTeeth] = useState<Record<number, StatusKey>>({
    16: "carie", 26: "couronne", 36: "extraction", 11: "devital", 46: "implant", 24: "bridge",
  });
  const [selected, setSelected] = useState<number | null>(16);
  const [tool, setTool] = useState<StatusKey>("carie");

  const applyTool = (code: number) => {
    setSelected(code);
    setTeeth((prev) => ({ ...prev, [code]: tool }));
  };

  const Tooth = ({ code }: { code: number }) => {
    const status = teeth[code];
    const conf = statuses.find((s) => s.key === status);
    const isSelected = selected === code;
    return (
      <button
        onClick={() => applyTool(code)}
        className="group flex flex-col items-center gap-1 transition-transform hover:-translate-y-0.5"
      >
        <span className={["text-[10px] font-medium tabular-nums", isSelected ? "text-primary" : "text-muted-foreground"].join(" ")}>{code}</span>
        <svg viewBox="0 0 40 50" className={["w-7 h-9 transition-all", isSelected ? "drop-shadow-[0_2px_6px_color-mix(in_oklab,var(--primary)_45%,transparent)]" : ""].join(" ")}>
          <path
            d="M8 8 C8 2 32 2 32 8 L34 28 C34 38 28 48 20 48 C12 48 6 38 6 28 Z"
            className={[conf ? conf.color : "fill-white stroke-border", "stroke-[1.5] transition-colors"].join(" ")}
          />
          <path d="M14 18 L26 18 M14 26 L26 26" className="stroke-border/60 stroke-1 fill-none" />
        </svg>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl card-soft">
        <span className="text-xs font-medium text-muted-foreground mr-2 pl-1">Outil :</span>
        {statuses.map((s) => (
          <button
            key={s.key}
            onClick={() => setTool(s.key)}
            className={[
              "px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all flex items-center gap-1.5",
              tool === s.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:bg-muted",
            ].join(" ")}
          >
            <span className={["size-3 rounded-sm border", s.color].join(" ")} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Teeth */}
      <div className="p-6 rounded-2xl card-soft space-y-6">
        <div className="flex justify-center gap-1.5 flex-wrap">
          {upper.map((c) => <Tooth key={c} code={c} />)}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex justify-center gap-1.5 flex-wrap">
          {lower.map((c) => <Tooth key={c} code={c} />)}
        </div>
      </div>

      {/* Selected detail */}
      {selected && (
        <div className="p-5 rounded-xl card-soft">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-2xl font-semibold tabular-nums">{selected}</span>
            <span className="text-sm text-muted-foreground">
              Dent {selected < 30 ? "supérieure" : "inférieure"} {selected % 10 <= 3 ? "antérieure" : "postérieure"}
            </span>
            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {statuses.find((s) => s.key === teeth[selected])?.label ?? "Saine"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Cliquez sur une surface ou choisissez un statut dans la barre d&apos;outils pour mettre à jour cette dent. Les modifications sont versionnées et tracées dans le journal patient.
          </p>
        </div>
      )}
    </div>
  );
}
