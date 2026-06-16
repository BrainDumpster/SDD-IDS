import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { isValidElement, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import styles from "./IdsWizard.module.css";

export type IdsWizardMode = "inline" | "modal";
export type IdsWizardSize = "medium" | "large" | "x-large" | "full-screen";
export type IdsWizardStepStatus = "none" | "success" | "warning" | "error";

export interface IdsWizardFooterButtons {
  showCancel?: boolean;
  showPrevious?: boolean;
  primaryLabel?: string;
}

export interface IdsWizardContext {
  currentStepId?: string;
}

export interface IdsWizardStep {
  id: string;
  label: string;
  pageTitle?: string;
  content?: ReactNode;
  status?: IdsWizardStepStatus;
  statusIconSlug?: string | null;
  isVisible?: boolean | ((ctx: IdsWizardContext) => boolean);
  children?: IdsWizardStep[];
  footerButtons?: IdsWizardFooterButtons;
  primaryDisabled?: boolean;
}

export interface IdsWizardEventPayload {
  stepId: string;
  parentStepId?: string;
  stepIndex: number;
  substepIndex?: number;
  stepCode: string;
}

export interface IdsWizardProps {
  /** Synapse programme: modal shell radius via theme + Synapse `Button` chrome in footer. */
  programme?: "ids" | "synapse";
  mode?: IdsWizardMode;
  size?: IdsWizardSize;
  title: string;
  steps: IdsWizardStep[];
  initialStepId?: string;
  showCloseButton?: boolean;
  isPrimaryEnabled?: boolean | ((ctx: IdsWizardContext) => boolean);
  onCancel?: (event: IdsWizardEventPayload) => void;
  onPrevious?: (event: IdsWizardEventPayload) => void;
  onNext?: (event: IdsWizardEventPayload) => void;
  onFinish?: (event: IdsWizardEventPayload) => void;
  onStepChange?: (event: IdsWizardEventPayload) => void;
  trigger?: ReactNode;
}

interface VisibleNode {
  node: IdsWizardStep;
  parentId?: string;
  topLevelIndex: number;
  childIndex?: number;
}

interface DisplayStep {
  top: VisibleNode;
  children: VisibleNode[];
}

function toStepCode(topLevelIndex: number, childIndex?: number): string {
  if (childIndex == null) return String(topLevelIndex + 1);
  const letter = String.fromCharCode("a".charCodeAt(0) + childIndex);
  return `${topLevelIndex + 1}${letter}`;
}

function resolveVisible(step: IdsWizardStep, ctx: IdsWizardContext): boolean {
  if (typeof step.isVisible === "function") return step.isVisible(ctx);
  if (typeof step.isVisible === "boolean") return step.isVisible;
  return true;
}

function flattenVisible(steps: IdsWizardStep[], ctx: IdsWizardContext): { display: DisplayStep[]; leaves: VisibleNode[] } {
  const display: DisplayStep[] = [];
  const leaves: VisibleNode[] = [];

  steps.forEach((topStep, topIndex) => {
    if (!resolveVisible(topStep, ctx)) return;
    const topNode: VisibleNode = { node: topStep, topLevelIndex: topIndex };
    const rawChildren = topStep.children ?? [];
    const visibleChildren = rawChildren
      .filter((child) => resolveVisible(child, ctx))
      .map((child, childIndex) => ({
        node: child,
        parentId: topStep.id,
        topLevelIndex: topIndex,
        childIndex,
      }));

    display.push({ top: topNode, children: visibleChildren });

    if (visibleChildren.length > 0) {
      leaves.push(...visibleChildren);
    } else {
      leaves.push(topNode);
    }
  });

  return { display, leaves };
}

function payloadFromNode(node: VisibleNode): IdsWizardEventPayload {
  return {
    stepId: node.node.id,
    parentStepId: node.parentId,
    stepIndex: node.topLevelIndex,
    substepIndex: node.childIndex,
    stepCode: toStepCode(node.topLevelIndex, node.childIndex),
  };
}

function consolidatedStatus(step: DisplayStep): IdsWizardStepStatus {
  if (step.children.length === 0) return step.top.node.status ?? "none";
  const statuses = step.children.map((child) => child.node.status ?? "none");
  if (statuses.includes("error")) return "error";
  if (statuses.includes("warning")) return "warning";
  if (statuses.includes("success")) return "success";
  return "none";
}

function statusIcon(status: IdsWizardStepStatus): string | undefined {
  if (status === "success") return "shape-check";
  if (status === "warning") return "status-warn-tri-solid-16";
  if (status === "error") return "status-error-diamond-solid";
  return undefined;
}

function resolveStatusIcon(step: IdsWizardStep, fallbackStatus: IdsWizardStepStatus): string | undefined {
  if (step.statusIconSlug === null) return undefined;
  const explicitSlug = typeof step.statusIconSlug === "string" ? step.statusIconSlug.trim() : "";
  if (explicitSlug) return explicitSlug;
  return statusIcon(fallbackStatus);
}

export function IdsWizard({
  programme = "ids",
  mode = "inline",
  size = "large",
  title = "Wizard",
  steps,
  initialStepId,
  showCloseButton = true,
  isPrimaryEnabled = true,
  onCancel,
  onPrevious,
  onNext,
  onFinish,
  onStepChange,
  trigger,
}: IdsWizardProps) {
  const [currentStepId, setCurrentStepId] = useState<string | undefined>(initialStepId);
  const lastStepChangeKeyRef = useRef<string>("");
  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;
  const ctx = useMemo<IdsWizardContext>(() => ({ currentStepId }), [currentStepId]);

  const { display, leaves } = useMemo(() => flattenVisible(steps, ctx), [steps, ctx]);
  const visibleLeafIds = useMemo(() => leaves.map((leaf) => leaf.node.id).join("\0"), [leaves]);
  const totalTopLevelSteps = display.length;

  const notifyStepChange = (leaf: VisibleNode | undefined) => {
    if (!leaf) return;
    const payload = payloadFromNode(leaf);
    const key = `${payload.stepId}|${payload.stepCode}`;
    if (lastStepChangeKeyRef.current === key) return;
    lastStepChangeKeyRef.current = key;
    onStepChangeRef.current?.(payload);
  };

  useEffect(() => {
    if (leaves.length === 0) {
      if (currentStepId !== undefined) setCurrentStepId(undefined);
      return;
    }
    const hasCurrent = currentStepId != null && leaves.some((leaf) => leaf.node.id === currentStepId);
    if (hasCurrent) return;

    const requested = initialStepId ? leaves.find((leaf) => leaf.node.id === initialStepId) : undefined;
    const nextLeaf = requested ?? leaves[0];
    const nextId = nextLeaf.node.id;
    if (nextId !== currentStepId) {
      setCurrentStepId(nextId);
      notifyStepChange(nextLeaf);
    }
    // `leaves` is read when `visibleLeafIds` changes; avoid depending on array identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- leaves aligned with visibleLeafIds
  }, [initialStepId, currentStepId, visibleLeafIds]);

  const currentLeaf = leaves.find((leaf) => leaf.node.id === currentStepId);
  const currentIndex = currentLeaf ? leaves.findIndex((leaf) => leaf.node.id === currentLeaf.node.id) : -1;
  const isFirstLeaf = currentIndex <= 0;
  const isLastLeaf = currentIndex === leaves.length - 1 && currentIndex >= 0;

  const resolvedPrimaryEnabled =
    typeof isPrimaryEnabled === "function"
      ? isPrimaryEnabled(ctx)
      : isPrimaryEnabled;
  const primaryEnabled = resolvedPrimaryEnabled && !currentLeaf?.node.primaryDisabled;

  const footerOverrides = currentLeaf?.node.footerButtons;
  const showCancel = footerOverrides?.showCancel ?? true;
  const showPrevious = footerOverrides?.showPrevious ?? true;
  const primaryLabel = footerOverrides?.primaryLabel ?? (isLastLeaf ? "Finish" : "Next");

  const progressLabel =
    currentLeaf && totalTopLevelSteps > 0
      ? `Step ${toStepCode(currentLeaf.topLevelIndex, currentLeaf.childIndex)} of ${totalTopLevelSteps}`
      : `Step 0 of ${totalTopLevelSteps}`;

  /** Synapse programme chrome on footer actions applies in modal mode only (inline inherits IDS footer). */
  const useSynapseFooterButtons = programme === "synapse" && mode === "modal";

  const goToLeaf = (leaf: VisibleNode | undefined) => {
    if (!leaf) return;
    if (leaf.node.id === currentStepId) return;
    setCurrentStepId(leaf.node.id);
    notifyStepChange(leaf);
  };

  const shell = (
    <section className={[styles.root, styles[size], mode === "modal" ? styles.modalRoot : ""].join(" ")}>
      <header className={styles.header}>
        <h2 className={styles.headerTitle}>{title}</h2>
        {showCloseButton ? (
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close wizard"
            onClick={() => {
              if (currentLeaf) onCancel?.(payloadFromNode(currentLeaf));
            }}
          >
            <Icon shapeName="ctrl-close-16" className={styles.closeIcon} />
          </button>
        ) : null}
      </header>

      <div className={styles.body}>
        <nav className={styles.stepsPane} aria-label="Wizard steps">
          {display.map((group) => {
            const groupHasChildren = group.children.length > 0;
            const groupStatus = consolidatedStatus(group);
            const groupIcon = resolveStatusIcon(group.top.node, groupStatus);
            const topActive =
              currentLeaf &&
              ((groupHasChildren && currentLeaf.parentId === group.top.node.id) || (!groupHasChildren && currentLeaf.node.id === group.top.node.id));

            return (
              <div key={group.top.node.id}>
                <button
                  type="button"
                  className={[styles.stepItem, topActive ? styles.stepItemActive : ""].filter(Boolean).join(" ")}
                  onClick={() => goToLeaf(groupHasChildren ? group.children[0] : group.top)}
                  aria-current={topActive ? "step" : undefined}
                >
                  <span className={styles.stepLabel}>{group.top.node.label}</span>
                  {groupIcon ? <Icon shapeName={groupIcon} className={[styles.statusIcon, styles[`status${groupStatus}`]].join(" ")} /> : null}
                </button>

                {group.children.length > 0 ? (
                  <div className={styles.substepList}>
                    {group.children.map((child) => {
                      const active = currentLeaf?.node.id === child.node.id;
                      const icon = resolveStatusIcon(child.node, child.node.status ?? "none");
                      return (
                        <button
                          key={child.node.id}
                          type="button"
                          className={[styles.substepItem, active ? styles.substepItemActive : ""].filter(Boolean).join(" ")}
                          onClick={() => goToLeaf(child)}
                          aria-current={active ? "step" : undefined}
                        >
                          <span className={styles.stepLabel}>{child.node.label}</span>
                          {icon ? <Icon shapeName={icon} className={[styles.statusIcon, styles[`status${child.node.status ?? "none"}`]].join(" ")} /> : null}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <section className={styles.contentPane}>
          <div className={styles.pageTitleWrap}>
            <h3 className={styles.pageTitle}>{currentLeaf?.node.pageTitle ?? currentLeaf?.node.label ?? "Page"}</h3>
          </div>
          <div className={styles.pageContent}>
            <div className={styles.pageContentScroll}>
              {currentLeaf?.node.content ?? (
                <p className={styles.fallbackText}>No page content is defined for this step.</p>
              )}
            </div>
          </div>
          <footer className={styles.footer}>
            <span className={styles.progress}>{progressLabel}</span>
            <div className={styles.footerActions}>
              {showCancel ? (
                useSynapseFooterButtons ? (
                  <Button
                    programme="synapse"
                    size="lg"
                    variant="secondary"
                    onClick={() => {
                      if (currentLeaf) onCancel?.(payloadFromNode(currentLeaf));
                    }}
                  >
                    Cancel
                  </Button>
                ) : (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      if (currentLeaf) onCancel?.(payloadFromNode(currentLeaf));
                    }}
                  >
                    Cancel
                  </button>
                )
              ) : null}
              {showPrevious ? (
                useSynapseFooterButtons ? (
                  <Button
                    programme="synapse"
                    size="lg"
                    variant="secondary"
                    disabled={isFirstLeaf || !currentLeaf}
                    onClick={() => {
                      const prev = currentIndex > 0 ? leaves[currentIndex - 1] : undefined;
                      goToLeaf(prev);
                      if (prev) onPrevious?.(payloadFromNode(prev));
                    }}
                  >
                    Previous
                  </Button>
                ) : (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    disabled={isFirstLeaf || !currentLeaf}
                    onClick={() => {
                      const prev = currentIndex > 0 ? leaves[currentIndex - 1] : undefined;
                      goToLeaf(prev);
                      if (prev) onPrevious?.(payloadFromNode(prev));
                    }}
                  >
                    Previous
                  </button>
                )
              ) : null}
              {useSynapseFooterButtons ? (
                <Button
                  programme="synapse"
                  size="lg"
                  variant="primary"
                  disabled={!primaryEnabled || !currentLeaf}
                  onClick={() => {
                    if (!currentLeaf) return;
                    if (isLastLeaf || primaryLabel.toLowerCase() === "finish") {
                      onFinish?.(payloadFromNode(currentLeaf));
                      return;
                    }
                    const next = currentIndex >= 0 ? leaves[currentIndex + 1] : undefined;
                    goToLeaf(next);
                    if (next) onNext?.(payloadFromNode(next));
                  }}
                >
                  {primaryLabel}
                </Button>
              ) : (
                <button
                  type="button"
                  className={styles.primaryButton}
                  disabled={!primaryEnabled || !currentLeaf}
                  onClick={() => {
                    if (!currentLeaf) return;
                    if (isLastLeaf || primaryLabel.toLowerCase() === "finish") {
                      onFinish?.(payloadFromNode(currentLeaf));
                      return;
                    }
                    const next = currentIndex >= 0 ? leaves[currentIndex + 1] : undefined;
                    goToLeaf(next);
                    if (next) onNext?.(payloadFromNode(next));
                  }}
                >
                  {primaryLabel}
                </button>
              )}
            </div>
          </footer>
        </section>
      </div>
    </section>
  );

  if (mode === "modal") {
    const triggerElement = trigger ?? <button type="button">Open Wizard</button>;
    const triggerRender = isValidElement(triggerElement) ? triggerElement : undefined;
    return (
      <BaseDialog.Root>
        {triggerRender ? (
          <BaseDialog.Trigger className={styles.modalTriggerReset} render={triggerRender} />
        ) : (
          <BaseDialog.Trigger className={styles.modalTriggerReset}>{triggerElement}</BaseDialog.Trigger>
        )}
        <BaseDialog.Portal>
          <BaseDialog.Backdrop className={styles.backdrop} />
          <BaseDialog.Popup className={styles.modalPopup}>{shell}</BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    );
  }

  return shell;
}
