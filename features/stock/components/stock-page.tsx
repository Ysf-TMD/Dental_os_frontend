"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Plus, Search, Package } from "lucide-react";
import { products } from "@/lib/mock-data";

export function StockPage() {
  const low = products.filter((p) => p.stock < p.min);
  const expiring = products.filter((p) => new Date(p.expires) < new Date(Date.now() + 60 * 86400000));

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stock</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} références · suivi temps réel</p>
        </div>
        <Button size="sm" className="gap-2 shadow-[var(--shadow-glow)]" style={{ backgroundImage: "var(--gradient-primary)" }}>
          <Plus className="size-4" />Nouveau produit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="size-12 rounded-xl grid place-items-center bg-primary/10 text-primary"><Package className="size-5" /></div>
          <div>
            <div className="text-2xl font-semibold tabular-nums">{products.length}</div>
            <div className="text-xs text-muted-foreground">Références</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 border-destructive/30">
          <div className="size-12 rounded-xl grid place-items-center bg-destructive/10 text-destructive"><AlertTriangle className="size-5" /></div>
          <div>
            <div className="text-2xl font-semibold tabular-nums text-destructive">{low.length}</div>
            <div className="text-xs text-muted-foreground">Stocks critiques</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 border-warning/30">
          <div className="size-12 rounded-xl grid place-items-center bg-warning/15 text-warning"><AlertTriangle className="size-5" /></div>
          <div>
            <div className="text-2xl font-semibold tabular-nums text-warning">{expiring.length}</div>
            <div className="text-xs text-muted-foreground">Expirent &lt; 60 jours</div>
          </div>
        </Card>
      </div>

      <Card className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Rechercher un produit, une catégorie, un SKU…" className="pl-9" />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-3">SKU</th>
              <th className="text-left font-medium px-4 py-3">Produit</th>
              <th className="text-left font-medium px-4 py-3">Catégorie</th>
              <th className="text-right font-medium px-4 py-3">Stock</th>
              <th className="text-left font-medium px-4 py-3">Expire</th>
              <th className="text-right font-medium px-4 py-3">Prix</th>
              <th className="text-left font-medium px-4 py-3">Alerte</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const critical = p.stock < p.min;
              return (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-xs"><Badge variant="outline">{p.category}</Badge></td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className={critical ? "text-destructive font-semibold" : ""}>{p.stock}</span>
                    <span className="text-muted-foreground text-xs"> / min {p.min}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.expires}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.price} MAD</td>
                  <td className="px-4 py-3">
                    {critical
                      ? <Badge className="bg-destructive/10 text-destructive border-destructive/30" variant="outline"><AlertTriangle className="size-3 mr-1" />Critique</Badge>
                      : <Badge variant="outline" className="bg-success/10 text-success border-success/30">OK</Badge>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
