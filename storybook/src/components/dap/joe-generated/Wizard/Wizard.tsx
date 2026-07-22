import React, { useState, useEffect } from "react";
import "./Wizard.css";

export interface WizardStep {
  id: string;
  label: string;
  pageTitle?: string;
  content?: React.ReactNode;
  status?: "none" | "success" | "warning" | "error";
  statusIconSlug?: string | null;
  isVisible?: boolean;
  children?: WizardStep[];
  parentStepId?: string;
  footerButtons?: {
    showCancel?: boolean;
    showPrevious?: boolean;
    primaryLabel?: "Next" | "Finish" | string;
  };
}

export interface WizardEventPayload {
  stepId: string;
  parentStepId?: string;
  stepIndex: number;
  substepIndex?: number;
  stepCode: string;
}

export interface WizardProps {
  title: string;
  steps: WizardStep[];
  mode?: "inline" | "modal";
  size?: "medium" | "large" | "x-large" | "full-screen";
  initialStepId?: string;
  showCloseButton?: boolean;
  isPrimaryEnabled?: boolean | ((ctx: WizardEventPayload) => boolean);
  onCancel?: (event: WizardEventPayload) => void;
  onPrevious?: (event: WizardEventPayload) => void;
  onNext?: (event: WizardEventPayload) => void;
  onFinish?: (event: WizardEventPayload) => void;
  onStepChange?: (event: WizardEventPayload) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Wizard: React.FC<WizardProps> = ({
  title,
  steps,
  mode = "inline",
  size = "large",
  initialStepId,
  showCloseButton = true,
  isPrimaryEnabled = true,
  onCancel,
  onPrevious,
  onNext,
  onFinish,
  onStepChange,
  isOpen,
  onClose,
}) => {
  const [currentStepId, setCurrentStepId] = useState<string>(
    initialStepId || (steps[0]?.id || "")
  );

  // Flatten steps into leaf nodes for navigation
  const flattenSteps = (stepList: WizardStep[], parentStepId?: string): WizardStep[] => {
    const flattened: WizardStep[] = [];
    stepList.forEach((step) => {
      if (step.children && step.children.length > 0) {
        flattened.push(...flattenSteps(step.children, step.id));
      } else if (step.content) {
        flattened.push({ ...step, parentStepId });
      }
    });
    return flattened;
  };

  const leafSteps = flattenSteps(steps);
  const currentStepIndex = leafSteps.findIndex((s) => s.id === currentStepId);
  const currentStep = leafSteps[currentStepIndex];
  const isLastStep = currentStepIndex === leafSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      const payload: WizardEventPayload = {
        stepId: currentStep.id,
        parentStepId: currentStep.parentStepId,
        stepIndex: currentStepIndex,
        substepIndex: undefined,
        stepCode: (currentStepIndex + 1).toString(),
      };
      onFinish?.(payload);
      if (mode === "modal" && onClose) onClose();
    } else {
      const nextStep = leafSteps[currentStepIndex + 1];
      setCurrentStepId(nextStep.id);
      const payload: WizardEventPayload = {
        stepId: nextStep.id,
        parentStepId: nextStep.parentStepId,
        stepIndex: currentStepIndex + 1,
        substepIndex: undefined,
        stepCode: (currentStepIndex + 2).toString(),
      };
      onNext?.(payload);
      onStepChange?.(payload);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevStep = leafSteps[currentStepIndex - 1];
      setCurrentStepId(prevStep.id);
      const payload: WizardEventPayload = {
        stepId: prevStep.id,
        parentStepId: prevStep.parentStepId,
        stepIndex: currentStepIndex - 1,
        substepIndex: undefined,
        stepCode: currentStepIndex.toString(),
      };
      onPrevious?.(payload);
      onStepChange?.(payload);
    }
  };

  const handleCancel = () => {
    const payload: WizardEventPayload = {
      stepId: currentStep.id,
      parentStepId: currentStep.parentStepId,
      stepIndex: currentStepIndex,
      substepIndex: undefined,
      stepCode: (currentStepIndex + 1).toString(),
    };
    onCancel?.(payload);
    if (mode === "modal" && onClose) onClose();
  };

  const handleStepClick = (stepId: string) => {
    const step = leafSteps.find((s) => s.id === stepId);
    if (step) {
      setCurrentStepId(stepId);
      const index = leafSteps.indexOf(step);
      const payload: WizardEventPayload = {
        stepId: step.id,
        parentStepId: step.parentStepId,
        stepIndex: index,
        substepIndex: undefined,
        stepCode: (index + 1).toString(),
      };
      onStepChange?.(payload);
    }
  };

  const renderStatusIcon = (status?: string, statusIconSlug?: string | null) => {
    if (statusIconSlug === null) return null;
    if (!status || status === "none") return null;

    const renderIcon = () => (
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {status === "success" && (
          <path d="M3 8L6 11L13 4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {status === "warning" && (
          <path d="M8 1L1 14H15L8 1ZM8 5V9M8 11V12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        )}
        {status === "error" && (
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth={2} />
        )}
      </svg>
    );

    return <span className="wizard__step-status">{renderIcon()}</span>;
  };

  const renderStepItem = (step: WizardStep, depth = 0) => {
    const isActive = step.id === currentStepId;
    const isCompleted = leafSteps.findIndex((s) => s.id === step.id) < currentStepIndex;
    const hasChildren = step.children && step.children.length > 0;

    return (
      <div key={step.id} style={{ marginLeft: depth * 16 }}>
        <div
          className={`wizard__step-item ${isActive ? "wizard__step-item--active" : ""} ${isCompleted ? "wizard__step-item--completed" : ""}`}
          onClick={() => !hasChildren && step.content && handleStepClick(step.id)}
        >
          <span className="wizard__step-label">{step.label}</span>
          {renderStatusIcon(step.status, step.statusIconSlug)}
        </div>
        {hasChildren && step.children?.map((child) => renderStepItem(child, depth + 1))}
      </div>
    );
  };

  const getStepCode = (index: number, parentStepId?: string) => {
    if (parentStepId) {
      const parentIndex = steps.findIndex((s) => s.id === parentStepId);
      const childIndex = steps[parentIndex]?.children?.findIndex((c) => c.id === currentStepId) ?? 0;
      return `${parentIndex + 1}${String.fromCharCode(97 + childIndex)}`;
    }
    return (index + 1).toString();
  };

  const progressLabel = `Step ${getStepCode(currentStepIndex, currentStep.parentStepId)} of ${leafSteps.length}`;

  const checkPrimaryEnabled = () => {
    if (typeof isPrimaryEnabled === "boolean") return isPrimaryEnabled;
    const payload: WizardEventPayload = {
      stepId: currentStep.id,
      parentStepId: currentStep.parentStepId,
      stepIndex: currentStepIndex,
      substepIndex: undefined,
      stepCode: getStepCode(currentStepIndex, currentStep.parentStepId),
    };
    return isPrimaryEnabled(payload);
  };

  const primaryEnabled = checkPrimaryEnabled();
  const footerButtons = currentStep.footerButtons;

  const showCancelBtn = footerButtons?.showCancel !== false;
  const showPreviousBtn = footerButtons?.showPrevious !== false && currentStepIndex > 0;
  const primaryLabel = footerButtons?.primaryLabel || (isLastStep ? "Finish" : "Next");

  if (mode === "modal" && !isOpen) return null;

  const wizardContent = (
    <div className={`wizard wizard--${mode} wizard--${size}`}>
      <div className="wizard__header">
        <h2 className="wizard__title">{title}</h2>
        {showCloseButton && mode === "modal" && (
          <button
            type="button"
            className="wizard__close"
            onClick={onClose}
            aria-label="Close wizard"
          >
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <div className="wizard__body">
        <div className="wizard__steps-pane">
          {steps.map((step) => renderStepItem(step))}
        </div>

        <div className="wizard__content-pane">
          <div className="wizard__page-content">
            {currentStep.pageTitle && (
              <h3 className="wizard__page-title">{currentStep.pageTitle}</h3>
            )}
            {currentStep.content || <div className="wizard__empty-state">No content available</div>}
          </div>

          <div className="wizard__footer">
            <span className="wizard__progress-label">{progressLabel}</span>
            <div className="wizard__footer-actions">
              {showCancelBtn && (
                <button
                  type="button"
                  className="wizard__button wizard__button--cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
              {showPreviousBtn && (
                <button
                  type="button"
                  className="wizard__button wizard__button--previous"
                  onClick={handlePrevious}
                >
                  Previous
                </button>
              )}
              <button
                type="button"
                className={`wizard__button wizard__button--primary ${!primaryEnabled ? "wizard__button--disabled" : ""}`}
                onClick={handleNext}
                disabled={!primaryEnabled}
              >
                {primaryLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (mode === "modal") {
    return (
      <div className="wizard__overlay" onClick={onClose}>
        <div className="wizard__modal-container" onClick={(e) => e.stopPropagation()}>
          {wizardContent}
        </div>
      </div>
    );
  }

  return wizardContent;
};

export default Wizard;
