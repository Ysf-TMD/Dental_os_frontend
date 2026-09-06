'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { PatientInput } from '../../schemas/patient-schema';

interface PatientEmergencyContactStepProps {
  data: Partial<PatientInput>;
  onChange: (data: Partial<PatientInput>) => void;
  hasError?: boolean;
  fieldErrors?: Record<string, string>;
}

export function PatientEmergencyContactStep({ data, onChange, hasError, fieldErrors }: PatientEmergencyContactStepProps) {
  const emergencyContacts = data.emergency_contacts || [];

  const addContact = () => {
    onChange({
      ...data,
      emergency_contacts: [
        ...emergencyContacts,
        { name: '', relationship: '', phone: '', address: '' }
      ]
    });
  };

  const updateContact = (index: number, field: string, value: string) => {
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, emergency_contacts: updated });
  };

  const removeContact = (index: number) => {
    const updated = emergencyContacts.filter((_, i) => i !== index);
    onChange({ ...data, emergency_contacts: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Contact d'urgence</h3>
          <Button onClick={addContact} size="sm" variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>

        {emergencyContacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun contact d'urgence ajouté</p>
        ) : (
          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">Contact {index + 1}</span>
                  <Button
                    onClick={() => removeContact(index)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input
                      value={contact.name}
                      onChange={(e) => updateContact(index, 'name', e.target.value)}
                      placeholder="Nom du contact"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Lien de parenté *</Label>
                    <Input
                      value={contact.relationship}
                      onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                      placeholder="Ex: Frère, Épouse..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Téléphone *</Label>
                    <Input
                      value={contact.phone}
                      onChange={(e) => updateContact(index, 'phone', e.target.value)}
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input
                      value={contact.address || ''}
                      onChange={(e) => updateContact(index, 'address', e.target.value)}
                      placeholder="Adresse"
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
