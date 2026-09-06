'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PatientInput } from '../../schemas/patient-schema';

interface PatientIdentityStepProps {
  data: Partial<PatientInput>;
  onChange: (data: Partial<PatientInput>) => void;
  hasError?: boolean;
  fieldErrors?: Record<string, string>;
}

export function PatientIdentityStep({ data, onChange, hasError, fieldErrors }: PatientIdentityStepProps) {
  console.log('PatientIdentityStep rendered', { hasError, data });
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Informations d'identité</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Civilité</Label>
            <Select
              value={data.title}
              onValueChange={(value) => onChange({ ...data, title: value as any })}
            >
              <SelectTrigger id="title">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M.">M.</SelectItem>
                <SelectItem value="Mme">Mme</SelectItem>
                <SelectItem value="Mlle">Mlle</SelectItem>
                <SelectItem value="Enfant">Enfant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="gender">Sexe</Label>
              <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
            </div>
            <Select
              value={data.gender}
              onValueChange={(value) => onChange({ ...data, gender: value as any })}
            >
              <SelectTrigger id="gender" className={hasError ? 'border-destructive' : ''}>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Homme</SelectItem>
                <SelectItem value="F">Femme</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors?.gender && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="first_name">Prénom</Label>
              <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
            </div>
            <Input
              id="first_name"
              value={data.first_name || ''}
              onChange={(e) => onChange({ ...data, first_name: e.target.value })}
              placeholder="Prénom"
              className={hasError ? 'border-destructive' : ''}
            />
            {fieldErrors?.first_name && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.first_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="last_name">Nom</Label>
              <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
            </div>
            <Input
              id="last_name"
              value={data.last_name || ''}
              onChange={(e) => onChange({ ...data, last_name: e.target.value })}
              placeholder="Nom"
              className={hasError ? 'border-destructive' : ''}
            />
            {fieldErrors?.last_name && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.last_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_name_ar">Prénom (arabe)</Label>
            <Input
              id="first_name_ar"
              value={data.first_name_ar || ''}
              onChange={(e) => onChange({ ...data, first_name_ar: e.target.value })}
              placeholder="الاسم الأول"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name_ar">Nom (arabe)</Label>
            <Input
              id="last_name_ar"
              value={data.last_name_ar || ''}
              onChange={(e) => onChange({ ...data, last_name_ar: e.target.value })}
              placeholder="اسم العائلة"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="birth_date">Date de naissance</Label>
              <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
            </div>
            <Input
              id="birth_date"
              type="date"
              value={data.birth_date || ''}
              onChange={(e) => onChange({ ...data, birth_date: e.target.value })}
              className={hasError ? 'border-destructive' : ''}
            />
            {fieldErrors?.birth_date && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.birth_date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_place">Lieu de naissance</Label>
            <Input
              id="birth_place"
              value={data.birth_place || ''}
              onChange={(e) => onChange({ ...data, birth_place: e.target.value })}
              placeholder="Ville de naissance"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationalité</Label>
            <Input
              id="nationality"
              value={data.nationality || 'Marocain'}
              onChange={(e) => onChange({ ...data, nationality: e.target.value })}
              placeholder="Marocain"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cin">CIN</Label>
            <Input
              id="cin"
              value={data.cin || ''}
              onChange={(e) => onChange({ ...data, cin: e.target.value })}
              placeholder="Numéro CIN"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passport">Passeport</Label>
            <Input
              id="passport"
              value={data.passport || ''}
              onChange={(e) => onChange({ ...data, passport: e.target.value })}
              placeholder="Numéro passeport"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
