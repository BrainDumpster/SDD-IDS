import type {
  IdsWizardContext,
  IdsWizardDisplayStep,
  IdsWizardEventPayload,
  IdsWizardMode,
  IdsWizardSize,
  IdsWizardStepInput,
  IdsWizardStepStatus,
  IdsWizardVisibleNode,
} from "./ids-wizard.types";

export function toStepCode(topLevelIndex: number, childIndex?: number): string {
  if (childIndex == null) {
    return String(topLevelIndex + 1);
  }
  return `${topLevelIndex + 1}${String.fromCharCode("a".charCodeAt(0) + childIndex)}`;
}

export function resolveVisible(step: IdsWizardStepInput, ctx: IdsWizardContext): boolean {
  if (typeof step.isVisible === "function") {
    return step.isVisible(ctx);
  }
  if (typeof step.isVisible === "boolean") {
    return step.isVisible;
  }
  return true;
}

export function flattenVisible(
  steps: IdsWizardStepInput[],
  ctx: IdsWizardContext,
): { display: IdsWizardDisplayStep[]; leaves: IdsWizardVisibleNode[] } {
  const display: IdsWizardDisplayStep[] = [];
  const leaves: IdsWizardVisibleNode[] = [];

  steps.forEach((topStep, topIndex) => {
    if (!resolveVisible(topStep, ctx)) {
      return;
    }

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

    if (rawChildren.length > 0 && visibleChildren.length === 0) {
      return;
    }

    const topNode: IdsWizardVisibleNode = { node: topStep, topLevelIndex: topIndex };
    display.push({ top: topNode, children: visibleChildren });

    if (visibleChildren.length > 0) {
      leaves.push(...visibleChildren);
    } else {
      leaves.push(topNode);
    }
  });

  return { display, leaves };
}

export function payloadFromNode(node: IdsWizardVisibleNode): IdsWizardEventPayload {
  return {
    stepId: node.node.id,
    parentStepId: node.parentId,
    stepIndex: node.topLevelIndex,
    substepIndex: node.childIndex,
    stepCode: toStepCode(node.topLevelIndex, node.childIndex),
  };
}

export function consolidatedStatus(step: IdsWizardDisplayStep): IdsWizardStepStatus {
  if (step.children.length === 0) {
    return step.top.node.status ?? "none";
  }
  const statuses = step.children.map((child) => child.node.status ?? "none");
  if (statuses.includes("error")) {
    return "error";
  }
  if (statuses.includes("warning")) {
    return "warning";
  }
  if (statuses.includes("success")) {
    return "success";
  }
  return "none";
}

export function defaultStatusIcon(status: IdsWizardStepStatus): string | undefined {
  if (status === "success") {
    return "shape-check";
  }
  if (status === "warning") {
    return "status-warn-tri-solid-16";
  }
  if (status === "error") {
    return "status-error-diamond-solid";
  }
  return undefined;
}

export function resolveStatusIcon(
  step: IdsWizardStepInput,
  fallbackStatus: IdsWizardStepStatus,
): string | undefined {
  if (step.statusIconSlug === null) {
    return undefined;
  }
  const explicit =
    typeof step.statusIconSlug === "string" ? step.statusIconSlug.trim() : "";
  if (explicit) {
    return explicit;
  }
  return defaultStatusIcon(fallbackStatus);
}

export function resolveMode(value: unknown): IdsWizardMode {
  return value === "modal" ? "modal" : "inline";
}

export function resolveSize(value: unknown): IdsWizardSize {
  if (value === "medium" || value === "x-large" || value === "full-screen") {
    return value;
  }
  return "large";
}
