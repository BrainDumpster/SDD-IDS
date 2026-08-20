/**
 * IDS Modal — framework-agnostic spec contract.
 * Source: `components/ids/modal/design-spec.md`
 */
export const IDS_MODAL_DESIGN_SPEC_PATH = "components/ids/modal/design-spec.md" as const;

export type ModalScenario = "single-page" | "multi-page" | "dialog" | "wizard" | "custom";

export type ModalSize = "x-small" | "small" | "medium" | "large";

/** What's New stack layer (`main` → `carousel` → `single-preview`). */
export type ModalLayer = "main" | "carousel" | "single-preview";

export type ModalDialogType =
  | "non-alerting"
  | "informational"
  | "warning"
  | "major"
  | "critical"
  | "destructive";

export interface ModalPage {
  id: string;
  label: string;
  /** Demo copy when no projected page slot is used. */
  content?: string;
}

/** Figma `11348:63064` size matrix (width × height reference). */
export const MODAL_SIZE_DIMENSIONS: Record<ModalSize, { width: number; height: number }> = {
  large: { width: 1600, height: 826 },
  medium: { width: 1280, height: 667 },
  small: { width: 960, height: 497 },
  "x-small": { width: 640, height: 328 },
};

export const MODAL_DIALOG_TYPE_ICON: Record<
  Exclude<ModalDialogType, "non-alerting">,
  string
> = {
  critical: "status-critical-square-solid",
  destructive: "status-critical-square-solid",
  warning: "status-warn-tri-solid",
  major: "status-error-diamond-solid",
  informational: "info-circ-solid",
};

/** `ids-icon` / `IdsIcon` bindings for dialog severity glyphs (solid assets → `img`). */
export type ModalStatusIconBinding = {
  shape: string;
  variant: "img";
};

export const MODAL_DIALOG_STATUS_ICON: Record<
  Exclude<ModalDialogType, "non-alerting">,
  ModalStatusIconBinding
> = {
  informational: { shape: MODAL_DIALOG_TYPE_ICON.informational, variant: "img" },
  warning: { shape: MODAL_DIALOG_TYPE_ICON.warning, variant: "img" },
  major: { shape: MODAL_DIALOG_TYPE_ICON.major, variant: "img" },
  critical: { shape: MODAL_DIALOG_TYPE_ICON.critical, variant: "img" },
  destructive: { shape: MODAL_DIALOG_TYPE_ICON.destructive, variant: "img" },
};

/** Dialog types that render a two-button footer (tertiary + primary). */
export const MODAL_TWO_BUTTON_DIALOG_TYPES: readonly ModalDialogType[] = [
  "warning",
  "major",
  "critical",
  "destructive",
];

export const MODAL_API_DEFAULTS = {
  scenario: "dialog" as ModalScenario,
  type: "non-alerting" as ModalDialogType,
  size: "medium" as ModalSize,
  closable: true,
  scrollBar: false,
  tabs: false,
  footerCheckbox: false,
  fullScreen: false,
  enablePrimaryAction: true,
  enableTertiaryAction: true,
  layer: "main" as ModalLayer,
} as const;

/** Dialog types with reduced description/content padding (design-spec). */
export const MODAL_ALERTING_DIALOG_TYPES: readonly ModalDialogType[] = [
  "warning",
  "major",
  "critical",
  "destructive",
];

export const MODAL_FOOTER_CHECKBOX_LABEL =
  "Don't show again until the next update" as const;

/** Stacking z-index for multi-layer patterns (What's New). */
export const MODAL_LAYER_Z_INDEX: Record<ModalLayer, { surface: number }> = {
  main: { surface: 1001 },
  carousel: { surface: 1003 },
  "single-preview": { surface: 1005 },
};

export function resolveModalScenario(value: ModalScenario | undefined): ModalScenario {
  if (value === "wizard" || value === "custom") {
    return "single-page";
  }
  if (value === "multi-page" || value === "dialog") {
    return value;
  }
  return "single-page";
}

export function resolveModalType(value: ModalDialogType | undefined): ModalDialogType {
  if (
    value === "informational" ||
    value === "warning" ||
    value === "major" ||
    value === "critical" ||
    value === "destructive"
  ) {
    return value;
  }
  return MODAL_API_DEFAULTS.type;
}

export function resolveModalSize(value: ModalSize | undefined): ModalSize {
  if (value === "x-small" || value === "small" || value === "medium" || value === "large") {
    return value;
  }
  return MODAL_API_DEFAULTS.size;
}

export const MODAL_COMPOSITION_SLOT_ORDER = [
  "modalTitle",
  "modalBody",
  "modalFooter",
] as const;

export type ModalCompositionSlot = (typeof MODAL_COMPOSITION_SLOT_ORDER)[number];

/** Top-level modal DOM/codegen order (mirrors design-spec Codegen Contract). */
export const MODAL_CODEGEN_ANATOMY = [
  "overlay",
  "surface",
  "modalRoot",
  "modalTitle",
  "modalBody",
  "modalFooter",
] as const;

/**
 * All main-area UI must render inside `modalBody` / `bodyContentShell`.
 * Forbidden: projecting components on `surface` between header and footer.
 */
export const MODAL_BODY_CONTAINMENT_RULE =
  "All main-area components (Tabs, inputs, forms, panels, markup, etc.) must be descendants of modalBody / bodyContentShell — never direct children of surface or modalRoot." as const;

/**
 * Internal `modalBody` structure. `projectedContent` is the catch-all for any
 * main-area component; multi-page tabStrip/pagePanel are included when tabs=true.
 */
export const MODAL_BODY_CODEGEN_ANATOMY = [
  "description?",
  "bodyContentShell",
  "projectedContent*",
] as const;

export const MODAL_FIGMA_BODY =
  "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit." as const;

/** Spec Accurate Design: dialog · non-alerting · medium · closable · single primary action. */
export const MODAL_SPEC_ACCURATE_DEFAULTS = {
  ...MODAL_API_DEFAULTS,
  scenario: "dialog" as ModalScenario,
  type: "non-alerting" as ModalDialogType,
  size: "large" as ModalSize,
  title: "Non-Alerting",
  description: MODAL_FIGMA_BODY,
  primaryActionLabel: "Close",
  tertiaryActionLabel: undefined,
  enableTertiaryAction: false,
} as const;

/** Demo pages for multi-page usage stories. */
export const MODAL_MULTI_PAGE_DEMO_PAGES: readonly ModalPage[] = [
  { id: "details", label: "Details", content: "Page 1 content: overview details and context." },
  { id: "settings", label: "Settings", content: "Page 2 content: configurable settings and options." },
  { id: "review", label: "Review", content: "Page 3 content: final review before apply." },
  {
    id: "audit",
    label: "Audit Trail",
    content: "Optional hidden page content via overflow.",
  },
  {
    id: "integrations",
    label: "Integrations",
    content: "Optional hidden page content via overflow.",
  },
];
