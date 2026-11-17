/**
 * IDS Modal — constants from design-spec + React `lib/react/ids/modal`
 * + `component-contracts/ids/modal.contract.ts`.
 *
 * Spec: `components/ids/modal/design-spec.md`
 * Figma: Modal-Main `11348:63064`, ModalDialog-Main `11349:116221`,
 * Overlay `11348:63172` (live MCP 2026-11-13).
 */

export type IdsModalScenario =
  | "single-page"
  | "multi-page"
  | "dialog"
  | "wizard"
  | "custom";

export type IdsModalType =
  | "non-alerting"
  | "informational"
  | "warning"
  | "major"
  | "critical"
  | "destructive";

export type IdsModalSize = "x-small" | "small" | "medium" | "large";

export type IdsModalLayer = "main" | "carousel" | "single-preview";

export interface IdsModalPage {
  id: string;
  label: string;
  /** String content for prop-driven multi-page demos. */
  content?: string;
}

/** Figma `11348:63064` size matrix (width × height reference). */
export const MODAL_SIZE_DIMENSIONS: Record<
  IdsModalSize,
  { width: number; height: number }
> = {
  large: { width: 1600, height: 826 },
  medium: { width: 1280, height: 667 },
  small: { width: 960, height: 497 },
  "x-small": { width: 640, height: 328 },
};

export const MODAL_DIALOG_TYPE_ICON: Record<
  Exclude<IdsModalType, "non-alerting">,
  string
> = {
  critical: "status-critical-square-solid",
  destructive: "status-critical-square-solid",
  warning: "status-warn-tri-solid",
  major: "status-error-diamond-solid",
  informational: "info-circ-solid",
};

export const MODAL_TWO_BUTTON_TYPES: ReadonlySet<IdsModalType> = new Set([
  "warning",
  "major",
  "critical",
  "destructive",
]);

export const MODAL_ALERTING_TYPES: ReadonlySet<IdsModalType> = new Set([
  "warning",
  "major",
  "critical",
  "destructive",
]);

export const MODAL_API_DEFAULTS = {
  scenario: "single-page" as IdsModalScenario,
  type: "non-alerting" as IdsModalType,
  size: "large" as IdsModalSize,
  closable: true,
  scrollBar: false,
  tabs: true,
  footerCheckbox: false,
  fullScreen: false,
  enablePrimaryAction: true,
  enableTertiaryAction: true,
  enableSecondaryAction: true,
  layer: "main" as IdsModalLayer,
  defaultOpen: false,
} as const;

export const MODAL_FOOTER_CHECKBOX_LABEL =
  "Don't show again until the next update" as const;

export const MODAL_CLOSE_ICON_SLUG = "shape-x" as const;

export const MODAL_COMPOUND_TAGS = [
  "ids-modal-header",
  "ids-modal-description",
  "ids-modal-tabs",
  "ids-modal-content",
  "ids-modal-footer",
] as const;

export const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Match React `resolveScenario` — unknown → single-page; keep wizard/custom. */
export function resolveModalScenario(value: unknown): IdsModalScenario {
  if (
    value === "multi-page" ||
    value === "dialog" ||
    value === "wizard" ||
    value === "custom"
  ) {
    return value;
  }
  return "single-page";
}

export function resolveModalType(value: unknown): IdsModalType {
  if (
    value === "informational" ||
    value === "warning" ||
    value === "major" ||
    value === "critical" ||
    value === "destructive"
  ) {
    return value;
  }
  return "non-alerting";
}

/** Match React: unknown/undefined → large. */
export function resolveModalSize(value: unknown): IdsModalSize {
  if (
    value === "x-small" ||
    value === "small" ||
    value === "medium" ||
    value === "large"
  ) {
    return value;
  }
  return "large";
}

export function resolveModalLayer(value: unknown): IdsModalLayer {
  if (value === "carousel" || value === "single-preview") return value;
  return "main";
}

export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
}
