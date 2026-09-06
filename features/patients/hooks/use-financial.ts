import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/api/api-service";
import type { FinancialSummary, FinancialTransaction, Invoice, Payment, PaymentPlan, PaymentPlanInstallment } from "../types";

const FINANCIAL_ENDPOINTS = {
  summary: (patientId: string) => `/patients/${patientId}/financial-summary`,
  transactions: (patientId: string) => `/patients/${patientId}/financial-transactions`,
  invoices: (patientId: string) => `/patients/${patientId}/invoices`,
  payments: (patientId: string) => `/patients/${patientId}/payments`,
  paymentPlans: (patientId: string) => `/patients/${patientId}/payment-plans`,
};

export function useFinancialSummary(patientId: string) {
  return useQuery({
    queryKey: ["financial-summary", patientId],
    queryFn: async () => {
      console.log('Fetching financial summary for patient:', patientId);
      const response = await apiService.get<FinancialSummary>(FINANCIAL_ENDPOINTS.summary(patientId));
      console.log('Financial summary response:', response);
      // Handle both object response and response with data property
      const data = (response as any).data ? (response as any).data : response;
      console.log('Extracted financial summary data:', data);
      return data || {
        total_treatments: 0,
        total_paid: 0,
        balance: 0,
        last_payment: null,
        last_payment_amount: 0,
      };
    },
    enabled: !!patientId,
  });
}

export function useFinancialTransactions(patientId: string, filters?: { start_date?: string; end_date?: string; type?: string }) {
  return useQuery({
    queryKey: ["financial-transactions", patientId, filters],
    queryFn: async () => {
      console.log('Fetching financial transactions', { patientId, filters });
      const params = new URLSearchParams();
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);
      if (filters?.type) params.append('type', filters.type);
      
      const url = params.toString() 
        ? `${FINANCIAL_ENDPOINTS.transactions(patientId)}?${params.toString()}`
        : FINANCIAL_ENDPOINTS.transactions(patientId);
        
      console.log('Request URL:', url);
      const response = await apiService.get<FinancialTransaction[]>(url);
      console.log('Response:', response);
      
      // Handle both array response and object with data property
      const data = Array.isArray(response) ? response : (response as any).data || [];
      console.log('Extracted data:', data);
      
      return data;
    },
    enabled: !!patientId,
  });
}

export function usePatientInvoices(patientId: string) {
  return useQuery({
    queryKey: ["patient-invoices", patientId],
    queryFn: async () => {
      const response = await apiService.get<Invoice[]>(FINANCIAL_ENDPOINTS.invoices(patientId));
      return response.data || [];
    },
    enabled: !!patientId,
  });
}

export function usePatientPayments(patientId: string) {
  return useQuery({
    queryKey: ["patient-payments", patientId],
    queryFn: async () => {
      const response = await apiService.get<Payment[]>(FINANCIAL_ENDPOINTS.payments(patientId));
      return response.data || [];
    },
    enabled: !!patientId,
  });
}

export function usePaymentPlans(patientId: string) {
  return useQuery({
    queryKey: ["payment-plans", patientId],
    queryFn: async () => {
      const response = await apiService.get<PaymentPlan[]>(FINANCIAL_ENDPOINTS.paymentPlans(patientId));
      return response.data || [];
    },
    enabled: !!patientId,
  });
}

export function usePaymentPlanInstallments(paymentPlanId: number) {
  return useQuery({
    queryKey: ["payment-plan-installments", paymentPlanId],
    queryFn: async () => {
      const response = await apiService.get<PaymentPlanInstallment[]>(`/payment-plans/${paymentPlanId}/installments`);
      return response.data || [];
    },
    enabled: !!paymentPlanId,
  });
}

// Mutations
export function useCreateInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Invoice>) => {
      const response = await apiService.post<Invoice>("/invoices", data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      const patientId = variables.patient_id;
      if (patientId) {
        queryClient.invalidateQueries({ queryKey: ["patient-invoices", patientId] });
        queryClient.invalidateQueries({ queryKey: ["financial-summary", patientId] });
        queryClient.invalidateQueries({ queryKey: ["financial-transactions", patientId] });
      }
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Payment>) => {
      const response = await apiService.post<Payment>("/payments", data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      const patientId = variables.patient_id;
      if (patientId) {
        queryClient.invalidateQueries({ queryKey: ["patient-payments", patientId] });
        queryClient.invalidateQueries({ queryKey: ["financial-summary", patientId] });
        queryClient.invalidateQueries({ queryKey: ["financial-transactions", patientId] });
      }
    },
  });
}

export function useCreatePaymentPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<PaymentPlan>) => {
      const response = await apiService.post<PaymentPlan>("/payment-plans", data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payment-plans", variables.patient_id] });
    },
  });
}
