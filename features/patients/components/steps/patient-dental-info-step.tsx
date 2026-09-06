'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { PatientInput } from '../../schemas/patient-schema';

interface PatientDentalInfoStepProps {
  data: Partial<PatientInput>;
  onChange: (data: Partial<PatientInput>) => void;
  hasError?: boolean;
  fieldErrors?: Record<string, string>;
}

export function PatientDentalInfoStep({ data, onChange, hasError, fieldErrors }: PatientDentalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Informations dentaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="blood_group">Groupe sanguin</Label>
            <Select
              value={data.blood_group}
              onValueChange={(value) => onChange({ ...data, blood_group: value as any })}
            >
              <SelectTrigger id="blood_group">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referring_dentist">Dentiste référent</Label>
            <Input
              id="referring_dentist"
              value={data.referring_dentist || ''}
              onChange={(e) => onChange({ ...data, referring_dentist: e.target.value })}
              placeholder="Nom du dentiste"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_visit_date">Date première visite</Label>
            <Input
              id="first_visit_date"
              type="date"
              value={data.first_visit_date || ''}
              onChange={(e) => onChange({ ...data, first_visit_date: e.target.value })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="consultation_reason">Motif de consultation</Label>
            <Textarea
              id="consultation_reason"
              value={data.consultation_reason || ''}
              onChange={(e) => onChange({ ...data, consultation_reason: e.target.value })}
              placeholder="Motif de la consultation..."
              rows={2}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="oral_health_status">État bucco-dentaire général</Label>
            <Textarea
              id="oral_health_status"
              value={data.oral_health_status || ''}
              onChange={(e) => onChange({ ...data, oral_health_status: e.target.value })}
              placeholder="Description de l'état bucco-dentaire..."
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
