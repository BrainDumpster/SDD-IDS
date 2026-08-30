/**
 * IDS Wizard — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/wizard`
 * Source: `components/ids/wizard/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (main = Wizard, not WizardRoot):
 *   IdsWizard
 *     IdsWizardHeader
 *       IdsWizardHeaderTitle
 *       IdsWizardCloseAction?
 *     IdsWizardBody
 *       IdsWizardStepsPane
 *         IdsWizardStepItem[]
 *           IdsWizardStepLabel
 *           IdsWizardStepStatusIndicator?
 *           IdsWizardSubstepList?
 *             IdsWizardSubstepItem[]
 *               IdsWizardStepLabel
 *               IdsWizardStepStatusIndicator?
 *       IdsWizardContentPane
 *         IdsWizardPageTitle
 *         IdsWizardPageContent
 *         IdsWizardFooter
 *           IdsWizardProgressLabel
 *           IdsWizardFooterActions
 *             IdsWizardCancelButton?
 *             IdsWizardPreviousButton?
 *             IdsWizardPrimaryButton
 *
 * Prop-driven `steps` builds the same deterministic tree.
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { IdsIcon } from "../icon";
import styles from "./IdsWizard.module.css";

/* -------------------------------------------------------------------------- */
/* Types (Composition & API)                                                  */
/* -------------------------------------------------------------------------- */

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

export interface IdsWizardStepInput {
  id: string;
  label: string;
  pageTitle?: string;
  /** Required for leaf steps; optional for parent steps with children. */
  content?: ReactNode;
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

export interface IdsWizardProps {
  mode?: IdsWizardMode;
  size?: IdsWizardSize;
  title: string;
  steps: IdsWizardStepInput[];
  initialStepId?: string;
  showCloseButton?: boolean;
  isPrimaryEnabled?: boolean | ((ctx: IdsWizardContext) => boolean);
  onCancel?: (event: IdsWizardEventPayload) => void;
  onPrevious?: (event: IdsWizardEventPayload) => void;
  onNext?: (event: IdsWizardEventPayload) => void;
  onFinish?: (event: IdsWizardEventPayload) => void;
  onStepChange?: (event: IdsWizardEventPayload) => void;
  /** Optional compound projection; when anatomy slots are provided, they replace prop chrome. */
  children?: ReactNode;
  className?: string;
  id?: string;
}

/* -------------------------------------------------------------------------- */
/* Slot markers                                                               */
/* -------------------------------------------------------------------------- */

const SLOT = Symbol.for("ids.wizard.slot");

type SlotName =
  | "header"
  | "header-title"
  | "close-action"
  | "body"
  | "steps-pane"
  | "step-item"
  | "step-label"
  | "step-status-indicator"
  | "substep-list"
  | "substep-item"
  | "content-pane"
  | "page-title"
  | "page-content"
  | "footer"
  | "progress-label"
  | "footer-actions"
  | "cancel-button"
  | "previous-button"
  | "primary-button";

function getSlot(type: unknown): SlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [SLOT]?: SlotName })[SLOT];
}

function markSlot<T>(fn: T, name: SlotName): T {
  (fn as { [SLOT]?: SlotName })[SLOT] = name;
  return fn;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function hasCompoundSlots(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const slot = getSlot(child.type);
    if (slot === "header" || slot === "body") found = true;
  });
  return found;
}

/* -------------------------------------------------------------------------- */
/* Navigation helpers                                                         */
/* -------------------------------------------------------------------------- */

interface VisibleNode {
  node: IdsWizardStepInput;
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
  return `${topLevelIndex + 1}${String.fromCharCode("a".charCodeAt(0) + childIndex)}`;
}

function resolveVisible(step: IdsWizardStepInput, ctx: IdsWizardContext): boolean {
  if (typeof step.isVisible === "function") return step.isVisible(ctx);
  if (typeof step.isVisible === "boolean") return step.isVisible;
  return true;
}

function flattenVisible(
  steps: IdsWizardStepInput[],
  ctx: IdsWizardContext,
): { display: DisplayStep[]; leaves: VisibleNode[] } {
  const display: DisplayStep[] = [];
  const leaves: VisibleNode[] = [];

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

    const topNode: VisibleNode = { node: topStep, topLevelIndex: topIndex };
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

function defaultStatusIcon(status: IdsWizardStepStatus): string | undefined {
  if (status === "success") return "shape-check";
  if (status === "warning") return "status-warn-tri-solid-16";
  if (status === "error") return "status-error-diamond-solid";
  return undefined;
}

function resolveStatusIcon(
  step: IdsWizardStepInput,
  fallbackStatus: IdsWizardStepStatus,
): string | undefined {
  if (step.statusIconSlug === null) return undefined;
  const explicit =
    typeof step.statusIconSlug === "string" ? step.statusIconSlug.trim() : "";
  if (explicit) return explicit;
  return defaultStatusIcon(fallbackStatus);
}

function resolveMode(value: unknown): IdsWizardMode {
  return value === "modal" ? "modal" : "inline";
}

function resolveSize(value: unknown): IdsWizardSize {
  if (value === "medium" || value === "x-large" || value === "full-screen") {
    return value;
  }
  return "large";
}

/* -------------------------------------------------------------------------- */
/* Runtime context                                                            */
/* -------------------------------------------------------------------------- */

interface IdsWizardRuntimeContextValue {
  mode: IdsWizardMode;
  titleId: string;
  currentPayload: IdsWizardEventPayload | null;
  cancel: () => void;
  goPrevious: () => void;
  goNextOrFinish: () => void;
  isFirstLeaf: boolean;
  isLastLeaf: boolean;
  primaryEnabled: boolean;
  progressLabel: string;
  primaryLabel: string;
  showCancel: boolean;
  showPrevious: boolean;
}

const IdsWizardRuntimeContext =
  createContext<IdsWizardRuntimeContextValue | null>(null);

function useWizardRuntime(slot: string): IdsWizardRuntimeContextValue {
  const ctx = useContext(IdsWizardRuntimeContext);
  if (!ctx) throw new Error(`${slot} must be used within IdsWizard`);
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Anatomy slots                                                              */
/* -------------------------------------------------------------------------- */

export interface IdsWizardHeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function IdsWizardHeader({
  children,
  className,
  ...rest
}: IdsWizardHeaderProps) {
  useWizardRuntime("IdsWizardHeader");
  return (
    <header
      className={cx(styles["ids-wizard-header"], className)}
      data-ids="ids-wizard-header"
      {...rest}
    >
      {children}
    </header>
  );
}
IdsWizardHeader.displayName = "IdsWizardHeader";
markSlot(IdsWizardHeader, "header");

export interface IdsWizardHeaderTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

export function IdsWizardHeaderTitle({
  children,
  className,
  id,
  ...rest
}: IdsWizardHeaderTitleProps) {
  const { titleId } = useWizardRuntime("IdsWizardHeaderTitle");
  return (
    <h2
      id={id ?? titleId}
      className={cx(styles["ids-wizard-header-title"], className)}
      data-ids="ids-wizard-header-title"
      {...rest}
    >
      {children}
    </h2>
  );
}
IdsWizardHeaderTitle.displayName = "IdsWizardHeaderTitle";
markSlot(IdsWizardHeaderTitle, "header-title");

export interface IdsWizardCloseActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function IdsWizardCloseAction({
  children,
  className,
  onClick,
  ...rest
}: IdsWizardCloseActionProps) {
  const { cancel } = useWizardRuntime("IdsWizardCloseAction");
  return (
    <button
      type="button"
      className={cx(styles["ids-wizard-close-action"], className)}
      data-ids="ids-wizard-close-action"
      aria-label="Close wizard"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) cancel();
      }}
      {...rest}
    >
      {children ?? (
        <IdsIcon shape="ctrl-close-16" size={16} color="currentColor" />
      )}
    </button>
  );
}
IdsWizardCloseAction.displayName = "IdsWizardCloseAction";
markSlot(IdsWizardCloseAction, "close-action");

export interface IdsWizardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsWizardBody({
  children,
  className,
  ...rest
}: IdsWizardBodyProps) {
  useWizardRuntime("IdsWizardBody");
  return (
    <div
      className={cx(styles["ids-wizard-body"], className)}
      data-ids="ids-wizard-body"
      {...rest}
    >
      {children}
    </div>
  );
}
IdsWizardBody.displayName = "IdsWizardBody";
markSlot(IdsWizardBody, "body");

export interface IdsWizardStepsPaneProps
  extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function IdsWizardStepsPane({
  children,
  className,
  ...rest
}: IdsWizardStepsPaneProps) {
  useWizardRuntime("IdsWizardStepsPane");
  return (
    <nav
      className={cx(styles["ids-wizard-steps-pane"], className)}
      data-ids="ids-wizard-steps-pane"
      aria-label="Wizard steps"
      role="tree"
      {...rest}
    >
      {children}
    </nav>
  );
}
IdsWizardStepsPane.displayName = "IdsWizardStepsPane";
markSlot(IdsWizardStepsPane, "steps-pane");

export interface IdsWizardStepItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  active?: boolean;
  status?: IdsWizardStepStatus;
}

export function IdsWizardStepItem({
  children,
  className,
  active = false,
  status = "none",
  ...rest
}: IdsWizardStepItemProps) {
  return (
    <button
      type="button"
      role="treeitem"
      className={cx(styles["ids-wizard-step-item"], className)}
      data-ids="ids-wizard-step-item"
      data-active={active ? "true" : undefined}
      data-status={status === "none" ? undefined : status}
      aria-current={active ? "step" : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}
IdsWizardStepItem.displayName = "IdsWizardStepItem";
markSlot(IdsWizardStepItem, "step-item");

export interface IdsWizardStepLabelProps
  extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

export function IdsWizardStepLabel({
  children,
  className,
  ...rest
}: IdsWizardStepLabelProps) {
  return (
    <span
      className={cx(styles["ids-wizard-step-label"], className)}
      data-ids="ids-wizard-step-label"
      {...rest}
    >
      {children}
    </span>
  );
}
IdsWizardStepLabel.displayName = "IdsWizardStepLabel";
markSlot(IdsWizardStepLabel, "step-label");

export interface IdsWizardStepStatusIndicatorProps
  extends HTMLAttributes<HTMLSpanElement> {
  status?: IdsWizardStepStatus;
  shape?: string;
}

export function IdsWizardStepStatusIndicator({
  status = "none",
  shape,
  className,
  ...rest
}: IdsWizardStepStatusIndicatorProps) {
  if (!shape || status === "none") return null;
  return (
    <span
      className={cx(styles["ids-wizard-step-status-indicator"], className)}
      data-ids="ids-wizard-step-status-indicator"
      data-status={status}
      aria-hidden="true"
      {...rest}
    >
      <IdsIcon shape={shape} size={16} color="currentColor" />
    </span>
  );
}
IdsWizardStepStatusIndicator.displayName = "IdsWizardStepStatusIndicator";
markSlot(IdsWizardStepStatusIndicator, "step-status-indicator");

export interface IdsWizardSubstepListProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsWizardSubstepList({
  children,
  className,
  ...rest
}: IdsWizardSubstepListProps) {
  return (
    <div
      className={cx(styles["ids-wizard-substep-list"], className)}
      data-ids="ids-wizard-substep-list"
      role="group"
      {...rest}
    >
      {children}
    </div>
  );
}
IdsWizardSubstepList.displayName = "IdsWizardSubstepList";
markSlot(IdsWizardSubstepList, "substep-list");

export interface IdsWizardSubstepItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  active?: boolean;
  status?: IdsWizardStepStatus;
}

export function IdsWizardSubstepItem({
  children,
  className,
  active = false,
  status = "none",
  ...rest
}: IdsWizardSubstepItemProps) {
  return (
    <button
      type="button"
      role="treeitem"
      className={cx(styles["ids-wizard-substep-item"], className)}
      data-ids="ids-wizard-substep-item"
      data-active={active ? "true" : undefined}
      data-status={status === "none" ? undefined : status}
      aria-current={active ? "step" : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}
IdsWizardSubstepItem.displayName = "IdsWizardSubstepItem";
markSlot(IdsWizardSubstepItem, "substep-item");

export interface IdsWizardContentPaneProps
  extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function IdsWizardContentPane({
  children,
  className,
  ...rest
}: IdsWizardContentPaneProps) {
  useWizardRuntime("IdsWizardContentPane");
  return (
    <section
      className={cx(styles["ids-wizard-content-pane"], className)}
      data-ids="ids-wizard-content-pane"
      {...rest}
    >
      {children}
    </section>
  );
}
IdsWizardContentPane.displayName = "IdsWizardContentPane";
markSlot(IdsWizardContentPane, "content-pane");

export interface IdsWizardPageTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

export function IdsWizardPageTitle({
  children,
  className,
  ...rest
}: IdsWizardPageTitleProps) {
  return (
    <h3
      className={cx(styles["ids-wizard-page-title"], className)}
      data-ids="ids-wizard-page-title"
      {...rest}
    >
      {children}
    </h3>
  );
}
IdsWizardPageTitle.displayName = "IdsWizardPageTitle";
markSlot(IdsWizardPageTitle, "page-title");

export interface IdsWizardPageContentProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsWizardPageContent({
  children,
  className,
  ...rest
}: IdsWizardPageContentProps) {
  return (
    <div
      className={cx(styles["ids-wizard-page-content"], className)}
      data-ids="ids-wizard-page-content"
      {...rest}
    >
      {children}
    </div>
  );
}
IdsWizardPageContent.displayName = "IdsWizardPageContent";
markSlot(IdsWizardPageContent, "page-content");

export interface IdsWizardFooterProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function IdsWizardFooter({
  children,
  className,
  ...rest
}: IdsWizardFooterProps) {
  useWizardRuntime("IdsWizardFooter");
  return (
    <footer
      className={cx(styles["ids-wizard-footer"], className)}
      data-ids="ids-wizard-footer"
      {...rest}
    >
      {children}
    </footer>
  );
}
IdsWizardFooter.displayName = "IdsWizardFooter";
markSlot(IdsWizardFooter, "footer");

export interface IdsWizardProgressLabelProps
  extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

export function IdsWizardProgressLabel({
  children,
  className,
  ...rest
}: IdsWizardProgressLabelProps) {
  const { progressLabel } = useWizardRuntime("IdsWizardProgressLabel");
  return (
    <span
      className={cx(styles["ids-wizard-progress-label"], className)}
      data-ids="ids-wizard-progress-label"
      {...rest}
    >
      {children ?? progressLabel}
    </span>
  );
}
IdsWizardProgressLabel.displayName = "IdsWizardProgressLabel";
markSlot(IdsWizardProgressLabel, "progress-label");

export interface IdsWizardFooterActionsProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsWizardFooterActions({
  children,
  className,
  ...rest
}: IdsWizardFooterActionsProps) {
  return (
    <div
      className={cx(styles["ids-wizard-footer-actions"], className)}
      data-ids="ids-wizard-footer-actions"
      {...rest}
    >
      {children}
    </div>
  );
}
IdsWizardFooterActions.displayName = "IdsWizardFooterActions";
markSlot(IdsWizardFooterActions, "footer-actions");

export interface IdsWizardCancelButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function IdsWizardCancelButton({
  children,
  className,
  onClick,
  ...rest
}: IdsWizardCancelButtonProps) {
  const { cancel } = useWizardRuntime("IdsWizardCancelButton");
  return (
    <button
      type="button"
      className={cx(styles["ids-wizard-cancel-button"], className)}
      data-ids="ids-wizard-cancel-button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) cancel();
      }}
      {...rest}
    >
      {children ?? "Cancel"}
    </button>
  );
}
IdsWizardCancelButton.displayName = "IdsWizardCancelButton";
markSlot(IdsWizardCancelButton, "cancel-button");

export interface IdsWizardPreviousButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function IdsWizardPreviousButton({
  children,
  className,
  onClick,
  disabled,
  ...rest
}: IdsWizardPreviousButtonProps) {
  const { goPrevious, isFirstLeaf } = useWizardRuntime("IdsWizardPreviousButton");
  return (
    <button
      type="button"
      className={cx(styles["ids-wizard-previous-button"], className)}
      data-ids="ids-wizard-previous-button"
      disabled={disabled ?? isFirstLeaf}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) goPrevious();
      }}
      {...rest}
    >
      {children ?? "Previous"}
    </button>
  );
}
IdsWizardPreviousButton.displayName = "IdsWizardPreviousButton";
markSlot(IdsWizardPreviousButton, "previous-button");

export interface IdsWizardPrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function IdsWizardPrimaryButton({
  children,
  className,
  onClick,
  disabled,
  ...rest
}: IdsWizardPrimaryButtonProps) {
  const { goNextOrFinish, primaryEnabled, primaryLabel } =
    useWizardRuntime("IdsWizardPrimaryButton");
  return (
    <button
      type="button"
      className={cx(styles["ids-wizard-primary-button"], className)}
      data-ids="ids-wizard-primary-button"
      disabled={disabled ?? !primaryEnabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) goNextOrFinish();
      }}
      {...rest}
    >
      {children ?? primaryLabel}
    </button>
  );
}
IdsWizardPrimaryButton.displayName = "IdsWizardPrimaryButton";
markSlot(IdsWizardPrimaryButton, "primary-button");

/* -------------------------------------------------------------------------- */
/* Prop-driven anatomy builder                                                */
/* -------------------------------------------------------------------------- */

function buildPropDrivenTree(args: {
  title: string;
  showCloseButton: boolean;
  mode: IdsWizardMode;
  display: DisplayStep[];
  currentLeaf: VisibleNode | undefined;
  goToLeaf: (leaf: VisibleNode | undefined) => void;
}): ReactElement {
  const { title, showCloseButton, mode, display, currentLeaf, goToLeaf } = args;
  const showClose = mode === "modal" ? true : showCloseButton;

  return (
    <>
      <IdsWizardHeader>
        <IdsWizardHeaderTitle>{title}</IdsWizardHeaderTitle>
        {showClose ? <IdsWizardCloseAction /> : null}
      </IdsWizardHeader>

      <IdsWizardBody>
        <IdsWizardStepsPane>
          {display.map((group) => {
            const groupHasChildren = group.children.length > 0;
            const groupStatus = consolidatedStatus(group);
            const groupIcon = resolveStatusIcon(group.top.node, groupStatus);
            const topActive = Boolean(
              currentLeaf &&
                ((groupHasChildren &&
                  currentLeaf.parentId === group.top.node.id) ||
                  (!groupHasChildren &&
                    currentLeaf.node.id === group.top.node.id)),
            );
            const leafStatus =
              groupHasChildren
                ? groupStatus
                : (group.top.node.status ?? "none");

            return (
              <div key={group.top.node.id} role="none">
                <IdsWizardStepItem
                  active={topActive}
                  status={leafStatus}
                  onClick={() =>
                    goToLeaf(
                      groupHasChildren ? group.children[0] : group.top,
                    )
                  }
                >
                  <IdsWizardStepLabel>
                    {group.top.node.label}
                  </IdsWizardStepLabel>
                  <IdsWizardStepStatusIndicator
                    status={groupStatus}
                    shape={groupIcon}
                  />
                </IdsWizardStepItem>

                {groupHasChildren ? (
                  <IdsWizardSubstepList>
                    {group.children.map((child) => {
                      const active = currentLeaf?.node.id === child.node.id;
                      const childStatus = child.node.status ?? "none";
                      const icon = resolveStatusIcon(child.node, childStatus);
                      return (
                        <IdsWizardSubstepItem
                          key={child.node.id}
                          active={active}
                          status={childStatus}
                          onClick={() => goToLeaf(child)}
                        >
                          <IdsWizardStepLabel>
                            {child.node.label}
                          </IdsWizardStepLabel>
                          <IdsWizardStepStatusIndicator
                            status={childStatus}
                            shape={icon}
                          />
                        </IdsWizardSubstepItem>
                      );
                    })}
                  </IdsWizardSubstepList>
                ) : null}
              </div>
            );
          })}
        </IdsWizardStepsPane>

        <IdsWizardContentPane>
          <IdsWizardPageTitle>
            {currentLeaf?.node.pageTitle ??
              currentLeaf?.node.label ??
              "Page"}
          </IdsWizardPageTitle>
          <IdsWizardPageContent>
            {currentLeaf?.node.content ?? (
              <p className={styles["ids-wizard-page-content-fallback"]}>
                No page content is defined for this step.
              </p>
            )}
          </IdsWizardPageContent>
          <IdsWizardFooter>
            <IdsWizardProgressLabel />
            <IdsWizardFooterActions>
              <DefaultFooterButtons />
            </IdsWizardFooterActions>
          </IdsWizardFooter>
        </IdsWizardContentPane>
      </IdsWizardBody>
    </>
  );
}

function DefaultFooterButtons(): ReactElement {
  const { showCancel, showPrevious } = useWizardRuntime("DefaultFooterButtons");
  return (
    <>
      {showCancel ? <IdsWizardCancelButton /> : null}
      {showPrevious ? <IdsWizardPreviousButton /> : null}
      <IdsWizardPrimaryButton />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Root — Wizard (IdsWizard)                                                  */
/* -------------------------------------------------------------------------- */

export function IdsWizard({
  mode: modeProp,
  size: sizeProp,
  title,
  steps,
  initialStepId,
  showCloseButton = true,
  isPrimaryEnabled = true,
  onCancel,
  onPrevious,
  onNext,
  onFinish,
  onStepChange,
  children,
  className,
  id: idProp,
}: IdsWizardProps) {
  const mode = resolveMode(modeProp);
  const size = resolveSize(sizeProp);
  const compound = hasCompoundSlots(children);

  const reactId = useId();
  const rootId = idProp ?? `ids-wizard-${reactId}`;
  const titleId = `${rootId}-title`;

  const [currentStepId, setCurrentStepId] = useState<string | undefined>(
    initialStepId,
  );
  const lastStepChangeKeyRef = useRef("");
  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  const wizardCtx = useMemo<IdsWizardContext>(
    () => ({ currentStepId }),
    [currentStepId],
  );

  const { display, leaves } = useMemo(
    () => flattenVisible(steps, wizardCtx),
    [steps, wizardCtx],
  );
  const visibleLeafIds = useMemo(
    () => leaves.map((leaf) => leaf.node.id).join("\0"),
    [leaves],
  );
  const totalTopLevelSteps = display.length;

  const notifyStepChange = useCallback((leaf: VisibleNode | undefined) => {
    if (!leaf) return;
    const payload = payloadFromNode(leaf);
    const key = `${payload.stepId}|${payload.stepCode}`;
    if (lastStepChangeKeyRef.current === key) return;
    lastStepChangeKeyRef.current = key;
    onStepChangeRef.current?.(payload);
  }, []);

  useEffect(() => {
    if (leaves.length === 0) {
      if (currentStepId !== undefined) setCurrentStepId(undefined);
      return;
    }
    const hasCurrent =
      currentStepId != null &&
      leaves.some((leaf) => leaf.node.id === currentStepId);
    if (hasCurrent) return;

    const requested = initialStepId
      ? leaves.find((leaf) => leaf.node.id === initialStepId)
      : undefined;
    const nextLeaf = requested ?? leaves[0];
    if (nextLeaf.node.id !== currentStepId) {
      setCurrentStepId(nextLeaf.node.id);
      notifyStepChange(nextLeaf);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- leaves aligned with visibleLeafIds
  }, [initialStepId, currentStepId, visibleLeafIds, notifyStepChange]);

  const currentLeaf = leaves.find((leaf) => leaf.node.id === currentStepId);
  const currentIndex = currentLeaf
    ? leaves.findIndex((leaf) => leaf.node.id === currentLeaf.node.id)
    : -1;
  const isFirstLeaf = currentIndex <= 0;
  const isLastLeaf = currentIndex === leaves.length - 1 && currentIndex >= 0;

  const resolvedPrimaryEnabled =
    typeof isPrimaryEnabled === "function"
      ? isPrimaryEnabled(wizardCtx)
      : isPrimaryEnabled;
  const primaryEnabled = Boolean(resolvedPrimaryEnabled && currentLeaf);

  const footerOverrides = currentLeaf?.node.footerButtons;
  const showCancel = footerOverrides?.showCancel ?? true;
  const showPrevious = footerOverrides?.showPrevious ?? true;
  const primaryLabel =
    footerOverrides?.primaryLabel ?? (isLastLeaf ? "Finish" : "Next");

  const progressLabel =
    currentLeaf && totalTopLevelSteps > 0
      ? `Step ${toStepCode(currentLeaf.topLevelIndex, currentLeaf.childIndex)} of ${totalTopLevelSteps}`
      : `Step 0 of ${totalTopLevelSteps}`;

  const goToLeaf = useCallback(
    (leaf: VisibleNode | undefined) => {
      if (!leaf) return;
      if (leaf.node.id === currentStepId) return;
      setCurrentStepId(leaf.node.id);
      notifyStepChange(leaf);
    },
    [currentStepId, notifyStepChange],
  );

  const currentPayload = currentLeaf ? payloadFromNode(currentLeaf) : null;

  const cancel = useCallback(() => {
    if (currentPayload) onCancel?.(currentPayload);
  }, [currentPayload, onCancel]);

  const goPrevious = useCallback(() => {
    if (currentIndex <= 0) return;
    const prev = leaves[currentIndex - 1];
    goToLeaf(prev);
    if (prev) onPrevious?.(payloadFromNode(prev));
  }, [currentIndex, leaves, goToLeaf, onPrevious]);

  const goNextOrFinish = useCallback(() => {
    if (!currentLeaf || !currentPayload) return;
    const label = String(primaryLabel).toLowerCase();
    if (isLastLeaf || label === "finish") {
      onFinish?.(currentPayload);
      return;
    }
    const next = leaves[currentIndex + 1];
    goToLeaf(next);
    if (next) onNext?.(payloadFromNode(next));
  }, [
    currentLeaf,
    currentPayload,
    primaryLabel,
    isLastLeaf,
    leaves,
    currentIndex,
    goToLeaf,
    onFinish,
    onNext,
  ]);

  const runtime = useMemo<IdsWizardRuntimeContextValue>(
    () => ({
      mode,
      titleId,
      currentPayload,
      cancel,
      goPrevious,
      goNextOrFinish,
      isFirstLeaf,
      isLastLeaf,
      primaryEnabled,
      progressLabel,
      primaryLabel,
      showCancel,
      showPrevious,
    }),
    [
      mode,
      titleId,
      currentPayload,
      cancel,
      goPrevious,
      goNextOrFinish,
      isFirstLeaf,
      isLastLeaf,
      primaryEnabled,
      progressLabel,
      primaryLabel,
      showCancel,
      showPrevious,
    ],
  );

  const sizeClass =
    size === "medium"
      ? styles["ids-wizard--medium"]
      : size === "x-large"
        ? styles["ids-wizard--x-large"]
        : size === "full-screen"
          ? styles["ids-wizard--full-screen"]
          : styles["ids-wizard--large"];

  const shell = (
    <IdsWizardRuntimeContext.Provider value={runtime}>
      <section
        id={rootId}
        className={cx(
          styles["ids-wizard"],
          sizeClass,
          mode === "modal" && styles["ids-wizard--modal"],
          className,
        )}
        data-ids="ids-wizard"
        data-mode={mode}
        data-size={size}
        role={mode === "modal" ? "dialog" : "region"}
        aria-modal={mode === "modal" ? true : undefined}
        aria-labelledby={titleId}
      >
        {compound
          ? children
          : buildPropDrivenTree({
              title,
              showCloseButton,
              mode,
              display,
              currentLeaf,
              goToLeaf,
            })}
      </section>
    </IdsWizardRuntimeContext.Provider>
  );

  if (mode === "modal" && typeof document !== "undefined") {
    return createPortal(
      <div
        className={styles["ids-wizard-overlay"]}
        data-ids="ids-wizard-overlay"
      >
        {shell}
      </div>,
      document.body,
    );
  }

  return shell;
}

IdsWizard.displayName = "IdsWizard";

/**
 * Optional namespace for anatomy slots. Not assigned onto `IdsWizard` —
 * mutating the root with 18 statics makes Storybook docs/controls
 * (`prettyPrint2`) hit Maximum call stack size exceeded.
 */
export const IdsWizardCompound = {
  Root: IdsWizard,
  Header: IdsWizardHeader,
  HeaderTitle: IdsWizardHeaderTitle,
  CloseAction: IdsWizardCloseAction,
  Body: IdsWizardBody,
  StepsPane: IdsWizardStepsPane,
  StepItem: IdsWizardStepItem,
  StepLabel: IdsWizardStepLabel,
  StepStatusIndicator: IdsWizardStepStatusIndicator,
  SubstepList: IdsWizardSubstepList,
  SubstepItem: IdsWizardSubstepItem,
  ContentPane: IdsWizardContentPane,
  PageTitle: IdsWizardPageTitle,
  PageContent: IdsWizardPageContent,
  Footer: IdsWizardFooter,
  ProgressLabel: IdsWizardProgressLabel,
  FooterActions: IdsWizardFooterActions,
  CancelButton: IdsWizardCancelButton,
  PreviousButton: IdsWizardPreviousButton,
  PrimaryButton: IdsWizardPrimaryButton,
} as const;

export default IdsWizard;
