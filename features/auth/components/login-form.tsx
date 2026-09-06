"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2, User, Briefcase, Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/lib/context/auth-context";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/auth-schema";
import { apiService, type ApiError } from "@/lib/api/api-service";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const fallbackAccounts = [
  { email: "admin@dentalos.ma", role: "Administrateur", icon: Shield },
  { email: "dentist@dentalos.ma", role: "Dentiste", icon: User },
  { email: "reception@dentalos.ma", role: "Réceptionniste", icon: Briefcase },
];

interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
}

export function LoginForm() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    apiService.get<{ data: Role[] }>(ENDPOINTS.publicRoles)
      .then((response) => {
        setRoles(response.data || []);
      })
      .catch(() => {
        setRoles([]);
      })
      .finally(() => {
        setLoadingRoles(false);
      });
  }, []);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const fillCredentials = (email: string) => {
    form.setValue("email", email);
    form.setValue("password", "password");
  };

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    try {
      await login(values);
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message ?? "Identifiants invalides");
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex justify-start">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center">
        <div
          className="size-16 rounded-2xl grid place-items-center shadow-[var(--shadow-glow)] mb-4"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <Sparkles className="size-8 text-white" strokeWidth={2.6} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-display)] text-foreground">
          Connexion
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Accédez à votre espace DentalOS
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="votre@email.ma" autoComplete="email" className="rounded-lg h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="rounded-lg h-12 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && (
            <p className="text-sm text-destructive text-center">{serverError}</p>
          )}

          <Button
            type="submit"
            className="w-full shadow-[var(--shadow-glow)]"
            style={{ backgroundImage: "var(--gradient-primary)" }}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Se connecter
          </Button>
        </form>
      </Form>

      <div className="mt-6 pt-6 border-t border-border/60">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Comptes de test
        </p>
        <div className="grid grid-cols-3 gap-2">
          {loadingRoles ? (
            <p className="text-sm text-muted-foreground col-span-3">Chargement des rôles...</p>
          ) : roles.length > 0 ? (
            roles.map((role) => {
              const email = `${role.name}@dentalos.ma`;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => fillCredentials(email)}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg text-center transition-colors hover:bg-muted/60 border border-transparent hover:border-border"
                >
                  <div className="size-8 rounded-md bg-primary/10 text-primary grid place-items-center">
                    <User className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{role.display_name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{email}</p>
                  </div>
                </button>
              );
            })
          ) : (
            fallbackAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillCredentials(account.email)}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg text-center transition-colors hover:bg-muted/60 border border-transparent hover:border-border"
                >
                  <div className="size-8 rounded-md bg-primary/10 text-primary grid place-items-center">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{account.role}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{account.email}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center mt-6">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
