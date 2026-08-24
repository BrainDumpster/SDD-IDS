import {
  PROGRESS_BAR_HELPER_ICON_BY_STATE,
  PROGRESS_BAR_RUNTIME_DEFAULTS,
  PROGRESS_BAR_STATES,
  PROGRESS_BAR_THICKNESSES,
  PROGRESS_BAR_TYPES,
  type IdsProgressBarState,
  type IdsProgressBarThickness,
  type IdsProgressBarType,
} from "@component-contracts/ids/progress-bar.contract";

export function resolveProgressBarType(value: unknown): IdsProgressBarType {
  if (
    typeof value === "string" &&
    (PROGRESS_BAR_TYPES as readonly string[]).includes(value)
  ) {
    return value as IdsProgressBarType;
  }
  return PROGRESS_BAR_RUNTIME_DEFAULTS.type;
}

export function resolveProgressBarThickness(
  value: unknown,
): IdsProgressBarThickness {
  if (
    typeof value === "string" &&
    (PROGRESS_BAR_THICKNESSES as readonly string[]).includes(value)
  ) {
    return value as IdsProgressBarThickness;
  }
  return PROGRESS_BAR_RUNTIME_DEFAULTS.thickness;
}

export function resolveProgressBarState(value: unknown): IdsProgressBarState {
  if (
    typeof value === "string" &&
    (PROGRESS_BAR_STATES as readonly string[]).includes(value)
  ) {
    return value as IdsProgressBarState;
  }
  return PROGRESS_BAR_RUNTIME_DEFAULTS.state;
}

export function clampProgressBarValue(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    return PROGRESS_BAR_RUNTIME_DEFAULTS.value;
  }
  return Math.min(100, Math.max(0, n));
}

export function resolveShowHelperText(value: unknown): boolean {
  return value === true || value === "true";
}

export function helperIconSlugForState(
  state: IdsProgressBarState,
): string | undefined {
  if (state === "in-progress") {
    return undefined;
  }
  return PROGRESS_BAR_HELPER_ICON_BY_STATE[state];
}
