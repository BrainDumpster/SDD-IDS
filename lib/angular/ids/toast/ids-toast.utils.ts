/**
 * Toast resolve helpers — port of `lib/react/ids/toast` (IdsToastItem / IdsToastViewport).
 */
import {
  TOAST_API_DEFAULTS,
  TOAST_POSITIONS,
  TOAST_TYPE_SET,
  type IdsToastPosition,
  type IdsToastType,
} from "@component-contracts/ids/toast.contract";

export function resolveToastType(value: unknown): IdsToastType {
  if (typeof value === "string" && TOAST_TYPE_SET.has(value as IdsToastType)) {
    return value as IdsToastType;
  }
  return TOAST_API_DEFAULTS.type;
}

export function resolveToastDuration(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    return TOAST_API_DEFAULTS.duration;
  }
  return value;
}

export function resolveToastPosition(value: unknown): IdsToastPosition {
  if (typeof value === "string" && (TOAST_POSITIONS as readonly string[]).includes(value)) {
    return value as IdsToastPosition;
  }
  return TOAST_API_DEFAULTS.position;
}

export function resolveToastMaxVisible(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 1) {
    return Math.floor(value);
  }
  return TOAST_API_DEFAULTS.maxVisible;
}

export function warnMissingToastIcon(shape: string): void {
  console.warn(`[IdsToast] Missing icon asset for shape "${shape}".`);
}
