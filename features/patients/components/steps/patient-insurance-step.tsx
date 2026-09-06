'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { PatientInput } from '../../schemas/patient-schema';

interface PatientInsuranceStepProps {
  data: Partial<PatientInput>;
  onChange: (data: Partial<PatientInput>) => void;
  hasError?: boolean;
  fieldErrors?: Record<string, string>;
}

export function PatientInsuranceStep({ data, onChange, hasError, fieldErrors }: PatientInsuranceStepProps) {
  const insurances = data.insurances || [];

  const addInsurance = () => {
    onChange({
      ...data,
      insurances: [
        ...insurances,
        { type: '', company: '', policy_number: '', expiration_date: '' }
      ]
    });
  };

  const updateInsurance = (index: number, field: string, value: string) => {
    const updated = [...insurances];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, insurances: updated });
  };

  const removeInsurance = (index: number) => {
    const updated = insurances.filter((_, i) => i !== index);
    onChange({ ...data, insurances: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Assurance</h3>
          <Button onClick={addInsurance} size="sm" variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>

        {insurances.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune assurance ajoutée</p>
        ) : (
          <div className="space-y-4">
            {insurances.map((insurance, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">Assurance {index + 1}</span>
                  <Button
                    onClick={() => removeInsurance(index)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Type *</Label>
                    <Input
                      value={insurance.type}
                      onChange={(e) => updateInsurance(index, 'type', e.target.value)}
                      placeholder="Ex: Santé, Dentaire..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Compagnie *</Label>
                    <Input
                      value={insurance.company}
                      onChange={(e) => updateInsurance(index, 'company', e.target.value)}
                      placeholder="Nom de la compagnie"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Numéro de police *</Label>
                    <Input
                      value={insurance.policy_number}
                      onChange={(e) => updateInsurance(index, 'policy_number', e.target.value)}
                      placeholder="Numéro de police"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date d'expiration</Label>
                    <Input
                      type="date"
                      value={insurance.expiration_date || ''}
                      onChange={(e) => updateInsurance(index, 'expiration_date', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
