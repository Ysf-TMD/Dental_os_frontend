import { createCrudService } from "@/lib/api/crud-factory";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Patient } from "../types";
import type { PatientInput } from "../schemas/patient-schema";

export const patientService = createCrudService<Patient, PatientInput, PatientInput>(
  ENDPOINTS.patients
);
