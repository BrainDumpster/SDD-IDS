import styles from "./Stepper.module.css";

interface StepperProps {
  steps: string[];
  activeStep: number;
  completed?: number[];
  orientation?: "horizontal" | "vertical";
}

export function Stepper({
  steps,
  activeStep,
  completed = [],
  orientation = "horizontal",
}: StepperProps) {
  const isVertical = orientation === "vertical";
  return (
    <div
      className={[styles.root, isVertical ? styles.rootVertical : ""].filter(Boolean).join(" ")}
      role="list"
      aria-orientation={orientation}
    >
      {steps.map((label, index) => {
        const isCompleted = completed.includes(index);
        const isActive = index === activeStep && !isCompleted;
        const isLastStep = index === steps.length - 1;

        return (
          <div
            key={index}
            className={[
              styles.step,
              isVertical ? styles.stepVertical : "",
              isActive ? styles.active : "",
              isCompleted ? styles.completed : "",
            ]
              .filter(Boolean)
              .join(" ")}
            role="listitem"
            aria-current={isActive ? "step" : undefined}
          >
            <div className={[styles.topRow, isVertical ? styles.topRowVertical : ""].join(" ")}>
              <div
                className={[
                  styles.connector,
                  isVertical ? styles.connectorVertical : "",
                  isCompleted ? styles.connectorCompleted : "",
                  isLastStep ? styles.connectorTerminal : "",
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
