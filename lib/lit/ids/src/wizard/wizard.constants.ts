/**
 * IDS Wizard — constants & navigation helpers.
 * Spec: `components/ids/wizard/design-spec.md`
 * API: `lib/react/ids/wizard`, Angular `lib/angular/ids/wizard`
 */
import type { TemplateResult } from "lit";

export type IdsWizardMode = "inline" | "modal";
export type IdsWizardSize = "medium" | "large" | "x-large" | "full-screen";
export type IdsWizardStepStatus = "none" | "success" | "warning" | "error";

export interface IdsWizardContext {
  currentStepId?: string;
}

export interface IdsWizardFooterButtons {
  showCancel?: boolean;
  showPrevious?: boolean;
  primaryLabel?: "Next" | "Finish" | string;
}

/** Lit step content: plain text or a Lit template. */
export type IdsWizardStepContent = string | TemplateResult | Node;

export interface IdsWizardStepInput {
  id: string;
  label: string;
  pageTitle?: string;
  /** Required for leaf steps; optional for parent steps with children. */
  content?: IdsWizardStepContent;
  status?: IdsWizardStepStatus;
  /** When `null`, suppress icon even if `status` is set. */
  statusIconSlug?: string | null;
  isVisible?: boolean | ((ctx: IdsWizardContext) => boolean);
  children?: IdsWizardStepInput[];
  footerButtons?: IdsWizardFooterButtons;
}

export interface IdsWizardEventPayload {
  stepId: string;
  parentStepId?: string;
  stepIndex: number;
  substepIndex?: number;
  stepCode: string;
}

export interface IdsWizardVisibleNode {
  node: IdsWizardStepInput;
  parentId?: string;
  topLevelIndex: number;
  childIndex?: number;
}

export interface IdsWizardDisplayStep {
  top: IdsWizardVisibleNode;
  children: IdsWizardVisibleNode[];
}

export const WIZARD_MODE_OPTIONS = ["inline", "modal"] as const;
export const WIZARD_SIZE_OPTIONS = [
  "medium",
  "large",
  "x-large",
  "full-screen",
] as const;

export const WIZARD_API_DEFAULTS = {
  mode: "inline" as IdsWizardMode,
  size: "large" as IdsWizardSize,
  title: "Header",
  showCloseButton: true,
  isPrimaryEnabled: true,
} as const;

export const WIZARD_SIZE_MAX_WIDTH: Record<
  Exclude<IdsWizardSize, "full-screen">,
  string
> = {
  medium: "576px",
  large: "864px",
  "x-large": "1152px",
};

export const WIZARD_CLOSE_ICON_SLUG = "ctrl-close-16";
export const WIZARD_EXPAND_ICON_SLUG = "chev-up-thick";
export const WIZARD_STATUS_ICONS = {
  success: "shape-check",
  warning: "status-warn-tri-solid-16",
  error: "status-error-diamond-solid",
} as const;

export const WIZARD_COMPOUND_TAGS = {
  header: "ids-wizard-header",
  headerTitle: "ids-wizard-header-title",
  closeAction: "ids-wizard-close-action",
  body: "ids-wizard-body",
  stepsPane: "ids-wizard-steps-pane",
  stepItem: "ids-wizard-step-item",
  stepLabel: "ids-wizard-step-label",
  stepStatusIndicator: "ids-wizard-step-status-indicator",
  substepList: "ids-wizard-substep-list",
  substepItem: "ids-wizard-substep-item",
  contentPane: "ids-wizard-content-pane",
  pageTitle: "ids-wizard-page-title",
  pageContent: "ids-wizard-page-content",
  footer: "ids-wizard-footer",
  progressLabel: "ids-wizard-progress-label",
  footerActions: "ids-wizard-footer-actions",
  cancelButton: "ids-wizard-cancel-button",
  previousButton: "ids-wizard-previous-button",
  primaryButton: "ids-wizard-primary-button",
} as const;

export function toStepCode(topLevelIndex: number, childIndex?: number): string {
  if (childIndex == null) return String(topLevelIndex + 1);
  return `${topLevelIndex + 1}${String.fromCharCode("a".charCodeAt(0) + childIndex)}`;
}

export function resolveVisible(
  step: IdsWizardStepInput,
  ctx: IdsWizardContext,
): boolean {
  if (typeof step.isVisible === "function") return step.isVisible(ctx);
  if (typeof step.isVisible === "boolean") return step.isVisible;
  return true;
}

export function flattenVisible(
  steps: IdsWizardStepInput[],
  ctx: IdsWizardContext,
): { display: IdsWizardDisplayStep[]; leaves: IdsWizardVisibleNode[] } {
  const display: IdsWizardDisplayStep[] = [];
  const leaves: IdsWizardVisibleNode[] = [];

  steps.forEach((topStep, topIndex) => {
    if (!resolveVisible(topStep, ctx)) return;

    const rawChildren = topStep.children ?? [];
    const visibleChildren = rawChildren
      .map((child, childIndex) => ({ child, childIndex }))
      .filter(({ child }) => resolveVisible(child, ctx))
      .map(({ child, childIndex }) => ({
        node: child,
        parentId: topStep.id,
        topLevelIndex: topIndex,
        childIndex,
      }));

    // Parent with all children hidden → parent hidden (fallback rule).
    if (rawChildren.length > 0 && visibleChildren.length === 0) return;

    const topNode: IdsWizardVisibleNode = {
      node: topStep,
      topLevelIndex: topIndex,
    };
    display.push({ top: topNode, children: visibleChildren });

    if (visibleChildren.length > 0) {
      leaves.push(...visibleChildren);
    } else {
      leaves.push(topNode);
    }
  });

  return { display, leaves };
}

export function payloadFromNode(
  node: IdsWizardVisibleNode,
): IdsWizardEventPayload {
  return {
    stepId: node.node.id,
    parentStepId: node.parentId,
    stepIndex: node.topLevelIndex,
    substepIndex: node.childIndex,
    stepCode: toStepCode(node.topLevelIndex, node.childIndex),
  };
}

export function consolidatedStatus(
  step: IdsWizardDisplayStep,
): IdsWizardStepStatus {
  if (step.children.length === 0) return step.top.node.status ?? "none";
  const statuses = step.children.map((child) => child.node.status ?? "none");
  if (statuses.includes("error")) return "error";
  if (statuses.includes("warning")) return "warning";
  if (statuses.includes("success")) return "success";
  return "none";
}

export function defaultStatusIcon(
  status: IdsWizardStepStatus,
): string | undefined {
  if (status === "success") return WIZARD_STATUS_ICONS.success;
  if (status === "warning") return WIZARD_STATUS_ICONS.warning;
  if (status === "error") return WIZARD_STATUS_ICONS.error;
  return undefined;
}

export function resolveStatusIcon(
  step: IdsWizardStepInput,
  fallbackStatus: IdsWizardStepStatus,
): string | undefined {
  if (step.statusIconSlug === null) return undefined;
  const explicit =
    typeof step.statusIconSlug === "string" ? step.statusIconSlug.trim() : "";
  if (explicit) return explicit;
  return defaultStatusIcon(fallbackStatus);
}

export function resolveWizardMode(value: unknown): IdsWizardMode {
  return value === "modal" ? "modal" : "inline";
}

export function resolveWizardSize(value: unknown): IdsWizardSize {
  if (value === "medium" || value === "x-large" || value === "full-screen") {
    return value;
  }
  return "large";
}
