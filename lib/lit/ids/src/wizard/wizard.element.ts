/**
 * IdsWizard — Lit web component root.
 *
 * Tag: `ids-wizard`
 * Spec: `components/ids/wizard/design-spec.md`
 * API: `lib/react/ids/wizard` (`IdsWizard` prop + compound composition)
 *
 * Anatomy:
 *   ids-wizard
 *     ids-wizard-header (title + close?)
 *     ids-wizard-body
 *       ids-wizard-steps-pane → step / substep items
 *       ids-wizard-content-pane → page title + content + footer
 *
 * Events (detail: IdsWizardEventPayload unless noted):
 *   cancel / onCancel
 *   previous / onPrevious
 *   next / onNext
 *   finish / onFinish
 *   step-change / onStepChange
 *
 * Live Figma (MCP 2026-11-13): WizardInline-Main `12690:246134`,
 * sample `12690:246164`.
 */
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import "../icon/register.js";
import {
  WIZARD_API_DEFAULTS,
  WIZARD_CLOSE_ICON_SLUG,
  WIZARD_COMPOUND_TAGS,
  WIZARD_EXPAND_ICON_SLUG,
  consolidatedStatus,
  flattenVisible,
  payloadFromNode,
  resolveWizardMode,
  resolveWizardSize,
  resolveStatusIcon,
  toStepCode,
  type IdsWizardContext,
  type IdsWizardDisplayStep,
  type IdsWizardEventPayload,
  type IdsWizardMode,
  type IdsWizardSize,
  type IdsWizardStepContent,
  type IdsWizardStepInput,
  type IdsWizardStepStatus,
  type IdsWizardVisibleNode,
} from "./wizard.constants.js";
import { wizardHostStyles, wizardStyles } from "./wizard.styles.js";

let wizardUid = 0;

function isTemplateResult(value: unknown): value is TemplateResult {
  return Boolean(value && typeof value === "object" && "_$litType$" in (value as object));
}

export class IdsWizard extends LitElement {
  static override styles = [wizardHostStyles, wizardStyles];

  private readonly instanceId = `ids-wizard-${++wizardUid}`;

  @property({ type: String, reflect: true })
  mode: IdsWizardMode | string = WIZARD_API_DEFAULTS.mode;

  @property({ type: String, reflect: true })
  size: IdsWizardSize | string = WIZARD_API_DEFAULTS.size;

  /** Avoid reflecting onto the native HTML `title` tooltip attribute. */
  @property({ type: String, attribute: "wizardtitle" })
  title = WIZARD_API_DEFAULTS.title;

  @property({ attribute: false })
  steps: IdsWizardStepInput[] = [];

  @property({ type: String, attribute: "initialstepid" })
  initialStepId: string | undefined = undefined;

  @property({ attribute: false })
  showCloseButton = WIZARD_API_DEFAULTS.showCloseButton;

  @property({ attribute: false })
  isPrimaryEnabled:
    | boolean
    | ((ctx: IdsWizardContext) => boolean) = WIZARD_API_DEFAULTS.isPrimaryEnabled;

  /** React API parity callbacks. */
  @property({ attribute: false })
  onCancel?: (event: IdsWizardEventPayload) => void;

  @property({ attribute: false })
  onPrevious?: (event: IdsWizardEventPayload) => void;

  @property({ attribute: false })
  onNext?: (event: IdsWizardEventPayload) => void;

  @property({ attribute: false })
  onFinish?: (event: IdsWizardEventPayload) => void;

  @property({ attribute: false })
  onStepChange?: (event: IdsWizardEventPayload) => void;

  @state()
  private currentStepId: string | undefined = undefined;

  @state()
  private hasCompoundSlots = false;

  private lastStepChangeKey = "";
  private childObserver?: MutationObserver;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard");
    if (!this.id) this.id = this.instanceId;
    this.detectCompoundSlots();
    this.childObserver = new MutationObserver(() => this.detectCompoundSlots());
    this.childObserver.observe(this, { childList: true });
    this.syncCurrentLeaf();
  }

  override disconnectedCallback(): void {
    this.childObserver?.disconnect();
    super.disconnectedCallback();
  }

  override updated(changed: Map<string, unknown>): void {
    if (
      changed.has("steps") ||
      changed.has("initialStepId") ||
      changed.has("mode") ||
      changed.has("size")
    ) {
      this.syncCurrentLeaf();
    }
    this.setAttribute("data-mode", this.resolvedMode);
    this.setAttribute("data-size", this.resolvedSize);
  }

  get rootId(): string {
    return this.id || this.instanceId;
  }

  get titleId(): string {
    return `${this.rootId}-title`;
  }

  get resolvedMode(): IdsWizardMode {
    return resolveWizardMode(this.mode);
  }

  get resolvedSize(): IdsWizardSize {
    return resolveWizardSize(this.size);
  }

  get wizardCtx(): IdsWizardContext {
    return { currentStepId: this.currentStepId };
  }

  get display(): IdsWizardDisplayStep[] {
    return flattenVisible(this.steps ?? [], this.wizardCtx).display;
  }

  get leaves(): IdsWizardVisibleNode[] {
    return flattenVisible(this.steps ?? [], this.wizardCtx).leaves;
  }

  get currentLeaf(): IdsWizardVisibleNode | undefined {
    return this.leaves.find((leaf) => leaf.node.id === this.currentStepId);
  }

  get currentIndex(): number {
    const leaf = this.currentLeaf;
    if (!leaf) return -1;
    return this.leaves.findIndex((item) => item.node.id === leaf.node.id);
  }

  get isFirstLeaf(): boolean {
    return this.currentIndex <= 0;
  }

  get isLastLeaf(): boolean {
    return this.currentIndex === this.leaves.length - 1 && this.currentIndex >= 0;
  }

  get currentPayload(): IdsWizardEventPayload | null {
    return this.currentLeaf ? payloadFromNode(this.currentLeaf) : null;
  }

  get primaryEnabled(): boolean {
    const resolved =
      typeof this.isPrimaryEnabled === "function"
        ? this.isPrimaryEnabled(this.wizardCtx)
        : this.isPrimaryEnabled;
    return Boolean(resolved && this.currentLeaf);
  }

  get showCancel(): boolean {
    return this.currentLeaf?.node.footerButtons?.showCancel ?? true;
  }

  get showPrevious(): boolean {
    return this.currentLeaf?.node.footerButtons?.showPrevious ?? true;
  }

  get primaryLabel(): string {
    return (
      this.currentLeaf?.node.footerButtons?.primaryLabel ??
      (this.isLastLeaf ? "Finish" : "Next")
    );
  }

  get progressLabel(): string {
    const total = this.display.length;
    const leaf = this.currentLeaf;
    if (leaf && total > 0) {
      return `Step ${toStepCode(leaf.topLevelIndex, leaf.childIndex)} of ${total}`;
    }
    return `Step 0 of ${total}`;
  }

  get showClose(): boolean {
    return this.resolvedMode === "modal" ? true : this.showCloseButton;
  }

  get pageTitle(): string {
    return (
      this.currentLeaf?.node.pageTitle ??
      this.currentLeaf?.node.label ??
      "Page"
    );
  }

  cancel(): void {
    const payload = this.currentPayload;
    if (!payload) return;
    this.onCancel?.(payload);
    this.emitWizardEvent("cancel", payload);
    this.emitWizardEvent("onCancel", payload);
  }

  goPrevious(): void {
    if (this.currentIndex <= 0) return;
    const prev = this.leaves[this.currentIndex - 1];
    this.goToLeaf(prev);
    if (prev) {
      const payload = payloadFromNode(prev);
      this.onPrevious?.(payload);
      this.emitWizardEvent("previous", payload);
      this.emitWizardEvent("onPrevious", payload);
    }
  }

  goNextOrFinish(): void {
    const leaf = this.currentLeaf;
    const payload = this.currentPayload;
    if (!leaf || !payload) return;
    const label = String(this.primaryLabel).toLowerCase();
    if (this.isLastLeaf || label === "finish") {
      this.onFinish?.(payload);
      this.emitWizardEvent("finish", payload);
      this.emitWizardEvent("onFinish", payload);
      return;
    }
    const next = this.leaves[this.currentIndex + 1];
    this.goToLeaf(next);
    if (next) {
      const nextPayload = payloadFromNode(next);
      this.onNext?.(nextPayload);
      this.emitWizardEvent("next", nextPayload);
      this.emitWizardEvent("onNext", nextPayload);
    }
  }

  goToLeaf(leaf: IdsWizardVisibleNode | undefined): void {
    if (!leaf) return;
    if (leaf.node.id === this.currentStepId) return;
    this.currentStepId = leaf.node.id;
    this.notifyStepChange(leaf);
    this.requestUpdate();
  }

  private emitWizardEvent(
    name: string,
    detail: IdsWizardEventPayload,
  ): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private notifyStepChange(leaf: IdsWizardVisibleNode): void {
    const payload = payloadFromNode(leaf);
    const key = `${payload.stepId}|${payload.stepCode}`;
    if (this.lastStepChangeKey === key) return;
    this.lastStepChangeKey = key;
    this.onStepChange?.(payload);
    this.emitWizardEvent("step-change", payload);
    this.emitWizardEvent("onStepChange", payload);
  }

  private detectCompoundSlots(): void {
    const found = Array.from(this.children).some((child) => {
      const tag = child.tagName?.toLowerCase();
      return (
        tag === WIZARD_COMPOUND_TAGS.header || tag === WIZARD_COMPOUND_TAGS.body
      );
    });
    if (found !== this.hasCompoundSlots) {
      this.hasCompoundSlots = found;
    }
  }

  private syncCurrentLeaf(): void {
    const { leaves } = flattenVisible(this.steps ?? [], this.wizardCtx);

    if (leaves.length === 0) {
      if (this.currentStepId !== undefined) this.currentStepId = undefined;
      return;
    }

    const hasCurrent =
      this.currentStepId != null &&
      leaves.some((leaf) => leaf.node.id === this.currentStepId);
    if (hasCurrent) return;

    const requested = this.initialStepId
      ? leaves.find((leaf) => leaf.node.id === this.initialStepId)
      : undefined;
    const nextLeaf = requested ?? leaves[0];
    this.currentStepId = nextLeaf.node.id;
    this.notifyStepChange(nextLeaf);
  }

  private groupStatus(group: IdsWizardDisplayStep): IdsWizardStepStatus {
    return consolidatedStatus(group);
  }

  private groupLeafStatus(group: IdsWizardDisplayStep): IdsWizardStepStatus {
    return group.children.length > 0
      ? this.groupStatus(group)
      : (group.top.node.status ?? "none");
  }

  private isGroupActive(group: IdsWizardDisplayStep): boolean {
    const leaf = this.currentLeaf;
    if (!leaf) return false;
    const groupHasChildren = group.children.length > 0;
    return (
      (groupHasChildren && leaf.parentId === group.top.node.id) ||
      (!groupHasChildren && leaf.node.id === group.top.node.id)
    );
  }

  private onGroupSelect(group: IdsWizardDisplayStep): void {
    const groupHasChildren = group.children.length > 0;
    this.goToLeaf(groupHasChildren ? group.children[0] : group.top);
  }

  private renderStepContent(content: IdsWizardStepContent | undefined) {
    if (content == null) {
      return html`
        <p class="ids-wizard-page-content-fallback">
          No page content is defined for this step.
        </p>
      `;
    }
    if (typeof content === "string") return content;
    if (isTemplateResult(content)) return content;
    if (content instanceof Node) return content;
    return html`
      <p class="ids-wizard-page-content-fallback">
        No page content is defined for this step.
      </p>
    `;
  }

  private renderStatusIndicator(
    status: IdsWizardStepStatus,
    shape: string | undefined,
    align: "end" | "after-label",
  ) {
    if (!shape || status === "none") return nothing;
    return html`
      <span
        class="ids-wizard-step-status-indicator ${align === "end"
          ? "ids-wizard-step-status-indicator--end"
          : ""}"
        data-ids="ids-wizard-step-status-indicator"
        data-status=${status}
        aria-hidden="true"
      >
        <ids-icon shape=${shape} size="16" color="currentColor"></ids-icon>
      </span>
    `;
  }

  private renderPropDrivenTree() {
    const display = this.display;
    const currentLeaf = this.currentLeaf;

    return html`
      <header class="ids-wizard-header" data-ids="ids-wizard-header">
        <h2
          class="ids-wizard-header-title"
          data-ids="ids-wizard-header-title"
          id=${this.titleId}
        >
          ${this.title}
        </h2>
        ${this.showClose
          ? html`
              <button
                type="button"
                class="ids-wizard-close-action"
                data-ids="ids-wizard-close-action"
                aria-label="Close wizard"
                @click=${() => this.cancel()}
              >
                <ids-icon
                  shape=${WIZARD_CLOSE_ICON_SLUG}
                  size="16"
                  color="currentColor"
                ></ids-icon>
              </button>
            `
          : nothing}
      </header>

      <div class="ids-wizard-body" data-ids="ids-wizard-body">
        <nav
          class="ids-wizard-steps-pane"
          data-ids="ids-wizard-steps-pane"
          aria-label="Wizard steps"
          role="tree"
        >
          ${display.map((group) => {
            const groupHasChildren = group.children.length > 0;
            const groupStatus = this.groupStatus(group);
            const groupIcon = resolveStatusIcon(group.top.node, groupStatus);
            const leafStatus = this.groupLeafStatus(group);
            const topActive = this.isGroupActive(group);

            return html`
              <div role="none">
                <button
                  type="button"
                  class=${classMap({
                    "ids-wizard-step-item": true,
                    "ids-wizard-step-item--nested": groupHasChildren,
                  })}
                  data-ids="ids-wizard-step-item"
                  role="treeitem"
                  data-active=${topActive ? "true" : nothing}
                  data-status=${leafStatus === "none" ? nothing : leafStatus}
                  aria-current=${topActive ? "step" : nothing}
                  @click=${() => this.onGroupSelect(group)}
                >
                  ${groupHasChildren
                    ? html`
                        <ids-icon
                          class="ids-wizard-step-expand-icon"
                          shape=${WIZARD_EXPAND_ICON_SLUG}
                          size="12"
                          color="currentColor"
                        ></ids-icon>
                      `
                    : nothing}
                  <span
                    class="ids-wizard-step-label"
                    data-ids="ids-wizard-step-label"
                  >
                    ${group.top.node.label}
                  </span>
                  ${this.renderStatusIndicator(
                    groupStatus,
                    groupIcon,
                    "end",
                  )}
                </button>

                ${groupHasChildren
                  ? html`
                      <div
                        class="ids-wizard-substep-list"
                        data-ids="ids-wizard-substep-list"
                        role="group"
                      >
                        ${group.children.map((child) => {
                          const active =
                            currentLeaf?.node.id === child.node.id;
                          const childStatus = child.node.status ?? "none";
                          const icon = resolveStatusIcon(
                            child.node,
                            childStatus,
                          );
                          return html`
                            <button
                              type="button"
                              class="ids-wizard-substep-item"
                              data-ids="ids-wizard-substep-item"
                              role="treeitem"
                              data-active=${active ? "true" : nothing}
                              data-status=${childStatus === "none"
                                ? nothing
                                : childStatus}
                              aria-current=${active ? "step" : nothing}
                              @click=${() => this.goToLeaf(child)}
                            >
                              <span
                                class="ids-wizard-step-label"
                                data-ids="ids-wizard-step-label"
                              >
                                ${child.node.label}
                              </span>
                              ${this.renderStatusIndicator(
                                childStatus,
                                icon,
                                "after-label",
                              )}
                            </button>
                          `;
                        })}
                      </div>
                    `
                  : nothing}
              </div>
            `;
          })}
        </nav>

        <section
          class="ids-wizard-content-pane"
          data-ids="ids-wizard-content-pane"
        >
          <h3 class="ids-wizard-page-title" data-ids="ids-wizard-page-title">
            ${this.pageTitle}
          </h3>
          <div
            class="ids-wizard-page-content"
            data-ids="ids-wizard-page-content"
          >
            ${this.renderStepContent(currentLeaf?.node.content)}
          </div>
          <footer class="ids-wizard-footer" data-ids="ids-wizard-footer">
            <span
              class="ids-wizard-progress-label"
              data-ids="ids-wizard-progress-label"
            >
              ${this.progressLabel}
            </span>
            <div
              class="ids-wizard-footer-actions"
              data-ids="ids-wizard-footer-actions"
            >
              ${this.showCancel
                ? html`
                    <button
                      type="button"
                      class="ids-wizard-cancel-button"
                      data-ids="ids-wizard-cancel-button"
                      @click=${() => this.cancel()}
                    >
                      Cancel
                    </button>
                  `
                : nothing}
              ${this.showPrevious
                ? html`
                    <button
                      type="button"
                      class="ids-wizard-previous-button"
                      data-ids="ids-wizard-previous-button"
                      ?disabled=${this.isFirstLeaf}
                      @click=${() => this.goPrevious()}
                    >
                      Previous
                    </button>
                  `
                : nothing}
              <button
                type="button"
                class="ids-wizard-primary-button"
                data-ids="ids-wizard-primary-button"
                ?disabled=${!this.primaryEnabled}
                @click=${() => this.goNextOrFinish()}
              >
                ${this.primaryLabel}
              </button>
            </div>
          </footer>
        </section>
      </div>
    `;
  }

  private renderShell() {
    const size = this.resolvedSize;
    const mode = this.resolvedMode;
    return html`
      <section
        id=${this.rootId}
        class=${classMap({
          "ids-wizard": true,
          "ids-wizard--medium": size === "medium",
          "ids-wizard--large": size === "large",
          "ids-wizard--x-large": size === "x-large",
          "ids-wizard--full-screen": size === "full-screen",
          "ids-wizard--modal": mode === "modal",
        })}
        data-ids="ids-wizard"
        data-mode=${mode}
        data-size=${size}
        role=${mode === "modal" ? "dialog" : "region"}
        aria-modal=${mode === "modal" ? "true" : nothing}
        aria-labelledby=${this.titleId}
      >
        ${this.hasCompoundSlots
          ? html`<slot></slot>`
          : this.renderPropDrivenTree()}
      </section>
    `;
  }

  override render() {
    if (this.resolvedMode === "modal") {
      return html`
        <div class="ids-wizard-overlay" data-ids="ids-wizard-overlay">
          ${this.renderShell()}
        </div>
      `;
    }
    return this.renderShell();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-wizard": IdsWizard;
  }
}
