/**
 * AccordionContent — edf-core `ids-accordion-content` + IDS panel body padding / rail.
 */
import { LitElement, html } from "lit";
import { state } from "lit/decorators.js";
import type { IdsAccordionPanel } from "./accordion-panel.element.js";
import { accordionContentStyles } from "./accordion.styles.js";

export class IdsAccordionContent extends LitElement {
  static override styles = [accordionContentStyles];

  @state()
  private active = false;

  private panel: IdsAccordionPanel | null = null;
  private regionId = "";
  private labelledBy = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-accordion-content");
    this.setAttribute("role", "region");
    queueMicrotask(() => this.bindPanel());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.panel?.removeEventListener("onToggleContent", this.onPanelToggle);
  }

  private bindPanel(): void {
    this.panel = this.closest("ids-accordion-panel");
    if (!this.panel) return;
    const value = this.panel.value || this.panel.id || "panel";
    this.regionId = `ids-accordion-panel-${value}`;
    this.labelledBy = `ids-accordion-trigger-${value}`;
    this.id = this.regionId;
    this.setAttribute("aria-labelledby", this.labelledBy);
    this.active = this.panel.active;
    this.syncVisibility();
    this.panel.addEventListener("onToggleContent", this.onPanelToggle);
  }

  private onPanelToggle = (): void => {
    this.active = Boolean(this.panel?.active);
    this.syncVisibility();
    this.requestUpdate();
  };

  private syncVisibility(): void {
    this.toggleAttribute("hidden", !this.active);
    this.setAttribute("data-open", this.active ? "true" : "false");
    this.classList.toggle("visible", this.active);
    this.classList.toggle("hidden", !this.active);
    this.classList.toggle("active", this.active);
  }

  override render() {
    return html`
      <div class="panel-content" data-hook-ids="accordion-panel-content">
        <div class="content-card">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-accordion-content": IdsAccordionContent;
  }
}
