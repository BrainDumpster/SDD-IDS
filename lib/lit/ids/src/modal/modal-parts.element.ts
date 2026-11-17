/**
 * IDS Modal composition parts — light-DOM children of `ids-modal`.
 * API mirrors React `lib/react/ids/modal` slot components.
 */
import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import "../button/register.js";
import "../icon/register.js";
import type { IdsModal } from "./modal.element.js";
import {
  MODAL_ALERTING_TYPES,
  MODAL_CLOSE_ICON_SLUG,
  MODAL_DIALOG_TYPE_ICON,
  type IdsModalType,
} from "./modal.constants.js";
import {
  modalContentStyles,
  modalDescriptionStyles,
  modalFooterStyles,
  modalHeaderStyles,
  modalTabsStyles,
  modalTitleStyles,
} from "./modal.styles.js";

function findModal(el: HTMLElement): IdsModal | null {
  return el.closest("ids-modal") as IdsModal | null;
}

function isModalPage(scenario: string): boolean {
  return scenario === "single-page" || scenario === "multi-page";
}

/* -------------------------------------------------------------------------- */
/* Close                                                                      */
/* -------------------------------------------------------------------------- */

export class IdsModalClose extends LitElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-modal-close");
  }

  private onClick = (event: Event): void => {
    if ((event as CustomEvent).defaultPrevented) return;
    findModal(this)?.requestClose();
  };

  override render() {
    return html`
      <ids-button
        type="button"
        variant="ghostNeutral"
        size="medium"
        icononly
        iconslug=${MODAL_CLOSE_ICON_SLUG}
        arialabel="Close"
        @ids-button-click=${this.onClick}
      ></ids-button>
    `;
  }
}

/* -------------------------------------------------------------------------- */
/* Title                                                                      */
/* -------------------------------------------------------------------------- */

export class IdsModalTitle extends LitElement {
  static override styles = [modalTitleStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-modal-title");
    this.setAttribute("role", "heading");
    this.setAttribute("aria-level", "2");
    const modal = findModal(this);
    if (modal && !this.id) this.id = modal.titleId;
  }

  override render() {
    return html`<slot></slot>`;
  }
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export class IdsModalHeader extends LitElement {
  static override styles = [modalHeaderStyles];

  @property({ type: Boolean, attribute: "showseverityicon" })
  showSeverityIcon?: boolean;

  private childObserver?: MutationObserver;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-modal-header");
    this.assignSlots();
    this.syncPageAttr();
    this.childObserver = new MutationObserver(() => this.assignSlots());
    this.childObserver.observe(this, { childList: true });
  }

  override disconnectedCallback(): void {
    this.childObserver?.disconnect();
    super.disconnectedCallback();
  }

  override updated(): void {
    this.syncPageAttr();
  }

  private syncPageAttr(): void {
    const modal = findModal(this);
    const page = modal ? isModalPage(modal.resolvedScenario) : false;
    if (page) this.setAttribute("data-page", "");
    else this.removeAttribute("data-page");
  }

  private assignSlots(): void {
    for (const child of Array.from(this.children)) {
      const name = child.localName;
      if (name === "ids-modal-title") {
        child.setAttribute("slot", "title");
      } else if (name === "ids-modal-close") {
        child.setAttribute("slot", "close");
      }
    }
  }

  private get showIcon(): boolean {
    const modal = findModal(this);
    if (!modal) return false;
    if (this.showSeverityIcon != null) return this.showSeverityIcon;
    return (
      modal.resolvedScenario === "dialog" &&
      modal.resolvedType !== "non-alerting"
    );
  }

  private get severitySlug(): string | null {
    const modal = findModal(this);
    if (!modal || modal.resolvedType === "non-alerting") return null;
    return MODAL_DIALOG_TYPE_ICON[modal.resolvedType];
  }

  override render() {
    const slug = this.showIcon ? this.severitySlug : null;
    return html`
      <div class="ids-modal-header-left">
        ${slug
          ? html`
              <span
                class="ids-modal-severity-icon"
                data-ids="ids-modal-severity-icon"
                aria-hidden="true"
              >
                <ids-icon shape=${slug} variant="img" size="24"></ids-icon>
              </span>
            `
          : nothing}
        <slot name="title"></slot>
        <slot></slot>
      </div>
      <div class="ids-modal-header-controls">
        <slot name="close"></slot>
      </div>
    `;
  }
}

/* -------------------------------------------------------------------------- */
/* Description                                                                */
/* -------------------------------------------------------------------------- */

export class IdsModalDescription extends LitElement {
  static override styles = [modalDescriptionStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-modal-description");
    const modal = findModal(this);
    if (modal && !this.id) this.id = modal.descriptionId;
    this.syncAttrs();
  }

  override updated(): void {
    this.syncAttrs();
  }

  private syncAttrs(): void {
    const modal = findModal(this);
    const type: IdsModalType = modal?.resolvedType ?? "non-alerting";
    this.setAttribute("data-type", type);
    if (modal && isModalPage(modal.resolvedScenario)) {
      this.setAttribute("data-page", "");
    } else {
      this.removeAttribute("data-page");
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

/* -------------------------------------------------------------------------- */
/* Tabs                                                                       */
/* -------------------------------------------------------------------------- */

export class IdsModalTabs extends LitElement {
  static override styles = [modalTabsStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-modal-tabs");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

export class IdsModalContent extends LitElement {
  static override styles = [modalContentStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-modal-content");
    this.syncAttrs();
  }

  override updated(): void {
    this.syncAttrs();
  }

  private syncAttrs(): void {
    const modal = findModal(this);
    if (!modal) return;
    if (isModalPage(modal.resolvedScenario)) {
      this.setAttribute("data-page", "");
    } else {
      this.removeAttribute("data-page");
    }
    if (MODAL_ALERTING_TYPES.has(modal.resolvedType)) {
      this.setAttribute("data-alerting", "");
    } else {
      this.removeAttribute("data-alerting");
    }
    if (modal.scrollBar) this.setAttribute("data-scroll", "");
    else this.removeAttribute("data-scroll");
  }

  /** Exposed for root scroll-shadow measurement. */
  get scrollElement(): HTMLElement {
    return this;
  }

  override render() {
    return html`<slot></slot>`;
  }
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export class IdsModalFooter extends LitElement {
  static override styles = [modalFooterStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-modal-footer");
    this.syncPageAttr();
  }

  override updated(): void {
    this.syncPageAttr();
  }

  private syncPageAttr(): void {
    const modal = findModal(this);
    if (modal && isModalPage(modal.resolvedScenario)) {
      this.setAttribute("data-page", "");
    } else {
      this.removeAttribute("data-page");
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}
