/**
 * Synapse Stepper — standalone (no IDS counterpart).
 * Source: components/synapse/stepper/design-spec.md
 */
import React from "react";
import { cx } from "../../shared/utils/cx";
import styles from "./SynapseStepper.module.css";

export type SynapseStepperOrientation = "horizontal" | "vertical";

export interface SynapseStepperProps {
  steps: string[];
  activeStep: number;
  completed?: number[];
  orientation?: SynapseStepperOrientation;
  onStepSelect?: (index: number) => void;
  className?: string;
}

export function SynapseStepper({
  steps,
  activeStep,
  completed = [],
  orientation = "horizontal",
  onStepSelect,
  className,
}: SynapseStepperProps) {
  const isVertical = orientation === "vertical";
  return (
    <div
      className={cx(
        styles.SynapseStepper,
        isVertical && styles.SynapseStepperVertical,
        className,
      )}
      data-ids="SynapseStepper"
      role="list"
      aria-orientation={orientation}
    >
      {steps.map((label, index) => {
        const isCompleted = completed.includes(index);
        const isActive = index === activeStep && !isCompleted;
        const isLastStep = index === steps.length - 1;
        const canSelect = isCompleted && onStepSelect;

        return (
          <div
            key={`${label}-${index}`}
            className={cx(
              styles.SynapseStepperStep,
              isVertical && styles.SynapseStepperStepVertical,
              isActive && styles.SynapseStepperStepActive,
              isCompleted && styles.SynapseStepperStepCompleted,
            )}
            data-ids="SynapseStepperStep"
            role="listitem"
            aria-current={isActive ? "step" : undefined}
            aria-label={isCompleted ? `${label}, completed` : label}
          >
            <div
              className={cx(
                styles.SynapseStepperTopRow,
                isVertical && styles.SynapseStepperTopRowVertical,
              )}
            >
              <div
                className={cx(
                  styles.SynapseStepperConnector,
                  isVertical && styles.SynapseStepperConnectorVertical,
                  isCompleted && styles.SynapseStepperConnectorCompleted,
                  isLastStep && styles.SynapseStepperConnectorTerminal,
                )}
                aria-hidden="true"
              />
              <button
                type="button"
                className={cx(
                  styles.SynapseStepperCircle,
                  isActive && styles.SynapseStepperCircleActive,
                  isCompleted && styles.SynapseStepperCircleCompleted,
                )}
                data-ids="SynapseStepperCircle"
                disabled={!canSelect}
                onClick={() => {
                  if (canSelect) onStepSelect(index);
                }}
                aria-label={isCompleted ? `Go to completed step ${index + 1}` : undefined}
                tabIndex={canSelect ? 0 : -1}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
                {isActive ? (
                  <span
                    className={styles.SynapseStepperActiveDot}
                    data-ids="SynapseStepperActiveDot"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            </div>
            <div className={styles.SynapseStepperLabelRow} data-ids="SynapseStepperLabelRow">
              <span className={styles.SynapseStepperNumber}>{index + 1}.</span>
              <span className={styles.SynapseStepperLabel}>{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

SynapseStepper.displayName = "SynapseStepper";
