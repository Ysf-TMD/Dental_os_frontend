'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import type { PatientInput } from '../../schemas/patient-schema';

interface PatientHabitsStepProps {
  data: Partial<PatientInput>;
  onChange: (data: Partial<PatientInput>) => void;
  hasError?: boolean;
}

export function PatientHabitsStep({ data, onChange, hasError }: PatientHabitsStepProps) {
  const habits = data.habits || {
    smoker: false,
    hookah: false,
    alcohol: false,
    drugs: false,
    notes: '',
  };

  const toggleHabit = (habit: string) => {
    onChange({
      ...data,
      habits: {
        ...habits,
        [habit]: !habits[habit as keyof typeof habits]
      }
    });
  };

  const habitList = [
    { key: 'smoker', label: 'Fumeur' },
    { key: 'hookah', label: 'Chicha' },
    { key: 'alcohol', label: 'Alcool' },
    { key: 'drugs', label: 'Drogues' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Habitudes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {habitList.map((habit) => (
            <div key={habit.key} className="flex items-center space-x-2">
              <Checkbox
                id={habit.key}
                checked={Boolean(habits[habit.key as keyof typeof habits])}
                onCheckedChange={() => toggleHabit(habit.key)}
              />
              <Label htmlFor={habit.key} className="cursor-pointer">
                {habit.label}
              </Label>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={habits.notes}
            onChange={(e) => onChange({
              ...data,
              habits: { ...habits, notes: e.target.value }
            })}
            placeholder="Notes supplémentaires sur les habitudes..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
