'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Check, Shield, Key } from 'lucide-react';
import type { Permission, Role } from '../types';

interface RolePermissionsMultistepProps {
  roles: Role[];
  allPermissions: Permission[];
  assignedPermissions: Permission[];
  onAssignPermissions: (roleId: number, permissionIds: number[]) => Promise<void>;
  loading?: boolean;
}

type Step = 'select-role' | 'select-permissions' | 'review';

export function RolePermissionsMultistep({ roles, allPermissions, assignedPermissions, onAssignPermissions, loading }: RolePermissionsMultistepProps) {
  const [currentStep, setCurrentStep] = useState<Step>('select-role');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());

  const steps = [
    { id: 'select-role' as Step, label: 'Sélectionner un rôle', number: 1 },
    { id: 'select-permissions' as Step, label: 'Sélectionner les permissions', number: 2 },
    { id: 'review' as Step, label: 'Réviser et confirmer', number: 3 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (currentStep === 'select-role' && selectedRole) {
      // Load existing permissions for this role
      const existingPermissions = assignedPermissions.filter(p => p.id !== undefined);
      setSelectedPermissions(new Set(existingPermissions.map(p => p.id)));
      setCurrentStep('select-permissions');
    } else if (currentStep === 'select-permissions') {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'select-permissions') {
      setCurrentStep('select-role');
    } else if (currentStep === 'review') {
      setCurrentStep('select-permissions');
    }
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    await onAssignPermissions(selectedRole.id, Array.from(selectedPermissions));
  };

  const canProceed = currentStep === 'select-role' ? !!selectedRole : true;

  // Group permissions by module
  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    const module = perm.name.split('.')[0] || 'other';
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {currentStep === 'select-permissions' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Sélectionner les permissions pour {selectedRole?.display_name}
            </h3>
            <Badge variant="secondary">{selectedPermissions.size} sélectionnées</Badge>
          </div>
          <div className="space-y-6 max-h-[500px] overflow-y-auto">
            {Object.entries(groupedPermissions).map(([module, permissions]) => (
              <div key={module}>
                <h4 className="font-medium text-sm text-muted-foreground mb-3 capitalize">{module}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {permissions.map(permission => {
                    const isSelected = selectedPermissions.has(permission.id);
                    return (
                      <Card
                        key={permission.id}
                        className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                        onClick={() => togglePermission(permission.id)}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                isSelected ? 'border-primary bg-primary' : 'border-border'
                              }`}
                            >
                              {isSelected && <Check className="size-2.5 text-primary-foreground" />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Key className="size-3.5 text-primary" />
                              <h5 className="font-medium text-xs truncate">{permission.display_name}</h5>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono truncate">{permission.name}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
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
                Permissions assignées ({selectedPermissions.size})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
                {allPermissions
                  .filter(p => selectedPermissions.has(p.id))
                  .map(permission => (
                    <Card key={permission.id} className="p-3 border-primary/30 bg-primary/5">
                      <div className="flex items-center gap-2">
                        <Key className="size-4 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{permission.display_name}</p>
                          <p className="text-xs text-muted-foreground font-mono truncate">{permission.name}</p>
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
    </div>
  );
}
