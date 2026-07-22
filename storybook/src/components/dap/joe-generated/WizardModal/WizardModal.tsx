import React, { useState, useEffect } from "react";
import "./WizardModal.css";

export interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export interface WizardModalProps {
  steps: WizardStep[];
  isOpen: boolean;
  onClose: () => void;
  onFinish?: () => void;
  currentStepIndex?: number;
  onStepChange?: (stepIndex: number) => void;
  linear?: boolean;
  showProgress?: boolean;
  ariaLabel?: string;
}

const WizardModal: React.FC<WizardModalProps> = ({
  steps,
  isOpen,
  onClose,
  onFinish,
  currentStepIndex: controlledStepIndex,
  onStepChange,
  linear = false,
  showProgress = false,
  ariaLabel = "Wizard modal",
}) => {
  const [internalStepIndex, setInternalStepIndex] = useState(0);
  const currentStepIndex = controlledStepIndex !== undefined ? controlledStepIndex : internalStepIndex;
  const completedSteps = new Set<number>();

  for (let i = 0; i < currentStepIndex; i++) {
    completedSteps.add(i);
  }

  useEffect(() => {
    if (isOpen) {
      setInternalStepIndex(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      if (onStepChange) {
        onStepChange(nextIndex);
      } else {
        setInternalStepIndex(nextIndex);
      }
    } else {
      onFinish?.();
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      if (onStepChange) {
        onStepChange(prevIndex);
      } else {
        setInternalStepIndex(prevIndex);
      }
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (linear && stepIndex > currentStepIndex) return;
    if (!linear || stepIndex <= currentStepIndex || completedSteps.has(stepIndex)) {
      if (onStepChange) {
        onStepChange(stepIndex);
      } else {
        setInternalStepIndex(stepIndex);
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  if (!isOpen) return null;

  return (
    <div
      className="wizard-modal__overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div className="wizard-modal" onClick={(e) => e.stopPropagation()}>
        {showProgress && (
          <div className="wizard-modal__progress">
            <div
              className="wizard-modal__progress-bar"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        )}

        {!showProgress && (
          <div className="wizard-modal__steps">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;

              return (
                <button
                  key={step.id}
                  type="button"
                  className={`wizard-modal__step ${isActive ? "wizard-modal__step--active" : ""} ${isCompleted ? "wizard-modal__step--completed" : ""}`}
                  onClick={() => handleStepClick(index)}
                  disabled={linear && index > currentStepIndex && !isCompleted}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                >
                  <span className="wizard-modal__step-number">{index + 1}</span>
                  <span className="wizard-modal__step-title">{step.title}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="wizard-modal__header">
          <h2 className="wizard-modal__title">{currentStep.title}</h2>
          {currentStep.subtitle && (
            <p className="wizard-modal__subtitle">{currentStep.subtitle}</p>
          )}
        </div>

        <div className="wizard-modal__content">
          {currentStep.content}
        </div>

        <div className="wizard-modal__footer">
          <button
            type="button"
            className="wizard-modal__button wizard-modal__button--cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          {currentStepIndex > 0 && (
            <button
              type="button"
              className="wizard-modal__button wizard-modal__button--previous"
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}
          <button
            type="button"
            className="wizard-modal__button wizard-modal__button--next"
            onClick={handleNext}
          >
            {isLastStep ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WizardModal;
