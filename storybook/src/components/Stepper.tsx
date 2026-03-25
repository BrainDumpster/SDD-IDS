import styles from "./Stepper.module.css";

interface StepperProps {
  steps: string[];
  activeStep: number;
  completed?: number[];
}

export function Stepper({ steps, activeStep, completed = [] }: StepperProps) {
  return (
    <div className={styles.root} role="list">
      {steps.map((label, index) => {
        const isActive = index === activeStep;
        const isCompleted = completed.includes(index);

        return (
          <div
            key={index}
            className={[
              styles.step,
              isActive ? styles.active : "",
              isCompleted ? styles.completed : "",
            ]
              .filter(Boolean)
              .join(" ")}
            role="listitem"
            aria-current={isActive ? "step" : undefined}
          >
            {index > 0 && (
              <div
                className={[
                  styles.connector,
                  isCompleted || isActive ? styles.connectorActive : "",
                ].filter(Boolean).join(" ")}
              />
            )}
            <div className={styles.circle}>
              {isCompleted ? (
                <CheckIcon />
              ) : (
                <span className={styles.number}>{index + 1}</span>
              )}
            </div>
            <span className={styles.label}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
