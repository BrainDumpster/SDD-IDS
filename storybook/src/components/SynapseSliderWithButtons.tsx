import type { ReactNode } from "react";
import { Button } from "./Button";
import { SynapseSlider } from "./SynapseSlider";
import styles from "./SynapseSliderWithButtons.module.css";

type SliderWithButtonsButtonVariant = "secondary" | "tertiary";

export interface SynapseSliderWithButtonsProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  onDecrement?: () => void;
  onIncrement?: () => void;
  decrementStep?: number;
  incrementStep?: number;
  /** `secondary` — Figma `53932:151198` outline buttons; `tertiary` — topology toolbar. */
  buttonVariant?: SliderWithButtonsButtonVariant;
  /** Defaults to `` `${value}%` ``. Figma reference uses static `100%` at sample fill. */
  readout?: ReactNode;
  disabled?: boolean;
  "aria-label"?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Synapse `Slider with buttons` (`53932:151198`). */
export function SynapseSliderWithButtons({
  min,
  max,
  step = 1,
  value,
  onChange,
  onDecrement,
  onIncrement,
  decrementStep = step,
  incrementStep = step,
  buttonVariant = "secondary",
  readout,
  disabled,
  "aria-label": ariaLabel = "Slider with buttons",
}: SynapseSliderWithButtonsProps) {
  const handleDecrement = onDecrement ?? (() => onChange(clamp(value - decrementStep, min, max)));
  const handleIncrement = onIncrement ?? (() => onChange(clamp(value + incrementStep, min, max)));
  const iconButtonClass = [
    styles.iconButton,
    buttonVariant === "secondary" ? styles.iconButtonOutlined : styles.iconButtonTertiary,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.cluster} role="group" aria-label={ariaLabel}>
      <Button
        className={iconButtonClass}
        programme="synapse"
        variant={buttonVariant}
        size="sm"
        iconOnly
        iconSlug="ctrl-minimize-16"
        aria-label="Zoom out"
        disabled={disabled}
        onClick={handleDecrement}
      />
      <SynapseSlider
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onValueChange={(next) => onChange(clamp(typeof next === "number" ? next : next[0], min, max))}
        showStepper={false}
        showValueLabel={false}
        showEdgeLabels={false}
        density="viewport"
      />
      <Button
        className={iconButtonClass}
        programme="synapse"
        variant={buttonVariant}
        size="sm"
        iconOnly
        iconSlug="shape-plus"
        aria-label="Zoom in"
        disabled={disabled}
        onClick={handleIncrement}
      />
      <span className={styles.readout} aria-live="polite">
        {readout ?? `${value}%`}
      </span>
    </div>
  );
}
