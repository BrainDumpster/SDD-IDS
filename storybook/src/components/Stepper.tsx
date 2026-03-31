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
        const isCompleted = completed.includes(index);
        const isActive = index === activeStep && !isCompleted;

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
            <div className={styles.topRow}>
              <div
                className={[
                  styles.connector,
                  isCompleted ? styles.connectorCompleted : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden="true"
              />
              <div
                className={[
                  styles.circle,
                  isActive ? styles.circleActive : "",
                  isCompleted ? styles.circleCompleted : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isCompleted ? <CheckIcon /> : null}
                {isActive ? <span className={styles.activeDot} aria-hidden="true" /> : null}
              </div>
            </div>
            <div className={styles.labelRow}>
              <span className={styles.number}>{index + 1}.</span>
              <span className={styles.label}>{label}</span>
            </div>
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
