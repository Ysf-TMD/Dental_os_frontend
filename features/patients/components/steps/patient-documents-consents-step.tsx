'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { PatientInput } from '../../schemas/patient-schema';

interface PatientDocumentsConsentsStepProps {
  data: Partial<PatientInput>;
  onChange: (data: Partial<PatientInput>) => void;
  hasError?: boolean;
}

export function PatientDocumentsConsentsStep({ data, onChange, hasError }: PatientDocumentsConsentsStepProps) {
  const consents = data.consents || {
    terms_of_use: false,
    data_processing: false,
    sms_notifications: false,
    email_notifications: false,
    whatsapp_notifications: false,
    cndp_consent: false,
  };
  const notes = data.notes || [];

  const toggleConsent = (consent: string) => {
    onChange({
      ...data,
      consents: {
        ...consents,
        [consent]: !consents[consent as keyof typeof consents]
      }
    });
  };

  const addNote = () => {
    onChange({
      ...data,
      notes: [
        ...notes,
        { content: '', is_private: false }
      ]
    });
  };

  const updateNote = (index: number, field: string, value: string | boolean) => {
    const updated = [...notes];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, notes: updated });
  };

  const removeNote = (index: number) => {
    const updated = notes.filter((_, i) => i !== index);
    onChange({ ...data, notes: updated });
  };

  const consentList = [
    { key: 'terms_of_use', label: 'Conditions d\'utilisation' },
    { key: 'data_processing', label: 'Traitement des données' },
    { key: 'sms_notifications', label: 'Notifications SMS' },
    { key: 'email_notifications', label: 'Notifications Email' },
    { key: 'whatsapp_notifications', label: 'Notifications WhatsApp' },
    { key: 'cndp_consent', label: 'Consentement CNDP (protection des données)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Consentements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {consentList.map((consent) => (
            <div key={consent.key} className="flex items-center space-x-2">
              <Checkbox
                id={consent.key}
                checked={Boolean(consents[consent.key as keyof typeof consents])}
                onCheckedChange={() => toggleConsent(consent.key)}
              />
              <Label htmlFor={consent.key} className="cursor-pointer">
                {consent.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Notes</h3>
          <Button onClick={addNote} size="sm" variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>

        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune note ajoutée</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">Note {index + 1}</span>
                  <Button
                    onClick={() => removeNote(index)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Contenu *</Label>
                  <Textarea
                    value={note.content}
                    onChange={(e) => updateNote(index, 'content', e.target.value)}
                    placeholder="Contenu de la note..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`private-${index}`}
                    checked={note.is_private as boolean}
                    onCheckedChange={(checked) => updateNote(index, 'is_private', checked as boolean)}
                  />
                  <Label htmlFor={`private-${index}`} className="cursor-pointer">
                    Note privée
                  </Label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
