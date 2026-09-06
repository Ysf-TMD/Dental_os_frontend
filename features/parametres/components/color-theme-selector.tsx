"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette, Check, Sparkles, Droplets, Brush, RotateCcw, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/context/theme-context";

const colorThemes = [
  { id: "default", name: "Indigo", color: "#6366f1", gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" },
  { id: "blue", name: "Bleu", color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" },
  { id: "green", name: "Vert", color: "#10b981", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
  { id: "orange", name: "Orange", color: "#f97316", gradient: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)" },
  { id: "pink", name: "Rose", color: "#ec4899", gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" },
  { id: "purple", name: "Violet", color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" },
];

const quickColors = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899",
];

export function ColorThemeSelector() {
  const { colorTheme, setColorTheme, customColor, setCustomColor, theme, toggleTheme } = useTheme();

  const currentGradient = colorTheme === "custom"
    ? customColor
    : colorThemes.find(t => t.id === colorTheme)?.gradient || colorThemes[0].gradient;

  const handleReset = () => {
    setColorTheme("default");
    setCustomColor("#6366f1");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Palette className="size-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Thème de couleur</h3>
          <p className="text-xs text-muted-foreground">Personnalisez l'apparence de l'application</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 text-xs"
        >
          <RotateCcw className="size-3 mr-1" />
          Réinitialiser
        </Button>
      </div>

      {/* Light/Dark Mode Toggle */}
      <div className="p-3 rounded-xl border border-border">
        <Label className="text-sm font-medium mb-2 flex items-center gap-2">
          Mode d'affichage
        </Label>
        <div className="flex gap-2">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleTheme()}
            className="flex-1 gap-2"
          >
            <Sun className="size-4" />
            Clair
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleTheme()}
            className="flex-1 gap-2"
          >
            <Moon className="size-4" />
            Sombre
          </Button>
        </div>
      </div>

      {/* Preset Themes */}
      <div>
        <Label className="text-sm font-medium mb-2 flex items-center gap-2">
          <Brush className="size-4" />
          Thèmes prédéfinis
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {colorThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setColorTheme(theme.id as any)}
              className={`relative group p-2 rounded-lg border-2 transition-all duration-200 ${
                colorTheme === theme.id
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              }`}
            >
              <div
                className="w-full h-10 rounded-md mb-1.5 shadow-sm transition-transform group-hover:scale-105"
                style={{ background: theme.gradient }}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{theme.name}</span>
                {colorTheme === theme.id && (
                  <div className="size-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="size-2.5 text-primary-foreground" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color */}
      <div className="pt-3 border-t border-border">
        <Label className="text-sm font-medium mb-2 flex items-center gap-2">
          <Droplets className="size-4" />
          Couleur personnalisée
        </Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors">
            <div className="relative">
              <Input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setColorTheme("custom");
                }}
                className="size-12 p-1 cursor-pointer rounded-md border-2"
                style={{ borderColor: customColor }}
              />
              <div className="absolute -top-1 -right-1 size-4 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="size-2.5 text-primary-foreground" />
              </div>
            </div>
            <div className="flex-1 space-y-0.5">
              <Input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setColorTheme("custom");
                }}
                className="font-mono text-xs h-8"
                placeholder="#6366f1"
              />
            </div>
          </div>

          {/* Quick Color Swatches */}
          <div className="flex flex-wrap gap-1.5">
            {quickColors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setCustomColor(color);
                  setColorTheme("custom");
                }}
                className={`size-7 rounded-md border-2 transition-all hover:scale-110 ${
                  colorTheme === "custom" && customColor === color
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/50"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="pt-3 border-t border-border">
        <Label className="text-sm font-medium mb-2 block">Aperçu en direct</Label>
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2">
              <div
                className="size-10 rounded-md shadow-sm"
                style={{ background: currentGradient }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {colorTheme === "custom" ? "Couleur personnalisée" : colorThemes.find(t => t.id === colorTheme)?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {colorTheme === "custom" ? customColor : colorThemes.find(t => t.id === colorTheme)?.color}
                </p>
              </div>
            </div>
          </div>

          {/* UI Element Preview */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-1.5">
            <div
              className="h-7 rounded-md flex items-center justify-center text-white text-xs font-medium shadow-sm"
              style={{ background: currentGradient }}
            >
              Bouton principal
            </div>
            <div className="flex gap-1.5">
              <div
                className="flex-1 h-5 rounded flex items-center justify-center text-white text-xs"
                style={{ background: currentGradient }}
              >
                Badge
              </div>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                style={{ background: currentGradient }}
              >
                <Check className="size-2.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
