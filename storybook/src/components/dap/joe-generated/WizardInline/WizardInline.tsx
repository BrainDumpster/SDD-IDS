import React, { useState } from "react";
import "./WizardInline.css";

export interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export interface WizardInlineProps {
  steps: WizardStep[];
  currentStepIndex?: number;
  onStepChange?: (stepIndex: number) => void;
  onFinish?: () => void;
  onCancel?: () => void;
  linear?: boolean;
  showProgress?: boolean;
  ariaLabel?: string;
}

const WizardInline: React.FC<WizardInlineProps> = ({
  steps,
  currentStepIndex: controlledStepIndex,
  onStepChange,
  onFinish,
  onCancel,
  linear = false,
  showProgress = false,
  ariaLabel = "Wizard",
}) => {
  const [internalStepIndex, setInternalStepIndex] = useState(0);
  const currentStepIndex = controlledStepIndex !== undefined ? controlledStepIndex : internalStepIndex;
  const completedSteps = new Set<number>();

  for (let i = 0; i < currentStepIndex; i++) {
    completedSteps.add(i);
  }

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

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="wizard-inline" role="application" aria-label={ariaLabel}>
      {showProgress && (
        <div className="wizard-inline__progress">
          <div
            className="wizard-inline__progress-bar"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      )}

      {!showProgress && (
        <div className="wizard-inline__steps">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;

            return (
              <button
                key={step.id}
                type="button"
                className={`wizard-inline__step ${isActive ? "wizard-inline__step--active" : ""} ${isCompleted ? "wizard-inline__step--completed" : ""}`}
                onClick={() => handleStepClick(index)}
                disabled={linear && index > currentStepIndex && !isCompleted}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${step.title}`}
              >
                <span className="wizard-inline__step-number">{index + 1}</span>
                <span className="wizard-inline__step-title">{step.title}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="wizard-inline__header">
        <h2 className="wizard-inline__title">{currentStep.title}</h2>
        {currentStep.subtitle && (
          <p className="wizard-inline__subtitle">{currentStep.subtitle}</p>
        )}
      </div>

      <div className="wizard-inline__content">
        {currentStep.content}
      </div>

      <div className="wizard-inline__footer">
        {onCancel && (
          <button
            type="button"
            className="wizard-inline__button wizard-inline__button--cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        {currentStepIndex > 0 && (
          <button
            type="button"
            className="wizard-inline__button wizard-inline__button--previous"
            onClick={handlePrevious}
          >
            Previous
          </button>
        )}
        <button
          type="button"
          className="wizard-inline__button wizard-inline__button--next"
          onClick={handleNext}
        >
          {isLastStep ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default WizardInline;
