import type { IdsSliderMode, IdsSliderValue } from "@component-contracts/ids/slider.contract";

export function resolveSliderMode(value: unknown): IdsSliderMode {
  return value === "range" ? "range" : "single";
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function quantize(value: number, min: number, step: number, max: number): number {
  if (step <= 0) {
    return clamp(value, min, max);
  }
  const snapped = min + Math.round((value - min) / step) * step;
  const rounded = Number(snapped.toFixed(10));
  return clamp(rounded, min, max);
}

export function normalizeBounds(min: number, max: number): { min: number; max: number } {
  if (min > max) {
    return { min: max, max: min };
  }
  return { min, max };
}

export function normalizeStep(step: number | undefined): number {
  return typeof step === "number" && step > 0 ? step : 1;
}

export function normalizeFrequency(frequency: number | undefined, step: number): number {
  return typeof frequency === "number" && frequency > 0 ? frequency : step;
}

export function normalizeSingle(
  raw: number,
  min: number,
  max: number,
  step: number,
): number {
  if (!Number.isFinite(raw)) {
    return min;
  }
  return quantize(raw, min, step, max);
}

export function normalizeRange(
  raw: [number, number],
  min: number,
  max: number,
  step: number,
): [number, number] {
  const a = normalizeSingle(raw[0], min, max, step);
  const b = normalizeSingle(raw[1], min, max, step);
  return a <= b ? [a, b] : [b, a];
}

export function toArrayValue(
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
    return [min, min];
  }
  const singleRaw = Array.isArray(raw) ? Number(raw[0]) : Number(raw ?? min);
  return [normalizeSingle(singleRaw, min, max, step)];
}

export function toOutputValue(mode: IdsSliderMode, arr: number[]): IdsSliderValue {
  return mode === "range" ? [arr[0], arr[1]] : arr[0];
}

export function valueToPercent(value: number, min: number, max: number): number {
  const span = max - min;
  if (span <= 0) {
    return 0;
  }
  return ((value - min) / span) * 100;
}

export function buildTicks(min: number, max: number, frequency: number): number[] {
  const values: number[] = [];
  const count = Math.floor((max - min) / frequency) + 1;
  const bounded = Math.min(Math.max(count, 2), 201);
  for (let i = 0; i < bounded; i += 1) {
    values.push(Number((min + i * frequency).toFixed(10)));
  }
  if (values[values.length - 1] !== max) {
    values.push(max);
  }
  values[0] = min;
  return values;
}

export function valuesEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((value, index) => value === b[index]);
}
