"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Calendar, Activity, Stethoscope, ClipboardList,
  FileText, CreditCard, FileSpreadsheet, FlaskConical, Package, UserCog,
  BarChart3, Heart, Bell, Settings, Sparkles, Sun, Moon,
  ChevronDown, LogOut, Shield, Key, Layout, Menu,
} from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/auth-context";
import { useTheme } from "@/lib/context/theme-context";
import { UserNav } from "@/components/layout/user-nav";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { DynamicNavigation } from "@/components/navigation/dynamic-navigation";
import { ColorThemeSelector } from "@/features/parametres/components/color-theme-selector";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="h-screen flex bg-background overflow-hidden" style={{ backgroundImage: "var(--gradient-mesh)" }}>
      {/* Desktop Sidebar */}
      <aside className="w-[260px] shrink-0 hidden lg:flex flex-col bg-sidebar text-sidebar-foreground">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-sidebar-border">
          <div
            className="size-10 rounded-xl grid place-items-center shadow-[var(--shadow-glow)] relative overflow-hidden"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <Sparkles className="size-5 text-sidebar" strokeWidth={2.6} />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-sidebar-foreground font-[family-name:var(--font-display)]">DentalOS</div>
            <div className="text-[11px] text-sidebar-foreground/55 -mt-0.5">Cabinet Atlas · Agdal</div>
          </div>
        </div>



        <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          <DynamicNavigation />
        </nav>


        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-sidebar-accent/60 transition-colors">
            <Avatar className="size-9 ring-2 ring-primary/30">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-sidebar text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-sidebar-foreground truncate">{user?.name ?? "Utilisateur"}</div>
              <div className="text-[11px] text-sidebar-foreground/50 truncate">{user?.role ?? user?.email ?? ""}</div>
            </div>
            <button
              onClick={() => logout()}
              title="Se déconnecter"
              className="text-sidebar-foreground/50 hover:text-destructive transition-colors"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar with Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[280px] p-0 bg-sidebar text-sidebar-foreground">
          <div className="h-16 flex items-center gap-3 px-5 border-b border-sidebar-border">
            <div
              className="size-10 rounded-xl grid place-items-center shadow-[var(--shadow-glow)] relative overflow-hidden"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              <Sparkles className="size-5 text-sidebar" strokeWidth={2.6} />
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight text-sidebar-foreground font-[family-name:var(--font-display)]">DentalOS</div>
              <div className="text-[11px] text-sidebar-foreground/55 -mt-0.5">Cabinet Atlas · Agdal</div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
            <DynamicNavigation />
          </nav>

          <div className="p-3 border-t border-sidebar-border">
            <div className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-sidebar-accent/60 transition-colors">
              <Avatar className="size-9 ring-2 ring-primary/30">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-sidebar text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-sidebar-foreground truncate">{user?.name ?? "Utilisateur"}</div>
                <div className="text-[11px] text-sidebar-foreground/50 truncate">{user?.role ?? user?.email ?? ""}</div>
              </div>
              <button
                onClick={() => logout()}
                title="Se déconnecter"
                className="text-sidebar-foreground/50 hover:text-destructive transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 shrink-0 glass-panel border-b border-border/60 flex items-center gap-3 px-5">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost" className="relative h-9 w-9 p-0">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary animate-pulse-ring" />
            </Button>
            <div className="h-6 w-px bg-border" />
            <Button
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0"
              onClick={toggleTheme}
              title={theme === "light" ? "Mode sombre" : "Mode clair"}
            >
              {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>
            <div className="h-6 w-px bg-border" />
            <UserNav onOpenThemeDrawer={() => setThemeDrawerOpen(true)} />
          </div>
        </header>

        <main className="flex-1 min-h-0 p-6 lg:p-8 animate-fade-in overflow-y-auto custom-scrollbar">
          <div className="shrink-0">
            <BreadcrumbNav />
          </div>
          <div className="min-h-0">
            {children}
          </div>
        </main>
      </div>

      {/* Theme Color Drawer */}
      <Sheet open={themeDrawerOpen} onOpenChange={setThemeDrawerOpen}>
        <SheetContent side="right" className="w-[400px] p-0">
          <div className="px-6 py-6">
            <ColorThemeSelector />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
