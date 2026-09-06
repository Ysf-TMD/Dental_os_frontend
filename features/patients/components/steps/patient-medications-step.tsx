'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { PatientInput } from '../../schemas/patient-schema';

interface PatientMedicationsStepProps {
  data: Partial<PatientInput>;
  onChange: (data: Partial<PatientInput>) => void;
  hasError?: boolean;
}

export function PatientMedicationsStep({ data, onChange, hasError }: PatientMedicationsStepProps) {
  const medications = data.medications || [];

  const addMedication = () => {
    onChange({
      ...data,
      medications: [
        ...medications,
        { name: '', dose: '', frequency: '' }
      ]
    });
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, medications: updated });
  };

  const removeMedication = (index: number) => {
    const updated = medications.filter((_, i) => i !== index);
    onChange({ ...data, medications: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Médicaments</h3>
          <Button onClick={addMedication} size="sm" variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>

        {medications.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun médicament ajouté</p>
        ) : (
          <div className="space-y-4">
            {medications.map((medication, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">Médicament {index + 1}</span>
                  <Button
                    onClick={() => removeMedication(index)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input
                      value={medication.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      placeholder="Nom du médicament"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dose *</Label>
                    <Input
                      value={medication.dose}
                      onChange={(e) => updateMedication(index, 'dose', e.target.value)}
                      placeholder="Ex: 500mg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fréquence *</Label>
                    <Input
                      value={medication.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      placeholder="Ex: 2x/jour"
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
