'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Wizard, WizardStep } from '@/components/ui/wizard';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast-provider';
import { PatientIdentityStep } from './steps/patient-identity-step';
import { PatientContactStep } from './steps/patient-contact-step';
import { PatientEmergencyContactStep } from './steps/patient-emergency-contact-step';
import { PatientMedicalHistoryStep } from './steps/patient-medical-history-step';
import { PatientAllergiesStep } from './steps/patient-allergies-step';
import { PatientMedicationsStep } from './steps/patient-medications-step';
import { PatientHabitsStep } from './steps/patient-habits-step';
import { PatientDentalInfoStep } from './steps/patient-dental-info-step';
import { PatientInsuranceStep } from './steps/patient-insurance-step';
import { PatientDocumentsConsentsStep } from './steps/patient-documents-consents-step';
import { patientSchema, identitySchema, contactSchema, emergencyContactSchema, medicalHistorySchema, allergiesSchema, medicationsSchema, habitsSchema, dentalInfoSchema, insuranceSchema, documentsConsentsSchema, type PatientInput } from '../schemas/patient-schema';
import { useCreatePatient, useUpdatePatient } from '../hooks/use-patients';
import type { Patient } from '../types';

interface PatientWizardProps {
  mode?: 'create' | 'edit';
  initialData?: Patient;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STORAGE_KEY = 'patient_draft';

export function PatientWizard({ mode = 'create', initialData, onSuccess, onCancel }: PatientWizardProps) {
  const [currentStep, setCurrentStep] = useState('identity');
  const [formData, setFormData] = useState<Partial<PatientInput>>({});
  const [stepErrors, setStepErrors] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError } = useToast();
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();

  const steps: WizardStep[] = [
    { id: 'identity', label: 'Identité', number: 1, description: 'Informations personnelles' },
    { id: 'contact', label: 'Coordonnées', number: 2, description: 'Adresse et contact' },
    { id: 'emergency', label: 'Contact urgence', number: 3, description: 'Personnes à contacter' },
    { id: 'medical', label: 'Historique médical', number: 4, description: 'Antécédents santé' },
    { id: 'allergies', label: 'Allergies', number: 5, description: 'Réactions allergiques' },
    { id: 'medications', label: 'Médicaments', number: 6, description: 'Traitements en cours' },
    { id: 'habits', label: 'Habitudes', number: 7, description: 'Mode de vie' },
    { id: 'dental', label: 'Infos dentaires', number: 8, description: 'Santé bucco-dentaire' },
    { id: 'insurance', label: 'Assurance', number: 9, description: 'Couverture santé' },
    { id: 'documents', label: 'Documents & Consentements', number: 10, description: 'Finalisation' },
  ];

  // Load draft from localStorage on mount
  useEffect(() => {
    if (mode === 'create') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setFormData(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
    } else if (initialData) {
      setFormData(initialData as Partial<PatientInput>);
    }
  }, [mode, initialData]);

  // Save draft to localStorage on form data change
  useEffect(() => {
    if (mode === 'create' && Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, mode]);

  const validateStep = (stepId: string): boolean => {
    const stepSchemas: Record<string, any> = {
      identity: () => {
        const schema = require('../schemas/patient-schema').identitySchema;
        const result = schema.safeParse(formData);
        return result.success;
      },
      contact: () => {
        const schema = require('../schemas/patient-schema').contactSchema;
        const result = schema.safeParse(formData);
        return result.success;
      },
      emergency: () => true, // Optional
      medical: () => true, // Optional
      allergies: () => true, // Optional
      medications: () => true, // Optional
      habits: () => true, // Optional
      dental: () => true, // Optional
      insurance: () => true, // Optional
      documents: () => true, // Optional
    };

    const isValid = stepSchemas[stepId]?.() ?? true;
    setStepErrors(prev => ({ ...prev, [stepId]: !isValid }));
    return isValid;
  };

  const handleNext = () => {
    setStepErrors({});
    setFieldErrors({});
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called', { formData, mode });
    
    // Validate all data before submission
    const stepValidation: Record<string, z.ZodError> = {};
    
    // Validate each step separately
    try {
      identitySchema.parse(formData);
    } catch (e) {
      if (e instanceof z.ZodError) stepValidation['identity'] = e;
    }
    
    try {
      contactSchema.parse(formData);
    } catch (e) {
      if (e instanceof z.ZodError) stepValidation['contact'] = e;
    }
    
    try {
      emergencyContactSchema.parse(formData);
    } catch (e) {
      if (e instanceof z.ZodError) stepValidation['emergency'] = e;
    }
    
    try {
      medicalHistorySchema.parse(formData);
    } catch (e) {
      if (e instanceof z.ZodError) stepValidation['medical'] = e;
    }
    
    try {
      allergiesSchema.parse(formData);
    } catch (e) {
      if (e instanceof z.ZodError) stepValidation['allergies'] = e;
    }
    
    try {
      medicationsSchema.parse(formData);
    } catch (e) {
      if (e instanceof z.ZodError) stepValidation['medications'] = e;
    }
    
    try {
      habitsSchema.parse(formData);
    } catch (e) {
      if (e instanceof z.ZodError) stepValidation['habits'] = e;
    }
    
    try {
      dentalInfoSchema.parse(formData);
    } catch (e) {
      if (e instanceof z.ZodError) stepValidation['dental'] = e;
    }
    
    try {
      insuranceSchema.parse(formData);
    } catch (e) {
      if (e instanceof z.ZodError) stepValidation['insurance'] = e;
    }
    
    try {
      documentsConsentsSchema.parse(formData);
    } catch (e) {
      if (e instanceof z.ZodError) stepValidation['documents'] = e;
    }
    
    console.log('Validation results', stepValidation);
    
    // Check if there are any validation errors
    if (Object.keys(stepValidation).length > 0) {
      // Find first step with errors
      const stepOrder = ['identity', 'contact', 'emergency', 'medical', 'allergies', 'medications', 'habits', 'dental', 'insurance', 'documents'];
      const firstErrorStep = stepOrder.find(step => stepValidation[step]);
      
      if (firstErrorStep) {
        console.log('Navigating to error step:', firstErrorStep);
        console.log('Error details:', stepValidation[firstErrorStep].issues);
        
        // Extract field-level errors
        const errors: Record<string, string> = {};
        stepValidation[firstErrorStep].issues.forEach((issue: any) => {
          const path = issue.path.join('.');
          errors[path] = issue.message;
        });
        
        console.log('Field errors:', errors);
        
        // Set error state immediately
        setStepErrors({ [firstErrorStep]: true });
        setFieldErrors(errors);
        
        // Navigate to the error step
        setCurrentStep(firstErrorStep);
        
        // Show error message
        showError('Erreur de validation', 'Veuillez remplir les champs obligatoires marqués en rouge');
        
        return;
      }
    }

    // All validations passed, submit the form
    console.log('All validations passed, submitting...');
    try {
      setIsSaving(true);
      const validatedData = patientSchema.parse(formData);
      console.log('Data validated:', validatedData);

      if (mode === 'create') {
        await createPatient.mutateAsync(validatedData);
        localStorage.removeItem(STORAGE_KEY);
        showSuccess('Patient créé avec succès', 'Le dossier patient a été enregistré');
      } else if (initialData) {
        await updatePatient.mutateAsync({ id: initialData.id, data: validatedData });
        showSuccess('Patient mis à jour avec succès', 'Les modifications ont été enregistrées');
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to save patient:', error);
      showError('Erreur lors de la sauvegarde', error.message || 'Une erreur est survenue');
    } finally {
      setIsSaving(false);
    }
  };

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  
  console.log('Current state:', { currentStep, currentStepIndex, isLastStep, totalSteps: steps.length });

  const renderStep = () => {
    const hasError = stepErrors[currentStep];
    console.log('renderStep called', { currentStep, hasError, stepErrors });
    switch (currentStep) {
      case 'identity':
        return <PatientIdentityStep data={formData} onChange={setFormData} hasError={hasError} fieldErrors={fieldErrors} />;
      case 'contact':
        return <PatientContactStep data={formData} onChange={setFormData} hasError={hasError} fieldErrors={fieldErrors} />;
      case 'emergency':
        return <PatientEmergencyContactStep data={formData} onChange={setFormData} hasError={hasError} fieldErrors={fieldErrors} />;
      case 'medical':
        return <PatientMedicalHistoryStep data={formData} onChange={setFormData} hasError={hasError} fieldErrors={fieldErrors} />;
      case 'allergies':
        return <PatientAllergiesStep data={formData} onChange={setFormData} hasError={hasError} fieldErrors={fieldErrors} />;
      case 'medications':
        return <PatientMedicationsStep data={formData} onChange={setFormData} hasError={hasError} fieldErrors={fieldErrors} />;
      case 'habits':
        return <PatientHabitsStep data={formData} onChange={setFormData} hasError={hasError} fieldErrors={fieldErrors} />;
      case 'dental':
        return <PatientDentalInfoStep data={formData} onChange={setFormData} hasError={hasError} fieldErrors={fieldErrors} />;
      case 'insurance':
        return <PatientInsuranceStep data={formData} onChange={setFormData} hasError={hasError} fieldErrors={fieldErrors} />;
      case 'documents':
        return <PatientDocumentsConsentsStep data={formData} onChange={setFormData} hasError={hasError} fieldErrors={fieldErrors} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 min-h-0">
        <Wizard
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onFinish={handleSubmit}
          canProceed={true}
          isLastStep={isLastStep}
          isLoading={isSaving}
        >
          {renderStep()}
        </Wizard>
      </div>

      {onCancel && (
        <div className="flex-shrink-0 mt-4 flex justify-end">
          <button
            onClick={onCancel}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}
