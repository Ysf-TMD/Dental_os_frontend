"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useCreatePaymentPlan } from "../../hooks/use-financial";
import type { PaymentPlan } from "../../types";
import { Toast } from "@/components/ui/toast";

interface PaymentPlanDialogProps {
  patientId: string;
  onPlanCreated?: () => void;
}

interface FormErrors {
  total_amount?: string;
  number_of_installments?: string;
  start_date?: string;
  down_payment?: string;
}

export function PaymentPlanDialog({ patientId, onPlanCreated }: PaymentPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    total_amount: "",
    down_payment: "",
    number_of_installments: "",
    frequency: "monthly",
    start_date: new Date().toISOString().split('T')[0],
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{ show: boolean; message: string; variant: 'success' | 'error' }>({
    show: false,
    message: '',
    variant: 'success'
  });
  const createPaymentPlan = useCreatePaymentPlan();

  const installmentAmount = formData.total_amount && formData.number_of_installments
    ? (parseFloat(formData.total_amount) - (parseFloat(formData.down_payment) || 0)) / parseInt(formData.number_of_installments)
    : 0;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.total_amount || parseFloat(formData.total_amount) <= 0) {
      newErrors.total_amount = "Le montant total doit être supérieur à 0";
    }

    if (formData.down_payment && parseFloat(formData.down_payment) < 0) {
      newErrors.down_payment = "L'acompte ne peut pas être négatif";
    }

    if (formData.down_payment && formData.total_amount && parseFloat(formData.down_payment) >= parseFloat(formData.total_amount)) {
      newErrors.down_payment = "L'acompte doit être inférieur au montant total";
    }

    if (!formData.number_of_installments || parseInt(formData.number_of_installments) < 1) {
      newErrors.number_of_installments = "Le nombre d'échéances doit être au moins 1";
    }

    if (formData.number_of_installments && parseInt(formData.number_of_installments) > 36) {
      newErrors.number_of_installments = "Le nombre d'échéances ne peut pas dépasser 36";
    }

    if (!formData.start_date) {
      newErrors.start_date = "La date de début est requise";
    } else {
      const startDate = new Date(formData.start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.start_date = "La date de début ne peut pas être dans le passé";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const paymentPlanData: Partial<PaymentPlan> = {
      patient_id: parseInt(patientId),
      total_amount: parseFloat(formData.total_amount),
      down_payment: parseFloat(formData.down_payment) || 0,
      installment_amount: installmentAmount,
      number_of_installments: parseInt(formData.number_of_installments),
      frequency: formData.frequency as PaymentPlan['frequency'],
      start_date: formData.start_date,
      status: "active",
      notes: formData.notes,
    };

    createPaymentPlan.mutate(paymentPlanData, {
      onSuccess: () => {
        setToast({ show: true, message: "Plan de paiement créé avec succès", variant: "success" });
        setTimeout(() => setToast({ show: false, message: "", variant: "success" }), 3000);
        setOpen(false);
        setFormData({ 
          total_amount: "", 
          down_payment: "", 
          number_of_installments: "",
          frequency: "monthly",
          start_date: new Date().toISOString().split('T')[0],
          notes: "" 
        });
        setErrors({});
        if (onPlanCreated) {
          onPlanCreated();
        }
      },
      onError: (error) => {
        console.error("Erreur lors de la création du plan de paiement:", error);
        setToast({ show: true, message: "Erreur lors de la création du plan de paiement", variant: "error" });
        setTimeout(() => setToast({ show: false, message: "", variant: "error" }), 3000);
      },
    });
  };

  return (
    <>
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            title={toast.variant === 'success' ? 'Succès' : 'Erreur'}
            description={toast.message}
            variant={toast.variant}
            onClose={() => setToast({ show: false, message: '', variant: 'success' })}
          />
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Plus className="size-4 mr-2" />
            Plan de paiement
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Créer un plan de paiement</DialogTitle>
            <DialogDescription>
              Configurez un plan de paiement échelonné pour ce patient
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_amount">Montant total (MAD) *</Label>
                  <Input
                    id="total_amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.total_amount}
                    onChange={(e) => {
                      setFormData({ ...formData, total_amount: e.target.value });
                      if (errors.total_amount) setErrors({ ...errors, total_amount: undefined });
                    }}
                    className={errors.total_amount ? "border-red-500" : ""}
                  />
                  {errors.total_amount && (
                    <p className="text-sm text-red-500">{errors.total_amount}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="down_payment">Acompte (MAD)</Label>
                  <Input
                    id="down_payment"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.down_payment}
                    onChange={(e) => {
                      setFormData({ ...formData, down_payment: e.target.value });
                      if (errors.down_payment) setErrors({ ...errors, down_payment: undefined });
                    }}
                    className={errors.down_payment ? "border-red-500" : ""}
                  />
                  {errors.down_payment && (
                    <p className="text-sm text-red-500">{errors.down_payment}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number_of_installments">Nombre d'échéances *</Label>
                  <Input
                    id="number_of_installments"
                    type="number"
                    min="1"
                    max="36"
                    placeholder="12"
                    value={formData.number_of_installments}
                    onChange={(e) => {
                      setFormData({ ...formData, number_of_installments: e.target.value });
                      if (errors.number_of_installments) setErrors({ ...errors, number_of_installments: undefined });
                    }}
                    className={errors.number_of_installments ? "border-red-500" : ""}
                  />
                  {errors.number_of_installments && (
                    <p className="text-sm text-red-500">{errors.number_of_installments}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Fréquence</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="biweekly">Bimensuel</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="quarterly">Trimestriel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Date de début *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => {
                      setFormData({ ...formData, start_date: e.target.value });
                      if (errors.start_date) setErrors({ ...errors, start_date: undefined });
                    }}
                    className={errors.start_date ? "border-red-500" : ""}
                  />
                  {errors.start_date && (
                    <p className="text-sm text-red-500">{errors.start_date}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Montant par échéance</Label>
                  <div className="p-2 bg-muted rounded-md font-medium">
                    {installmentAmount.toFixed(2)} MAD
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Détails du plan de paiement..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setOpen(false);
                setErrors({});
              }}>
                Annuler
              </Button>
              <Button type="submit" disabled={createPaymentPlan.isPending}>
                {createPaymentPlan.isPending ? "Création..." : "Créer le plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
