'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertModal } from '@/components/ui/alert-modal';
import { ChevronRight, ChevronLeft, Check, Layout, Shield } from 'lucide-react';
import type { Page, Role } from '../types';

interface RolePagesMultistepProps {
  roles: Role[];
  allPages: Page[];
  assignedPages: Page[];
  onAssignPages: (roleId: number, pageIds: number[]) => Promise<void>;
  onRoleSelect?: (roleId: number) => Promise<Page[]>;
  loading?: boolean;
  onSaveComplete?: () => void;
}

type Step = 'select-role' | 'select-pages' | 'review';

export function RolePagesMultistep({ roles, allPages, assignedPages, onAssignPages, onRoleSelect, loading, onSaveComplete }: RolePagesMultistepProps) {
  const [currentStep, setCurrentStep] = useState<Step>('select-role');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const steps = [
    { id: 'select-role' as Step, label: 'Sélectionner un rôle', number: 1 },
    { id: 'select-pages' as Step, label: 'Sélectionner les pages', number: 2 },
    { id: 'review' as Step, label: 'Réviser et confirmer', number: 3 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const togglePage = (pageId: number) => {
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const handleNext = async () => {
    if (currentStep === 'select-role' && selectedRole) {
      // Load existing pages for this role
      let existingPages = assignedPages;
      if (onRoleSelect) {
        existingPages = await onRoleSelect(selectedRole.id);
      }
      const pageIds = existingPages.filter(p => p.id !== undefined).map(p => p.id);
      setSelectedPages(new Set(pageIds));
      setCurrentStep('select-pages');
    } else if (currentStep === 'select-pages') {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'select-pages') {
      setCurrentStep('select-role');
    } else if (currentStep === 'review') {
      setCurrentStep('select-pages');
    }
  };

  const handleSave = async () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    if (!selectedRole) return;
    await onAssignPages(selectedRole.id, Array.from(selectedPages));
    // Reset form to step 1
    setCurrentStep('select-role');
    setSelectedRole(null);
    setSelectedPages(new Set());
    setShowConfirmModal(false);
    if (onSaveComplete) {
      onSaveComplete();
    }
  };

  const canProceed = currentStep === 'select-role' ? !!selectedRole : true;

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                  currentStep === step.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : currentStepIndex > index
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground'
                }`}
              >
                {currentStepIndex > index ? (
                  <Check className="size-4" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep === step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-px bg-border" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 'select-role' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sélectionner un rôle</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {roles.map(role => (
              <Card
                key={role.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedRole?.id === role.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedRole?.id === role.id ? 'border-primary bg-primary' : 'border-border'
                      }`}
                    >
                      {selectedRole?.id === role.id && <Check className="size-3 text-primary-foreground" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="size-4 text-primary" />
                      <h4 className="font-medium text-sm truncate">{role.display_name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{role.description || 'Aucune description'}</p>
                    <Badge variant={role.is_active ? 'default' : 'secondary'} className="mt-2 text-xs">
                      {role.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {currentStep === 'select-pages' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Sélectionner les pages pour {selectedRole?.display_name}
            </h3>
            <Badge variant="secondary">{selectedPages.size} sélectionnées</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto">
            {allPages.map(page => {
              const isSelected = selectedPages.has(page.id);
              return (
                <Card
                  key={page.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => togglePage(page.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-primary bg-primary' : 'border-border'
                        }`}
                      >
                        {isSelected && <Check className="size-3 text-primary-foreground" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Layout className="size-4 text-primary" />
                        <h4 className="font-medium text-sm truncate">{page.display_name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono truncate">{page.path}</p>
                      {page.group_name && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {page.group_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      )}

      {currentStep === 'review' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Réviser et confirmer</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rôle sélectionné</p>
              <p className="font-medium">{selectedRole?.display_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Pages assignées ({selectedPages.size})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto">
                {allPages
                  .filter(p => selectedPages.has(p.id))
                  .map(page => (
                    <Card key={page.id} className="p-3 border-primary/30 bg-primary/5">
                      <div className="flex items-center gap-2">
                        <Layout className="size-4 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{page.display_name}</p>
                          <p className="text-xs text-muted-foreground font-mono truncate">{page.path}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 'select-role'}
          className="gap-2"
        >
          <ChevronLeft className="size-4" />
          Précédent
        </Button>

        {currentStep === 'review' ? (
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-primary text-primary-foreground gap-2"
          >
            {loading ? 'Sauvegarde...' : 'Confirmer et sauvegarder'}
            <Check className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-primary text-primary-foreground gap-2"
          >
            Suivant
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>

      <AlertModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title="Confirmer l'affectation"
        description={`Êtes-vous sûr de vouloir assigner ${selectedPages.size} page(s) au rôle ${selectedRole?.display_name} ?`}
        confirmText="Confirmer et sauvegarder"
        cancelText="Annuler"
        loading={loading}
      />
    </div>
  );
}
