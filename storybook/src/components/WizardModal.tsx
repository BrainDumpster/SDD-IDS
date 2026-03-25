import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { type ReactNode, useState } from "react";
import styles from "./WizardModal.module.css";

interface WizardStep {
  title: string;
  content: ReactNode;
}

interface WizardModalProps {
  steps: WizardStep[];
  trigger: ReactNode;
  onFinish?: () => void;
}

export function WizardModal({ steps, trigger, onFinish }: WizardModalProps) {
  const [current, setCurrent] = useState(0);
  const total = steps.length;
  const isFirst = current === 0;
  const isLast = current === total - 1;

  const reset = () => setCurrent(0);

  return (
    <BaseDialog.Root
      onOpenChange={(open) => {
        if (!open) reset();
      }}
    >
      <BaseDialog.Trigger className={styles.triggerReset}>
        {trigger}
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup className={styles.popup}>
          {/* Header */}
          <div className={styles.header}>
            <BaseDialog.Title className={styles.title}>
              {steps[current]?.title}
            </BaseDialog.Title>
            <BaseDialog.Close className={styles.close} aria-label="Close">
              <CloseIcon />
            </BaseDialog.Close>
          </div>

          {/* Stepper */}
          <div className={styles.stepper}>
            {steps.map((step, i) => (
              <div
                key={i}
                className={[
                  styles.step,
                  i < current ? styles.completed : "",
                  i === current ? styles.active : "",
                ].filter(Boolean).join(" ")}
              >
                <span className={styles.stepNumber}>{i + 1}</span>
                <span className={styles.stepLabel}>{step.title}</span>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className={styles.body}>{steps[current]?.content}</div>

          {/* Footer */}
          <div className={styles.footer}>
            <span className={styles.progress}>
              Step {current + 1} of {total}
            </span>
            <div className={styles.actions}>
              {!isFirst && (
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setCurrent((c) => c - 1)}
                >
                  Previous
                </button>
              )}
              {isLast ? (
                <BaseDialog.Close
                  className={styles.btnPrimary}
                  onClick={() => onFinish?.()}
                >
                  Finish
                </BaseDialog.Close>
              ) : (
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => setCurrent((c) => c + 1)}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
