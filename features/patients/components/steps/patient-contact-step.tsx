'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { PatientInput } from '../../schemas/patient-schema';

interface PatientContactStepProps {
  data: Partial<PatientInput>;
  onChange: (data: Partial<PatientInput>) => void;
  hasError?: boolean;
  fieldErrors?: Record<string, string>;
}

export function PatientContactStep({ data, onChange, hasError, fieldErrors }: PatientContactStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Coordonnées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="phone">Téléphone principal</Label>
              <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
            </div>
            <Input
              id="phone"
              value={data.phone || ''}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              placeholder="+212 6XX XXX XXX"
              className={hasError ? 'border-destructive' : ''}
            />
            {fieldErrors?.phone && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_secondary">Téléphone secondaire</Label>
            <Input
              id="phone_secondary"
              value={data.phone_secondary || ''}
              onChange={(e) => onChange({ ...data, phone_secondary: e.target.value })}
              placeholder="+212 6XX XXX XXX"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              placeholder="email@example.com"
              className={hasError ? 'border-destructive' : ''}
            />
            {fieldErrors?.email && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              value={data.address || ''}
              onChange={(e) => onChange({ ...data, address: e.target.value })}
              placeholder="Adresse complète"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              value={data.city || ''}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
              placeholder="Casablanca"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Région</Label>
            <Input
              id="region"
              value={data.region || ''}
              onChange={(e) => onChange({ ...data, region: e.target.value })}
              placeholder="Casablanca-Settat"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postal_code">Code postal</Label>
            <Input
              id="postal_code"
              value={data.postal_code || ''}
              onChange={(e) => onChange({ ...data, postal_code: e.target.value })}
              placeholder="20000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
