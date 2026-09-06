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
import { useCreatePayment } from "../../hooks/use-financial";
import type { Payment } from "../../types";
import { Toast } from "@/components/ui/toast";

interface PaymentDialogProps {
  patientId: string;
  onPaymentCreated?: () => void;
}

interface FormErrors {
  amount?: string;
  method?: string;
  paid_at?: string;
}

export function PaymentDialog({ patientId, onPaymentCreated }: PaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    method: "",
    paid_at: new Date().toISOString().split('T')[0],
    reference: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{ show: boolean; message: string; variant: 'success' | 'error' }>({
    show: false,
    message: '',
    variant: 'success'
  });
  const createPayment = useCreatePayment();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Le montant doit être supérieur à 0";
    }

    if (!formData.method) {
      newErrors.method = "La méthode de paiement est requise";
    }

    if (!formData.paid_at) {
      newErrors.paid_at = "La date de paiement est requise";
    } else {
      const paidDate = new Date(formData.paid_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (paidDate > today) {
        newErrors.paid_at = "La date de paiement ne peut pas être dans le futur";
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
    
    const paymentData: Partial<Payment> = {
      patient_id: parseInt(patientId),
      amount: parseFloat(formData.amount),
      method: formData.method as Payment['method'],
      paid_at: formData.paid_at,
      reference: formData.reference,
      status: "completed",
      notes: formData.notes,
    };

    createPayment.mutate(paymentData, {
      onSuccess: () => {
        setToast({ show: true, message: "Paiement enregistré avec succès", variant: "success" });
        setTimeout(() => setToast({ show: false, message: "", variant: "success" }), 3000);
        setOpen(false);
        setFormData({ 
          amount: "", 
          method: "", 
          paid_at: new Date().toISOString().split('T')[0],
          reference: "", 
          notes: "" 
        });
        setErrors({});
        if (onPaymentCreated) {
          onPaymentCreated();
        }
      },
      onError: (error) => {
        console.error("Erreur lors de l'enregistrement du paiement:", error);
        setToast({ show: true, message: "Erreur lors de l'enregistrement du paiement", variant: "error" });
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
            Enregistrer paiement
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement</DialogTitle>
            <DialogDescription>
              Enregistrez un nouveau paiement pour ce patient
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant (MAD) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => {
                      setFormData({ ...formData, amount: e.target.value });
                      if (errors.amount) setErrors({ ...errors, amount: undefined });
                    }}
                    className={errors.amount ? "border-red-500" : ""}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">Méthode de paiement *</Label>
                  <Select
                    value={formData.method}
                    onValueChange={(value) => {
                      setFormData({ ...formData, method: value });
                      if (errors.method) setErrors({ ...errors, method: undefined });
                    }}
                  >
                    <SelectTrigger className={errors.method ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="espèces">Espèces</SelectItem>
                      <SelectItem value="carte">Carte bancaire</SelectItem>
                      <SelectItem value="virement">Virement</SelectItem>
                      <SelectItem value="chèque">Chèque</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.method && (
                    <p className="text-sm text-red-500">{errors.method}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paid_at">Date de paiement *</Label>
                  <Input
                    id="paid_at"
                    type="date"
                    value={formData.paid_at}
                    onChange={(e) => {
                      setFormData({ ...formData, paid_at: e.target.value });
                      if (errors.paid_at) setErrors({ ...errors, paid_at: undefined });
                    }}
                    className={errors.paid_at ? "border-red-500" : ""}
                  />
                  {errors.paid_at && (
                    <p className="text-sm text-red-500">{errors.paid_at}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Référence</Label>
                  <Input
                    id="reference"
                    placeholder="Numéro de reçu..."
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Détails du paiement..."
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
              <Button type="submit" disabled={createPayment.isPending}>
                {createPayment.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
