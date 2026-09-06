'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import type { PatientInput } from '../../schemas/patient-schema';

interface PatientAllergiesStepProps {
  data: Partial<PatientInput>;
  onChange: (data: Partial<PatientInput>) => void;
  hasError?: boolean;
}

export function PatientAllergiesStep({ data, onChange, hasError }: PatientAllergiesStepProps) {
  const allergies = data.allergies || {
    penicillin: false,
    latex: false,
    anesthetics: false,
    iodine: false,
    other_allergies: '',
  };

  const toggleAllergy = (allergy: string) => {
    onChange({
      ...data,
      allergies: {
        ...allergies,
        [allergy]: !allergies[allergy as keyof typeof allergies]
      }
    });
  };

  const allergyList = [
    { key: 'penicillin', label: 'Pénicilline' },
    { key: 'latex', label: 'Latex' },
    { key: 'anesthetics', label: 'Anesthésiques' },
    { key: 'iodine', label: 'Iode' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Allergies</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {allergyList.map((allergy) => (
            <div key={allergy.key} className="flex items-center space-x-2">
              <Checkbox
                id={allergy.key}
                checked={Boolean(allergies[allergy.key as keyof typeof allergies])}
                onCheckedChange={() => toggleAllergy(allergy.key)}
              />
              <Label htmlFor={allergy.key} className="cursor-pointer">
                {allergy.label}
              </Label>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="other_allergies">Autres allergies</Label>
          <Textarea
            id="other_allergies"
            value={allergies.other_allergies}
            onChange={(e) => onChange({
              ...data,
              allergies: { ...allergies, other_allergies: e.target.value }
            })}
            placeholder="Précisez d'autres allergies..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
