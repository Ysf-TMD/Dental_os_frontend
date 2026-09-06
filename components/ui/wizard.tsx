'use client';

import React, { ReactNode } from 'react';
import { Button } from './button';
import { ChevronLeft, ChevronRight, Check, User, MapPin, Phone, Activity, AlertTriangle, Pill, Heart, Smile, Shield, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './card';

export interface WizardStep {
  id: string;
  label: string;
  number: number;
  icon?: ReactNode;
  description?: string;
}

interface WizardProps {
  steps: WizardStep[];
  currentStep: string;
  onStepChange: (stepId: string) => void;
  children: ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  onFinish?: () => void;
  canProceed?: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
}

const stepIcons: Record<number, ReactNode> = {
  1: <User className="w-4 h-4" />,
  2: <MapPin className="w-4 h-4" />,
  3: <Phone className="w-4 h-4" />,
  4: <Activity className="w-4 h-4" />,
  5: <AlertTriangle className="w-4 h-4" />,
  6: <Pill className="w-4 h-4" />,
  7: <Heart className="w-4 h-4" />,
  8: <Smile className="w-4 h-4" />,
  9: <Shield className="w-4 h-4" />,
  10: <FileText className="w-4 h-4" />,
};

export function Wizard({
  steps,
  currentStep,
  onStepChange,
  children,
  onNext,
  onPrevious,
  onFinish,
  canProceed = true,
  isLastStep = false,
  isLoading = false,
}: WizardProps) {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    console.log('Wizard handleNext called', { isLastStep, currentStepIndex, totalSteps: steps.length });
    if (isLastStep) {
      console.log('Calling onFinish callback');
      if (onFinish) {
        onFinish();
      }
    } else if (onNext) {
      console.log('Calling onNext callback');
      onNext();
    } else if (currentStepIndex < steps.length - 1) {
      console.log('Navigating to next step');
      onStepChange(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (currentStepIndex > 0) {
      onStepChange(steps[currentStepIndex - 1].id);
    }
  };

  const handleStepClick = (stepId: string, index: number) => {
    // Only allow clicking on completed steps or the next step
    if (index <= currentStepIndex + 1) {
      onStepChange(stepId);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header with Progress */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Étape {currentStepIndex + 1} sur {steps.length}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {steps[currentStepIndex].label}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
            <div className="text-[10px] text-muted-foreground">Complété</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Navigation Buttons - Top */}
      <div className="flex-shrink-0 flex justify-between items-center py-3 border-b border-border mb-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          className="gap-2 h-9"
        >
          <ChevronLeft className="w-4 h-4" />
          Précédent
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {currentStepIndex + 1} / {steps.length}
          </span>
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceed || isLoading}
          className="gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all h-9"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Chargement...
            </>
          ) : isLastStep ? (
            <>
              Terminer
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              Suivant
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Steps Navigation - Compact horizontal */}
      <Card className="flex-shrink-0 p-3 mb-4">
        <div className="flex items-center justify-between gap-1">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => handleStepClick(step.id, index)}
                disabled={index > currentStepIndex + 1}
                className={cn(
                  'flex flex-col items-center flex-1 min-w-[60px] group transition-all duration-200',
                  index > currentStepIndex + 1 && 'opacity-40 cursor-not-allowed'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg border-2 transition-all duration-200 relative',
                    currentStep === step.id
                      ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                      : currentStepIndex > index
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-primary/5'
                  )}
                >
                  {currentStepIndex > index ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-xs font-semibold">{step.number}</span>
                  )}
                  {currentStep === step.id && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium text-center mt-1 transition-colors leading-tight',
                    currentStep === step.id
                      ? 'text-foreground font-semibold'
                      : currentStepIndex > index
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-1 transition-colors min-w-[8px]',
                    currentStepIndex > index ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Step Content - Flexible */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Card className="h-full p-5 overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(100vh - 400px)' }}>
          {children}
        </Card>
      </div>
    </div>
  );
}
