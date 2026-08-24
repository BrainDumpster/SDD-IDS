/**
 * IDS Slider — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/slider`
 * Source: `components/ids/slider/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   SliderRoot
 *     SliderMinLabel?
 *     SliderRail (+ Progress/Range segment, TickList, Thumbs, ValueLabels)
 *     SliderMaxLabel?
 *     SliderValueInputMin? (+ separator + SliderValueInputMax? in range)
 *
 * Composition: value inputs use lib `IdsTextBox` (compact `size="small"`).
 * No @base-ui-components dependency.
 */

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
} from "react";
import { IdsTextBox } from "../text-box";
import styles from "./IdsSlider.module.css";

export type IdsSliderMode = "single" | "range";
export type IdsSliderValue = number | [number, number];

export interface IdsSliderProps {
  mode?: IdsSliderMode | string;
  min: number;
  max: number;
  step?: number;
  value?: IdsSliderValue;
  defaultValue?: IdsSliderValue;
  disabled?: boolean;
  showStepper?: boolean;
  /** Alias of `showStepper` — OR’d with `showStepper`. */
  showTicks?: boolean;
  stepperFrequency?: number;
  showValueLabel?: boolean;
  showValueInput?: boolean;
  minLabel?: string;
  maxLabel?: string;
  onValueChange?: (value: IdsSliderValue) => void;
  onValueCommit?: (value: IdsSliderValue) => void;
  className?: string;
  id?: string;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveMode(value: unknown): IdsSliderMode {
  return value === "range" ? "range" : "single";
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function quantize(value: number, min: number, step: number, max: number): number {
  if (step <= 0) return clamp(value, min, max);
  const snapped = min + Math.round((value - min) / step) * step;
  // Avoid float drift past max
  const rounded = Number(snapped.toFixed(10));
  return clamp(rounded, min, max);
}

function normalizeBounds(min: number, max: number): { min: number; max: number } {
  if (min > max) return { min: max, max: min };
  return { min, max };
}

function normalizeStep(step: number | undefined): number {
  return typeof step === "number" && step > 0 ? step : 1;
}

function normalizeFrequency(
  frequency: number | undefined,
  step: number,
): number {
  return typeof frequency === "number" && frequency > 0 ? frequency : step;
}

function normalizeSingle(
  raw: number,
  min: number,
  max: number,
  step: number,
): number {
  if (!Number.isFinite(raw)) return min;
  return quantize(raw, min, step, max);
}

function normalizeRange(
  raw: [number, number],
  min: number,
  max: number,
  step: number,
): [number, number] {
  const a = normalizeSingle(raw[0], min, max, step);
  const b = normalizeSingle(raw[1], min, max, step);
  return a <= b ? [a, b] : [b, a];
}

function toArrayValue(
  mode: IdsSliderMode,
  raw: IdsSliderValue | undefined,
  min: number,
  max: number,
  step: number,
): number[] {
  if (mode === "range") {
    if (Array.isArray(raw) && raw.length >= 2) {
      const [start, end] = normalizeRange(
        [Number(raw[0]), Number(raw[1])],
        min,
        max,
        step,
      );
      return [start, end];
    }
    // Invalid range → [min, min] then normalized
    return [min, min];
  }
  const singleRaw = Array.isArray(raw) ? Number(raw[0]) : Number(raw ?? min);
  return [normalizeSingle(singleRaw, min, max, step)];
}

function toOutputValue(mode: IdsSliderMode, arr: number[]): IdsSliderValue {
  return mode === "range" ? [arr[0], arr[1]] : arr[0];
}

function valueToPercent(value: number, min: number, max: number): number {
  const span = max - min;
  if (span <= 0) return 0;
  return ((value - min) / span) * 100;
}

function buildTicks(
  min: number,
  max: number,
  frequency: number,
): number[] {
  const values: number[] = [];
  const count = Math.floor((max - min) / frequency) + 1;
  const bounded = Math.min(Math.max(count, 2), 201);
  for (let i = 0; i < bounded; i += 1) {
    values.push(Number((min + i * frequency).toFixed(10)));
  }
  if (values[values.length - 1] !== max) {
    values.push(max);
  }
  // Ensure first is exact min
  values[0] = min;
  return values;
}

export function IdsSlider({
  mode: modeProp = "single",
  min: minProp,
  max: maxProp,
  step: stepProp = 1,
  value,
  defaultValue,
  disabled = false,
  showStepper = false,
  showTicks = false,
  stepperFrequency,
  showValueLabel = true,
  showValueInput = false,
  minLabel,
  maxLabel,
  onValueChange,
  onValueCommit,
  className,
  id,
}: IdsSliderProps): ReactElement {
  const reactId = useId();
  const rootId = id ?? `ids-slider-${reactId}`;

  const mode = resolveMode(modeProp);
  const { min, max } = normalizeBounds(minProp, maxProp);
  const safeStep = normalizeStep(stepProp);
  const steppersOn = Boolean(showStepper || showTicks);
  const frequency = normalizeFrequency(stepperFrequency, safeStep);
  const activeStep = steppersOn ? frequency : safeStep;

  const [internal, setInternal] = useState<number[]>(() =>
    toArrayValue(mode, defaultValue, min, max, activeStep),
  );
  const isControlled = value !== undefined;
  const currentValues = isControlled
    ? toArrayValue(mode, value, min, max, activeStep)
    : toArrayValue(mode, toOutputValue(mode, internal), min, max, activeStep);

  const railRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<0 | 1 | null>(null);
  const latestValuesRef = useRef(currentValues);
  latestValuesRef.current = currentValues;

  const commitValues = useCallback(
    (next: number[], emitCommit: boolean) => {
      const normalized =
        mode === "range"
          ? normalizeRange([next[0] ?? min, next[1] ?? min], min, max, activeStep)
          : [normalizeSingle(next[0] ?? min, min, max, activeStep)];
      if (!isControlled) {
        setInternal(normalized);
      }
      const out = toOutputValue(mode, normalized);
      onValueChange?.(out);
      if (emitCommit) onValueCommit?.(out);
    },
    [activeStep, isControlled, max, min, mode, onValueChange, onValueCommit],
  );

  const setThumbValue = useCallback(
    (index: 0 | 1, nextRaw: number, emitCommit: boolean) => {
      const nextVal = normalizeSingle(nextRaw, min, max, activeStep);
      if (mode === "single") {
        commitValues([nextVal], emitCommit);
        return;
      }
      const draft: [number, number] = [
        latestValuesRef.current[0],
        latestValuesRef.current[1],
      ];
      if (index === 0) {
        draft[0] = Math.min(nextVal, draft[1]);
      } else {
        draft[1] = Math.max(nextVal, draft[0]);
      }
      commitValues(draft, emitCommit);
    },
    [activeStep, commitValues, max, min, mode],
  );

  const clientXToValue = useCallback(
    (clientX: number): number => {
      const el = railRef.current;
      if (!el) return min;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0) return min;
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return normalizeSingle(min + ratio * (max - min), min, max, activeStep);
    },
    [activeStep, max, min],
  );

  const pickThumbForRail = useCallback(
    (nextVal: number): 0 | 1 => {
      if (mode === "single") return 0;
      const [lo, hi] = latestValuesRef.current;
      const distLo = Math.abs(nextVal - lo);
      const distHi = Math.abs(nextVal - hi);
      if (distLo === distHi) {
        // Prefer the thumb on the same side of the midpoint
        const mid = (lo + hi) / 2;
        return nextVal <= mid ? 0 : 1;
      }
      return distLo < distHi ? 0 : 1;
    },
    [mode],
  );

  const beginDrag = (thumb: 0 | 1, clientX: number, target: HTMLElement, pointerId: number) => {
    draggingRef.current = thumb;
    setThumbValue(thumb, clientXToValue(clientX), false);
    target.setPointerCapture(pointerId);
  };

  const onRailPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.button !== 0) return;
    // Ignore if the event originated on a thumb button (handled separately)
    const target = event.target as HTMLElement;
    if (target.closest('[data-ids="ids-slider-thumb-min"], [data-ids="ids-slider-thumb-max"]')) {
      return;
    }
    const nextVal = clientXToValue(event.clientX);
    beginDrag(pickThumbForRail(nextVal), event.clientX, event.currentTarget, event.pointerId);
  };

  const onRailPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || draggingRef.current == null) return;
    setThumbValue(draggingRef.current, clientXToValue(event.clientX), false);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (draggingRef.current == null) return;
    draggingRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onValueCommit?.(toOutputValue(mode, latestValuesRef.current));
  };

  const onThumbKeyDown = (index: 0 | 1) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    let delta = 0;
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        delta = -activeStep;
        break;
      case "ArrowRight":
      case "ArrowUp":
        delta = activeStep;
        break;
      case "Home":
        event.preventDefault();
        setThumbValue(index, min, true);
        return;
      case "End":
        event.preventDefault();
        setThumbValue(index, max, true);
        return;
      default:
        return;
    }
    event.preventDefault();
    const current = latestValuesRef.current[index];
    setThumbValue(index, current + delta, true);
  };

  const onInputCommit = (index: 0 | 1, raw: string) => {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    setThumbValue(index, parsed, true);
  };

  // Keep uncontrolled state in sync when mode/bounds/step change
  useEffect(() => {
    if (isControlled) return;
    setInternal((prev) =>
      toArrayValue(mode, toOutputValue(mode, prev), min, max, activeStep),
    );
  }, [activeStep, isControlled, max, min, mode]);

  const ticks = useMemo(() => {
    if (!steppersOn) return [];
    return buildTicks(min, max, frequency);
  }, [frequency, max, min, steppersOn]);

  const minActive = currentValues.some((v) => v === min);
  const maxActive = currentValues.some((v) => v === max);

  const segmentStyle: CSSProperties | undefined =
    mode === "single"
      ? { width: `${valueToPercent(currentValues[0], min, max)}%` }
      : {
          left: `${valueToPercent(currentValues[0], min, max)}%`,
          width: `${
            valueToPercent(currentValues[1], min, max) -
            valueToPercent(currentValues[0], min, max)
          }%`,
        };

  const isTickSelected = (tick: number): boolean => {
    if (mode === "range") {
      return tick >= currentValues[0] && tick <= currentValues[1];
    }
    return tick <= currentValues[0];
  };

  const renderThumb = (index: 0 | 1, val: number) => {
    const left = `${valueToPercent(val, min, max)}%`;
    const name =
      mode === "range"
        ? index === 0
          ? "Minimum value"
          : "Maximum value"
        : "Slider value";
    return (
      <button
        key={index}
        type="button"
        className={styles["ids-slider-thumb"]}
        data-ids={index === 0 ? "ids-slider-thumb-min" : "ids-slider-thumb-max"}
        style={{ left }}
        role="slider"
        aria-label={name}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={val}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={onThumbKeyDown(index)}
        onPointerDown={(event) => {
          if (disabled) return;
          if (event.button !== 0) return;
          event.preventDefault();
          event.stopPropagation();
          const control = railRef.current;
          if (!control) return;
          beginDrag(index, event.clientX, control, event.pointerId);
        }}
      />
    );
  };

  return (
    <div
      id={rootId}
      className={cx(styles["ids-slider"], className)}
      data-ids="ids-slider"
      data-mode={mode}
      data-disabled={disabled ? "true" : undefined}
      data-stepper={steppersOn ? "on" : "off"}
    >
      <div className={styles["ids-slider-row"]} data-ids="ids-slider-row">
        {minLabel != null && minLabel !== "" ? (
          <span
            className={styles["ids-slider-min-label"]}
            data-ids="ids-slider-min-label"
            data-active={minActive ? "true" : undefined}
          >
            {minLabel}
          </span>
        ) : null}

        <div className={styles["ids-slider-rail-wrap"]} data-ids="ids-slider-rail-wrap">
          <div
            ref={railRef}
            className={styles["ids-slider-control"]}
            data-ids="ids-slider-control"
            onPointerDown={onRailPointerDown}
            onPointerMove={onRailPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div
              className={styles["ids-slider-rail"]}
              data-ids="ids-slider-rail"
              aria-hidden="true"
            >
              {mode === "single" ? (
                <div
                  className={styles["ids-slider-progress"]}
                  data-ids="ids-slider-progress"
                  style={segmentStyle}
                />
              ) : (
                <div
                  className={styles["ids-slider-range"]}
                  data-ids="ids-slider-range"
                  style={segmentStyle}
                />
              )}

              {steppersOn && ticks.length > 0 ? (
                <div
                  className={styles["ids-slider-tick-list"]}
                  data-ids="ids-slider-tick-list"
                  aria-hidden="true"
                >
                  {ticks.map((tick) => (
                    <span
                      key={tick}
                      className={styles["ids-slider-tick"]}
                      data-ids="ids-slider-tick"
                      data-selected={isTickSelected(tick) ? "true" : undefined}
                      style={{ left: `${valueToPercent(tick, min, max)}%` }}
                    />
                  ))}
                </div>
              ) : null}

              {mode === "single"
                ? renderThumb(0, currentValues[0])
                : (
                  <>
                    {renderThumb(0, currentValues[0])}
                    {renderThumb(1, currentValues[1])}
                  </>
                )}

              {showValueLabel ? (
                <div
                  className={styles["ids-slider-value-label-layer"]}
                  data-ids="ids-slider-value-label-layer"
                  aria-hidden="true"
                >
                  {currentValues.map((v, index) => (
                    <span
                      key={index}
                      className={styles["ids-slider-value-label"]}
                      data-ids={
                        index === 0
                          ? "ids-slider-value-label-min"
                          : "ids-slider-value-label-max"
                      }
                      style={{ left: `${valueToPercent(v, min, max)}%` }}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {maxLabel != null && maxLabel !== "" ? (
          <span
            className={styles["ids-slider-max-label"]}
            data-ids="ids-slider-max-label"
            data-active={maxActive ? "true" : undefined}
          >
            {maxLabel}
          </span>
        ) : null}

        {showValueInput ? (
          <div
            className={styles["ids-slider-input-group"]}
            data-ids="ids-slider-input-group"
          >
            <div
              className={styles["ids-slider-value-input"]}
              data-ids="ids-slider-value-input-min"
            >
              <IdsTextBox
                componentType="text-input"
                size="small"
                showLabel={false}
                showIcon={false}
                inputType="number"
                value={String(currentValues[0])}
                disabled={disabled}
                ariaLabel={mode === "range" ? "Minimum value" : "Slider value"}
                onValueChange={(raw) => onInputCommit(0, raw)}
              />
            </div>
            {mode === "range" ? (
              <>
                <span
                  className={styles["ids-slider-input-separator"]}
                  data-ids="ids-slider-input-separator"
                  aria-hidden="true"
                >
                  -
                </span>
                <div
                  className={styles["ids-slider-value-input"]}
                  data-ids="ids-slider-value-input-max"
                >
                  <IdsTextBox
                    componentType="text-input"
                    size="small"
                    showLabel={false}
                    showIcon={false}
                    inputType="number"
                    value={String(currentValues[1])}
                    disabled={disabled}
                    ariaLabel="Maximum value"
                    onValueChange={(raw) => onInputCommit(1, raw)}
                  />
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

IdsSlider.displayName = "IdsSlider";

export default IdsSlider;
