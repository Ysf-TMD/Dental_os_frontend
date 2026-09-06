"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ColorTheme = "default" | "blue" | "orange" | "custom";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("default");
  const [customColor, setCustomColor] = useState("#6366f1");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage and system preference
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    } else {
      // Check system preference
      const systemPrefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(systemPrefers ? "dark" : "light");
    }

    const storedColor = localStorage.getItem("colorTheme") as ColorTheme | null;
    if (storedColor) {
      setColorTheme(storedColor);
    }

    const storedCustomColor = localStorage.getItem("customColor");
    if (storedCustomColor) {
      setCustomColor(storedCustomColor);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.style.removeProperty("--primary");
    root.style.removeProperty("--primary-foreground");
    root.style.removeProperty("--gradient-primary");
    root.style.removeProperty("--sidebar-primary");
    root.style.removeProperty("--sidebar-primary-foreground");

    if (colorTheme === "blue") {
      const primary = "hsl(221 83% 53%)";
      root.style.setProperty("--primary", primary);
      root.style.setProperty("--primary-foreground", "hsl(210 40% 98%)");
      root.style.setProperty("--gradient-primary", "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)");
      root.style.setProperty("--sidebar-primary", primary);
      root.style.setProperty("--sidebar-primary-foreground", "hsl(210 40% 98%)");
    } else if (colorTheme === "orange") {
      const primary = "hsl(25 95% 53%)";
      root.style.setProperty("--primary", primary);
      root.style.setProperty("--primary-foreground", "hsl(60 9.1% 97.4%)");
      root.style.setProperty("--gradient-primary", "linear-gradient(135deg, #f97316 0%, #c2410c 100%)");
      root.style.setProperty("--sidebar-primary", primary);
      root.style.setProperty("--sidebar-primary-foreground", "hsl(60 9.1% 97.4%)");
    } else if (colorTheme === "custom") {
      root.style.setProperty("--primary", customColor);
      root.style.setProperty("--primary-foreground", "hsl(60 9.1% 97.4%)");
      root.style.setProperty("--gradient-primary", `linear-gradient(135deg, ${customColor} 0%, ${customColor} 100%)`);
      root.style.setProperty("--sidebar-primary", customColor);
      root.style.setProperty("--sidebar-primary-foreground", "hsl(60 9.1% 97.4%)");
    }

    localStorage.setItem("colorTheme", colorTheme);
  }, [colorTheme, customColor, mounted]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Prevent flash of incorrect theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, colorTheme, setColorTheme, customColor, setCustomColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
