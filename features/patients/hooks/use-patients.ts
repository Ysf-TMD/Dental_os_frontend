"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { patientService } from "../services/patient-service";
import type { PatientInput, PatientFilter } from "../schemas/patient-schema";

export const patientKeys = {
  all: ["patients"] as const,
  lists: () => [...patientKeys.all, "list"] as const,
  list: (filters?: PatientFilter) => [...patientKeys.lists(), filters] as const,
  detail: (id: number | string) => [...patientKeys.all, "detail", id] as const,
};

export function usePatients(filters?: PatientFilter) {
  return useQuery({
    queryKey: patientKeys.list(filters),
    queryFn: () => patientService.list(filters),
    staleTime: 60 * 1000,
  });
}

export function usePatient(id: number | string) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientService.get(id),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatientInput) => patientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatientInput }) =>
      patientService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patientService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}
