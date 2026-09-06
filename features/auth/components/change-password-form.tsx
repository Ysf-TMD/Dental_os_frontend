"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import { apiService, type ApiError } from "@/lib/api/api-service";
import { ENDPOINTS } from "@/lib/api/endpoints";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/features/auth/schemas/change-password-schema";

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (values: ChangePasswordInput) => {
    setServerError(null);
    try {
      await apiService.post(ENDPOINTS.auth.changePassword, values);
      toast.success("Mot de passe mis à jour avec succès");
      form.reset();
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message ?? "Une erreur est survenue");
    }
  };

  return (
    <Card className="w-full max-w-md p-8 card-bento">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight font-[family-name:var(--font-display)]">
          Changer le mot de passe
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Mettez à jour votre mot de passe de connexion
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe actuel</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
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
                <FormLabel>Nouveau mot de passe</FormLabel>
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
                <FormLabel>Confirmation du nouveau mot de passe</FormLabel>
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
            {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Mettre à jour
          </Button>
        </form>
      </Form>
    </Card>
  );
}
