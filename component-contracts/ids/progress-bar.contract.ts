/**
 * IDS Progress Bar — framework-agnostic spec contract.
 * Source: `components/ids/progress-bar/design-spec.md`
 */
export const IDS_PROGRESS_BAR_DESIGN_SPEC_PATH =
  "components/ids/progress-bar/design-spec.md" as const;

export const PROGRESS_BAR_TYPES = [
  "inline",
  "with-label",
  "indeterminate",
] as const;
export type IdsProgressBarType = (typeof PROGRESS_BAR_TYPES)[number];

export const PROGRESS_BAR_THICKNESSES = ["thin", "medium", "thick"] as const;
export type IdsProgressBarThickness = (typeof PROGRESS_BAR_THICKNESSES)[number];

export const PROGRESS_BAR_STATES = [
  "in-progress",
  "completed-success",
  "completed-warning",
  "failed-error",
] as const;
export type IdsProgressBarState = (typeof PROGRESS_BAR_STATES)[number];

/** Helper-row icon slugs from design-spec (no icon for `in-progress`). */
export const PROGRESS_BAR_HELPER_ICON_BY_STATE: Record<
  Exclude<IdsProgressBarState, "in-progress">,
  string
> = {
  "completed-success": "status-ok-circ-solid",
  "completed-warning": "status-warn-tri-solid",
  "failed-error": "status-critical-square-solid",
};

/** Runtime defaults from Composition & API. */
export const PROGRESS_BAR_RUNTIME_DEFAULTS = {
  value: 0,
  showHelperText: false,
  type: "inline" as IdsProgressBarType,
  thickness: "medium" as IdsProgressBarThickness,
  state: "in-progress" as IdsProgressBarState,
} as const;

/**
 * Spec Accurate Design — Figma `11099:57210`
 * Determinate/regular, Thin, In Progress + helper. Frame max-width 300px.
 */
export const PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS = {
  value: 30,
  label: "Label",
  type: "with-label" as IdsProgressBarType,
  thickness: "thin" as IdsProgressBarThickness,
  state: "in-progress" as IdsProgressBarState,
  showHelperText: true,
  helperText: "Helper text (time estimate)",
} as const;

/** Secondary proof — Figma `11099:57186` Determinate/Inline, Medium, 30%. */
export const PROGRESS_BAR_INLINE_DEFAULTS = {
  value: 30,
  type: "inline" as IdsProgressBarType,
  thickness: "medium" as IdsProgressBarThickness,
  state: "in-progress" as IdsProgressBarState,
} as const;

export type ProgressBarModel = typeof PROGRESS_BAR_SPEC_ACCURATE_DEFAULTS;
