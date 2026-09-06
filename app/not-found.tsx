import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" style={{ backgroundImage: "var(--gradient-mesh)" }}>
      <Card className="w-full max-w-md p-8 text-center card-bento">
        <div className="space-y-6">
          {/* 404 Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div
              className="absolute inset-0 rounded-xl grid place-items-center shadow-[var(--shadow-glow)]"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              <span className="text-4xl font-bold text-white">404</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-display)]">
              Page non trouvée
            </h1>
            <p className="text-sm text-muted-foreground">
              Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <Home className="size-4" />
                Accueil
              </Link>
            </Button>
            <Button asChild className="gap-2 shadow-[var(--shadow-glow)]" style={{ backgroundImage: "var(--gradient-primary)" }}>
              <Link href="/dashboard">
                <ArrowLeft className="size-4" />
                Retour au dashboard
              </Link>
            </Button>
          </div>

          {/* Help text */}
          <div className="pt-4 border-t border-border/60">
            <p className="text-xs text-muted-foreground">
              Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support technique.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
