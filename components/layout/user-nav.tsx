"use client";

import { useRouter } from "next/navigation";
import { User, Settings, KeyRound, LogOut, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/context/auth-context";

interface UserNavProps {
  onOpenThemeDrawer?: () => void;
}

export function UserNav({ onOpenThemeDrawer }: UserNavProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full bg-muted/50 hover:bg-muted"
        >
          <User className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium leading-none">{user?.name ?? "Utilisateur"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email ?? ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/parametres")}>
          <Settings className="size-4 mr-2" />
          Paramètres
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/change-password")}>
          <KeyRound className="size-4 mr-2" />
          Changer le mot de passe
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onOpenThemeDrawer}>
          <Palette className="size-4 mr-2" />
          Gestion des couleurs
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
          <LogOut className="size-4 mr-2" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
