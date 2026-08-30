import {
  SPINNER_ARIA_LIVES,
  SPINNER_LABEL_VISIBILITIES,
  SPINNER_MODES,
  SPINNER_SIZES,
  type IdsSpinnerAriaLive,
  type IdsSpinnerLabelVisibility,
  type IdsSpinnerMode,
  type IdsSpinnerSize,
} from "@component-contracts/ids/spinner.contract";

export function resolveSpinnerSize(value: unknown): IdsSpinnerSize {
  if (typeof value === "string" && (SPINNER_SIZES as readonly string[]).includes(value)) {
    return value as IdsSpinnerSize;
  }
  return "md";
}

export function resolveSpinnerMode(value: unknown): IdsSpinnerMode {
  if (typeof value === "string" && (SPINNER_MODES as readonly string[]).includes(value)) {
    return value as IdsSpinnerMode;
  }
  return "inline";
}

export function resolveSpinnerLabel(label: string | undefined | null): string {
  if (label == null || String(label).trim() === "") {
    return "Loading...";
  }
  return String(label);
}

export function resolveSpinnerAriaLive(value: unknown): IdsSpinnerAriaLive {
  if (
    typeof value === "string" &&
    (SPINNER_ARIA_LIVES as readonly string[]).includes(value)
  ) {
    return value as IdsSpinnerAriaLive;
  }
  return "polite";
}

/**
 * Resolve labelVisibility against the design-spec supported matrix.
 * Unknown / incompatible → declared fallbacks.
 */
export function resolveSpinnerLabelVisibility(
  size: IdsSpinnerSize,
  mode: IdsSpinnerMode,
  value: unknown,
): IdsSpinnerLabelVisibility {
  let visibility: IdsSpinnerLabelVisibility | undefined;
  if (
    typeof value === "string" &&
    (SPINNER_LABEL_VISIBILITIES as readonly string[]).includes(value)
  ) {
    visibility = value as IdsSpinnerLabelVisibility;
  }

  if (visibility == null) {
    if (size === "sm") return "visible-inline";
    if (size === "md") return "visible-below";
    return "sr-only";
  }

  if (size === "sm") {
    if (mode === "overlay") return "sr-only";
    if (visibility === "visible-below") return "visible-inline";
    return visibility;
  }

  if (visibility === "visible-inline") {
    return size === "lg" ? "sr-only" : "visible-below";
  }

  return visibility;
}
