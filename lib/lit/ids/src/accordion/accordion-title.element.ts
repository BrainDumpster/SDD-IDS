/**
 * AccordionTitle — edf-core `ids-accordion-title` + IDS header/trigger contract.
 * Chevron: shared `ids-icon` with slug `chev-down-thick` (assets/icons/).
 */
import { LitElement, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import type { IdsAccordion } from "./accordion.element.js";
import type { IdsAccordionPanel } from "./accordion-panel.element.js";
import { accordionTitleStyles } from "./accordion.styles.js";
import { ACCORDION_CHEVRON_ICON_SLUG } from "./accordion.constants.js";
import "../icon/register.js";

export class IdsAccordionTitle extends LitElement {
  static override styles = [accordionTitleStyles];

  @state()
  private active = false;

  private panel: IdsAccordionPanel | null = null;
  private root: IdsAccordion | null = null;
  private triggerId = "";
  private panelRegionId = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-accordion-title");
    queueMicrotask(() => this.bindPanel());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.panel?.removeEventListener("onToggleContent", this.onPanelToggle);
  }

  private bindPanel(): void {
    this.panel = this.closest("ids-accordion-panel");
    this.root = this.closest("ids-accordion");
    if (!this.panel) return;

    const value = this.panel.value || this.stableFallbackId();
    this.triggerId = `ids-accordion-trigger-${value}`;
    this.panelRegionId = `ids-accordion-panel-${value}`;
    this.active = this.panel.active;
    this.panel.addEventListener("onToggleContent", this.onPanelToggle);
    this.requestUpdate();
  }

  private stableFallbackId(): string {
    if (!this.id) {
      this.id = `title-${Math.random().toString(36).slice(2, 9)}`;
    }
    return this.id;
  }

  private onPanelToggle = (): void => {
    this.active = Boolean(this.panel?.active);
    this.requestUpdate();
  };

  private get disabled(): boolean {
    if (!this.panel) return false;
    return (
      this.panel.accordionPanelDisabled ||
      this.panel.hasAttribute("accordionPanelDisabled") ||
      this.panel.hasAttribute("idsAccordionPanelDisabled") ||
      this.panel.hasAttribute("idsaccordionpaneldisabled")
    );
  }

  private get chevronPosition(): "left" | "right" {
    const pos = this.root?.chevronPosition;
    return pos === "right" ? "right" : "left";
  }

  private handleClick(): void {
    if (this.disabled) return;
    this.panel?.toggleActive();
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (!this.root || !this.panel) return;
    this.root.onTriggerKeydown(event, this.panel);
  }

  private renderChevron() {
    return html`
      <span class="icon-layout" aria-hidden="true">
        <ids-icon
          shape=${ACCORDION_CHEVRON_ICON_SLUG}
          size="16"
          variant="mask"
        ></ids-icon>
      </span>
    `;
  }

  override render() {
    const chevron = this.chevronPosition;
    return html`
      <h3>
        <button
          type="button"
          class="accordion-header ${this.active ? "active-header" : ""} accordion-header--${chevron}"
          id=${this.triggerId || nothing}
          aria-expanded=${String(this.active)}
          aria-controls=${this.panelRegionId || nothing}
          ?disabled=${this.disabled}
          data-hook-ids="accordion-header"
          data-open=${this.active ? "true" : "false"}
          @click=${this.handleClick}
          @keydown=${this.handleKeydown}
        >
          ${chevron === "left" ? this.renderChevron() : nothing}
          <span class="accordion-title" data-hook-ids="accordion-title">
            <slot></slot>
          </span>
          ${chevron === "right" ? this.renderChevron() : nothing}
        </button>
      </h3>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-accordion-title": IdsAccordionTitle;
  }
}
