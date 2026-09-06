'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import type { PatientInput } from '../../schemas/patient-schema';

interface PatientMedicalHistoryStepProps {
  data: Partial<PatientInput>;
  onChange: (data: Partial<PatientInput>) => void;
  hasError?: boolean;
}

export function PatientMedicalHistoryStep({ data, onChange, hasError }: PatientMedicalHistoryStepProps) {
  const medicalHistory = data.medical_history || {
    diabetes: false,
    hypertension: false,
    asthma: false,
    epilepsy: false,
    heart_disease: false,
    hepatitis: false,
    hiv: false,
    pregnancy: false,
    cancer: false,
    bleeding_disorder: false,
    other_conditions: '',
  };

  const toggleCondition = (condition: string) => {
    onChange({
      ...data,
      medical_history: {
        ...medicalHistory,
        [condition]: !medicalHistory[condition as keyof typeof medicalHistory]
      }
    });
  };

  const conditions = [
    { key: 'diabetes', label: 'Diabète' },
    { key: 'hypertension', label: 'Hypertension' },
    { key: 'asthma', label: 'Asthme' },
    { key: 'epilepsy', label: 'Épilepsie' },
    { key: 'heart_disease', label: 'Maladie cardiaque' },
    { key: 'hepatitis', label: 'Hépatite' },
    { key: 'hiv', label: 'VIH' },
    { key: 'pregnancy', label: 'Grossesse' },
    { key: 'cancer', label: 'Cancer' },
    { key: 'bleeding_disorder', label: 'Troubles de coagulation' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Antécédents médicaux</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {conditions.map((condition) => (
            <div key={condition.key} className="flex items-center space-x-2">
              <Checkbox
                id={condition.key}
                checked={Boolean(medicalHistory[condition.key as keyof typeof medicalHistory])}
                onCheckedChange={() => toggleCondition(condition.key)}
              />
              <Label htmlFor={condition.key} className="cursor-pointer">
                {condition.label}
              </Label>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="other_conditions">Autres antécédents</Label>
          <Textarea
            id="other_conditions"
            value={medicalHistory.other_conditions}
            onChange={(e) => onChange({
              ...data,
              medical_history: { ...medicalHistory, other_conditions: e.target.value }
            })}
            placeholder="Précisez d'autres conditions médicales..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
