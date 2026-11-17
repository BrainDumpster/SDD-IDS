/**
 * IDS Wizard anatomy parts — light-DOM / compound children of `ids-wizard`.
 * Selectors match design-spec Implementation Notes.
 */
import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import "../icon/register.js";
import type { IdsWizard } from "./wizard.element.js";
import {
  WIZARD_CLOSE_ICON_SLUG,
  type IdsWizardStepStatus,
} from "./wizard.constants.js";
import {
  wizardBodyHostStyles,
  wizardContentPaneHostStyles,
  wizardHeaderHostStyles,
  wizardPartHostStyles,
  wizardStepsPaneHostStyles,
  wizardStyles,
} from "./wizard.styles.js";

function findWizard(el: HTMLElement): IdsWizard | null {
  return el.closest("ids-wizard") as IdsWizard | null;
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export class IdsWizardHeader extends LitElement {
  static override styles = [wizardHeaderHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-header");
  }

  override render() {
    return html`<header class="ids-wizard-header"><slot></slot></header>`;
  }
}

export class IdsWizardHeaderTitle extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-header-title");
    const wizard = findWizard(this);
    if (wizard && !this.id) this.id = wizard.titleId;
  }

  override render() {
    const wizard = findWizard(this);
    return html`
      <h2 class="ids-wizard-header-title" id=${wizard?.titleId ?? this.id}>
        <slot></slot>
      </h2>
    `;
  }
}

export class IdsWizardCloseAction extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-close-action");
  }

  private onClick = (event: Event): void => {
    if ((event as CustomEvent).defaultPrevented) return;
    findWizard(this)?.cancel();
  };

  override render() {
    return html`
      <button
        type="button"
        class="ids-wizard-close-action"
        aria-label="Close wizard"
        @click=${this.onClick}
      >
        <slot>
          <ids-icon
            shape=${WIZARD_CLOSE_ICON_SLUG}
            size="16"
            color="currentColor"
          ></ids-icon>
        </slot>
      </button>
    `;
  }
}

/* -------------------------------------------------------------------------- */
/* Body / steps                                                               */
/* -------------------------------------------------------------------------- */

export class IdsWizardBody extends LitElement {
  static override styles = [wizardBodyHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-body");
  }

  override render() {
    return html`<div class="ids-wizard-body"><slot></slot></div>`;
  }
}

export class IdsWizardStepsPane extends LitElement {
  static override styles = [wizardStepsPaneHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-steps-pane");
  }

  override render() {
    return html`
      <nav
        class="ids-wizard-steps-pane"
        aria-label="Wizard steps"
        role="tree"
      >
        <slot></slot>
      </nav>
    `;
  }
}

export class IdsWizardStepItem extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  @property({ type: Boolean })
  active = false;

  @property({ type: String })
  status: IdsWizardStepStatus = "none";

  @property({ type: Boolean, attribute: "haschildren" })
  hasChildren = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-step-item");
  }

  override render() {
    return html`
      <button
        type="button"
        class="ids-wizard-step-item ${this.hasChildren
          ? "ids-wizard-step-item--nested"
          : ""}"
        role="treeitem"
        data-active=${this.active ? "true" : nothing}
        data-status=${this.status === "none" ? nothing : this.status}
        aria-current=${this.active ? "step" : nothing}
      >
        <slot></slot>
      </button>
    `;
  }
}

export class IdsWizardStepLabel extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-step-label");
  }

  override render() {
    return html`<span class="ids-wizard-step-label"><slot></slot></span>`;
  }
}

export class IdsWizardStepStatusIndicator extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  @property({ type: String })
  status: IdsWizardStepStatus = "none";

  @property({ type: String })
  shape = "";

  /** Parent rows: `end` (trailing). Substeps: `after-label`. */
  @property({ type: String })
  align: "end" | "after-label" = "end";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-step-status-indicator");
  }

  override render() {
    if (!this.shape || this.status === "none") return nothing;
    return html`
      <span
        class="ids-wizard-step-status-indicator ${this.align === "end"
          ? "ids-wizard-step-status-indicator--end"
          : ""}"
        data-status=${this.status}
        aria-hidden="true"
      >
        <ids-icon
          shape=${this.shape}
          size="16"
          color="currentColor"
        ></ids-icon>
      </span>
    `;
  }
}

export class IdsWizardSubstepList extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-substep-list");
    this.setAttribute("role", "group");
  }

  override render() {
    return html`<div class="ids-wizard-substep-list"><slot></slot></div>`;
  }
}

export class IdsWizardSubstepItem extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  @property({ type: Boolean })
  active = false;

  @property({ type: String })
  status: IdsWizardStepStatus = "none";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-substep-item");
  }

  override render() {
    return html`
      <button
        type="button"
        class="ids-wizard-substep-item"
        role="treeitem"
        data-active=${this.active ? "true" : nothing}
        data-status=${this.status === "none" ? nothing : this.status}
        aria-current=${this.active ? "step" : nothing}
      >
        <slot></slot>
      </button>
    `;
  }
}

/* -------------------------------------------------------------------------- */
/* Content / footer                                                           */
/* -------------------------------------------------------------------------- */

export class IdsWizardContentPane extends LitElement {
  static override styles = [wizardContentPaneHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-content-pane");
  }

  override render() {
    return html`<section class="ids-wizard-content-pane"><slot></slot></section>`;
  }
}

export class IdsWizardPageTitle extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-page-title");
  }

  override render() {
    return html`<h3 class="ids-wizard-page-title"><slot></slot></h3>`;
  }
}

export class IdsWizardPageContent extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-page-content");
  }

  override render() {
    return html`<div class="ids-wizard-page-content"><slot></slot></div>`;
  }
}

export class IdsWizardFooter extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-footer");
  }

  override render() {
    return html`<footer class="ids-wizard-footer"><slot></slot></footer>`;
  }
}

export class IdsWizardProgressLabel extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-progress-label");
  }

  override render() {
    const wizard = findWizard(this);
    return html`
      <span class="ids-wizard-progress-label">
        <slot>${wizard?.progressLabel ?? ""}</slot>
      </span>
    `;
  }
}

export class IdsWizardFooterActions extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-footer-actions");
  }

  override render() {
    return html`<div class="ids-wizard-footer-actions"><slot></slot></div>`;
  }
}

export class IdsWizardCancelButton extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-cancel-button");
  }

  private onClick = (event: Event): void => {
    if ((event as CustomEvent).defaultPrevented) return;
    findWizard(this)?.cancel();
  };

  override render() {
    return html`
      <button
        type="button"
        class="ids-wizard-cancel-button"
        @click=${this.onClick}
      >
        <slot>Cancel</slot>
      </button>
    `;
  }
}

export class IdsWizardPreviousButton extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-previous-button");
  }

  private onClick = (event: Event): void => {
    if ((event as CustomEvent).defaultPrevented) return;
    findWizard(this)?.goPrevious();
  };

  override render() {
    const wizard = findWizard(this);
    return html`
      <button
        type="button"
        class="ids-wizard-previous-button"
        ?disabled=${wizard?.isFirstLeaf ?? true}
        @click=${this.onClick}
      >
        <slot>Previous</slot>
      </button>
    `;
  }
}

export class IdsWizardPrimaryButton extends LitElement {
  static override styles = [wizardPartHostStyles, wizardStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-wizard-primary-button");
  }

  private onClick = (event: Event): void => {
    if ((event as CustomEvent).defaultPrevented) return;
    findWizard(this)?.goNextOrFinish();
  };

  override render() {
    const wizard = findWizard(this);
    return html`
      <button
        type="button"
        class="ids-wizard-primary-button"
        ?disabled=${!(wizard?.primaryEnabled ?? false)}
        @click=${this.onClick}
      >
        <slot>${wizard?.primaryLabel ?? "Next"}</slot>
      </button>
    `;
  }
}
