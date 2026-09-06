import { z } from "zod";

// Step 1: Identity
export const identitySchema = z.object({
  title: z.enum(["M.", "Mme", "Mlle", "Enfant"]).optional(),
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  first_name_ar: z.string().optional(),
  last_name_ar: z.string().optional(),
  gender: z.enum(["M", "F"], { message: "Le genre est requis" }),
  birth_date: z.string().min(1, "La date de naissance est requise"),
  birth_place: z.string().optional(),
  nationality: z.string().default("Marocain"),
  cin: z.string().optional(),
  passport: z.string().optional(),
  photo: z.string().optional(),
});

// Step 2: Contact
export const contactSchema = z.object({
  phone: z.string().min(1, "Le téléphone est requis").regex(/^\+?[0-9\s-]{9,20}$/, "Numéro de téléphone invalide"),
  phone_secondary: z.string().optional(),
  email: z.string().email("Email invalide").or(z.literal("")).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  postal_code: z.string().optional(),
});

// Step 3: Emergency Contact
export const emergencyContactSchema = z.object({
  emergency_contacts: z.array(z.object({
    name: z.string().min(1, "Le nom est requis"),
    relationship: z.string().min(1, "Le lien de parenté est requis"),
    phone: z.string().min(1, "Le téléphone est requis").regex(/^\+?[0-9\s-]{9,20}$/, "Numéro de téléphone invalide"),
    address: z.string().optional(),
  })).optional(),
});

// Step 4: Medical History
export const medicalHistorySchema = z.object({
  medical_history: z.object({
    diabetes: z.boolean().default(false),
    hypertension: z.boolean().default(false),
    asthma: z.boolean().default(false),
    epilepsy: z.boolean().default(false),
    heart_disease: z.boolean().default(false),
    hepatitis: z.boolean().default(false),
    hiv: z.boolean().default(false),
    pregnancy: z.boolean().default(false),
    cancer: z.boolean().default(false),
    bleeding_disorder: z.boolean().default(false),
    other_conditions: z.string().optional(),
  }).optional(),
});

// Step 5: Allergies
export const allergiesSchema = z.object({
  allergies: z.object({
    penicillin: z.boolean().default(false),
    latex: z.boolean().default(false),
    anesthetics: z.boolean().default(false),
    iodine: z.boolean().default(false),
    other_allergies: z.string().optional(),
  }).optional(),
});

// Step 6: Medications
export const medicationsSchema = z.object({
  medications: z.array(z.object({
    name: z.string().min(1, "Le nom du médicament est requis"),
    dose: z.string().min(1, "La dose est requise"),
    frequency: z.string().min(1, "La fréquence est requise"),
  })).optional(),
});

// Step 7: Habits
export const habitsSchema = z.object({
  habits: z.object({
    smoker: z.boolean().default(false),
    hookah: z.boolean().default(false),
    alcohol: z.boolean().default(false),
    drugs: z.boolean().default(false),
    notes: z.string().optional(),
  }).optional(),
});

// Step 8: Dental Info
export const dentalInfoSchema = z.object({
  blood_group: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]).optional(),
  referring_dentist: z.string().optional(),
  first_visit_date: z.string().optional(),
  consultation_reason: z.string().optional(),
  oral_health_status: z.string().optional(),
});

// Step 9: Insurance
export const insuranceSchema = z.object({
  insurances: z.array(z.object({
    type: z.string().min(1, "Le type d'assurance est requis"),
    company: z.string().min(1, "La compagnie est requise"),
    policy_number: z.string().min(1, "Le numéro de police est requis"),
    expiration_date: z.string().optional(),
  })).optional(),
});

// Step 10: Documents & Consents
export const documentsConsentsSchema = z.object({
  consents: z.object({
    terms_of_use: z.boolean().default(false),
    data_processing: z.boolean().default(false),
    sms_notifications: z.boolean().default(false),
    email_notifications: z.boolean().default(false),
    whatsapp_notifications: z.boolean().default(false),
    cndp_consent: z.boolean().default(false),
  }).optional(),
  notes: z.array(z.object({
    content: z.string().min(1, "Le contenu est requis"),
    is_private: z.boolean().default(false),
  })).optional(),
});

// Complete patient schema (all steps combined)
export const patientSchema = identitySchema
  .merge(contactSchema)
  .merge(emergencyContactSchema)
  .merge(medicalHistorySchema)
  .merge(allergiesSchema)
  .merge(medicationsSchema)
  .merge(habitsSchema)
  .merge(dentalInfoSchema)
  .merge(insuranceSchema)
  .merge(documentsConsentsSchema)
  .extend({
    status: z.enum(["actif", "nouveau", "inactif"]).default("nouveau"),
    balance: z.number().default(0),
    credit_limit: z.number().default(0),
    discount_rate: z.number().default(0),
    preferred_payment_method: z.enum(["Cash", "Card", "Transfer", "Check"]).optional(),
  });

export const patientFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["actif", "nouveau", "inactif"]).optional(),
  page: z.number().int().positive().optional(),
});

export type PatientInput = z.infer<typeof patientSchema>;
export type PatientFilter = z.infer<typeof patientFilterSchema>;
export type IdentityInput = z.infer<typeof identitySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;
export type MedicalHistoryInput = z.infer<typeof medicalHistorySchema>;
export type AllergiesInput = z.infer<typeof allergiesSchema>;
export type MedicationsInput = z.infer<typeof medicationsSchema>;
export type HabitsInput = z.infer<typeof habitsSchema>;
export type DentalInfoInput = z.infer<typeof dentalInfoSchema>;
export type InsuranceInput = z.infer<typeof insuranceSchema>;
export type DocumentsConsentsInput = z.infer<typeof documentsConsentsSchema>;
