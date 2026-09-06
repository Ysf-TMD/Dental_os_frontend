import type { PatientInput } from "../schemas/patient-schema";

export type Patient = PatientInput & {
  id: number;
  code: string;
  last_visit: string | null;
  cached_balance: number;
  balance_updated_at: string | null;
  created_at: string;
  updated_at: string;
};

export interface FinancialSummary {
  total_treatments: number;
  total_paid: number;
  balance: number;
  last_payment: string | null;
  last_payment_amount: number;
}

export interface FinancialTransaction {
  id: number;
  patient_id: number;
  type: 'invoice' | 'payment' | 'refund' | 'adjustment';
  amount: number;
  reference: string | null;
  description: string | null;
  related_id: number | null;
  related_type: string | null;
  created_at: string;
}

export interface Invoice {
  id: number;
  number: string;
  patient_id: number;
  treatment_plan_id: number | null;
  date: string;
  due_date: string;
  total: number;
  paid: number;
  status: 'payée' | 'partielle' | 'en attente' | 'en retard';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  invoice_id: number | null;
  patient_id: number | null;
  amount: number;
  method: 'espèces' | 'carte' | 'virement' | 'chèque';
  paid_at: string;
  reference: string | null;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  notes: string | null;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentPlan {
  id: number;
  patient_id: number;
  total_amount: number;
  down_payment: number;
  installment_amount: number;
  number_of_installments: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  start_date: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  notes: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentPlanInstallment {
  id: number;
  payment_plan_id: number;
  installment_number: number;
  due_date: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paid_date: string | null;
  payment_id: number | null;
  created_at: string;
  updated_at: string;
}
