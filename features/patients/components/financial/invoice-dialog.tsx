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
import { Plus } from "lucide-react";
import { useCreateInvoice } from "../../hooks/use-financial";
import type { Invoice } from "../../types";
import { Toast } from "@/components/ui/toast";

interface InvoiceDialogProps {
  patientId: string;
  onInvoiceCreated?: () => void;
}

interface FormErrors {
  total?: string;
  due_date?: string;
}

export function InvoiceDialog({ patientId, onInvoiceCreated }: InvoiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    total: "",
    date: new Date().toISOString().split('T')[0],
    due_date: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{ show: boolean; message: string; variant: 'success' | 'error' }>({
    show: false,
    message: '',
    variant: 'success'
  });
  const createInvoice = useCreateInvoice();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.total || parseFloat(formData.total) <= 0) {
      newErrors.total = "Le montant doit être supérieur à 0";
    }

    if (!formData.due_date) {
      newErrors.due_date = "La date d'échéance est requise";
    } else {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        newErrors.due_date = "La date d'échéance ne peut pas être dans le passé";
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
    
    const invoiceData: Partial<Invoice> = {
      patient_id: parseInt(patientId),
      total: parseFloat(formData.total),
      date: formData.date,
      due_date: formData.due_date,
      paid: 0,
      status: "en attente",
    };

    createInvoice.mutate(invoiceData, {
      onSuccess: () => {
        setToast({ show: true, message: "Facture créée avec succès", variant: "success" });
        setTimeout(() => setToast({ show: false, message: "", variant: "success" }), 3000);
        setOpen(false);
        setFormData({ 
          total: "", 
          date: new Date().toISOString().split('T')[0],
          due_date: "", 
          notes: "" 
        });
        setErrors({});
        if (onInvoiceCreated) {
          onInvoiceCreated();
        }
      },
      onError: (error) => {
        console.error("Erreur lors de la création de la facture:", error);
        setToast({ show: true, message: "Erreur lors de la création de la facture", variant: "error" });
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
          <Button size="sm">
            <Plus className="size-4 mr-2" />
            Nouvelle facture
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle facture</DialogTitle>
            <DialogDescription>
              Créez une nouvelle facture pour ce patient
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date de facture *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total">Montant total (MAD) *</Label>
                  <Input
                    id="total"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.total}
                    onChange={(e) => {
                      setFormData({ ...formData, total: e.target.value });
                      if (errors.total) setErrors({ ...errors, total: undefined });
                    }}
                    className={errors.total ? "border-red-500" : ""}
                  />
                  {errors.total && (
                    <p className="text-sm text-red-500">{errors.total}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Date d'échéance *</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => {
                    setFormData({ ...formData, due_date: e.target.value });
                    if (errors.due_date) setErrors({ ...errors, due_date: undefined });
                  }}
                  className={errors.due_date ? "border-red-500" : ""}
                />
                {errors.due_date && (
                  <p className="text-sm text-red-500">{errors.due_date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Description des services..."
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
              <Button type="submit" disabled={createInvoice.isPending}>
                {createInvoice.isPending ? "Création..." : "Créer la facture"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
