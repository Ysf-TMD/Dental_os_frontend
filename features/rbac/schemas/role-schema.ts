import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne doit pas dépasser 100 caractères")
    .regex(/^[a-z0-9_]+$/, "Le nom ne doit contenir que des lettres minuscules, chiffres et underscores"),
  display_name: z
    .string()
    .min(1, "Le nom d'affichage est requis")
    .min(2, "Le nom d'affichage doit contenir au moins 2 caractères")
    .max(100, "Le nom d'affichage ne doit pas dépasser 100 caractères"),
  description: z
    .string()
    .max(500, "La description ne doit pas dépasser 500 caractères")
    .optional(),
  is_active: z.boolean(),
});

export const roleUpdateSchema = z.object({
  name: z
    .string()
    .max(100, "Le nom ne doit pas dépasser 100 caractères")
    .regex(/^[a-z0-9_]+$/, "Le nom ne doit contenir que des lettres minuscules, chiffres et underscores")
    .optional(),
  display_name: z
    .string()
    .min(2, "Le nom d'affichage doit contenir au moins 2 caractères")
    .max(100, "Le nom d'affichage ne doit pas dépasser 100 caractères")
    .optional(),
  description: z
    .string()
    .max(500, "La description ne doit pas dépasser 500 caractères")
    .optional(),
  is_active: z.boolean().optional(),
});

export type RoleInput = z.infer<typeof roleSchema>;
export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>;
