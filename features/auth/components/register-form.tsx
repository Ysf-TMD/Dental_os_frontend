"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";
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
import {
  registerSchema,
  type RegisterInput,
} from "@/features/auth/schemas/auth-schema";
import type { ApiError } from "@/lib/api/api-service";

export function RegisterForm() {
  const { register } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setServerError(null);
    try {
      await register(values);
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message ?? "Une erreur est survenue");
    }
  };

  return (
    <Card className="w-full max-w-md p-8 card-bento">
      <div className="flex flex-col items-center mb-6">
        <div
          className="size-12 rounded-xl grid place-items-center shadow-[var(--shadow-glow)] mb-3"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <Sparkles className="size-6 text-white" strokeWidth={2.6} />
        </div>
        <h1 className="text-xl font-semibold tracking-tight font-[family-name:var(--font-display)]">
          Créer un compte
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Rejoignez DentalOS dès aujourd&apos;hui
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. Amine Tazi" autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="votre@email.ma" autoComplete="email" {...field} />
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
                  <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
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
            Créer mon compte
          </Button>
        </form>
      </Form>

      <p className="text-sm text-muted-foreground text-center mt-6">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </Card>
  );
}
