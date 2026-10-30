/**
 * AccordionPanel — edf-core API (`active`, `accordionPanelDisabled`, `onToggleContent`)
 * with IDS design-spec visuals via child title/content.
 */
import { LitElement, PropertyValues, html } from "lit";
import { property } from "lit/decorators.js";
import { accordionPanelStyles } from "./accordion.styles.js";

export type ToggleContentEvent = {
  panel: IdsAccordionPanel;
};

export class IdsAccordionPanel extends LitElement {
  static override styles = [accordionPanelStyles];

  private internalToggle = false;

  /** When true, panel body is expanded. */
  @property({ type: Boolean, reflect: true })
  active = false;

  /**
   * @deprecated Prefer `accordionPanelDisabled`.
   * When true, panel is non-interactive.
   */
  @property({ type: Boolean, attribute: "idsaccordionpaneldisabled" })
  set idsAccordionPanelDisabled(val: boolean) {
    this.accordionPanelDisabled = val;
  }
  get idsAccordionPanelDisabled(): boolean {
    return this.accordionPanelDisabled;
  }

  @property({ type: Boolean, reflect: true })
  accordionPanelDisabled = false;

  /**
   * Stable id for design-spec / Storybook matrices (optional; edf-core has no `value`).
   * Used by root `value-change` payloads when present.
   */
  @property({ type: String, reflect: true })
  value = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-accordion-panel");
    this.setAttribute("data-hook-ids", "ids-accordion-content");
  }

  override updated(changed: PropertyValues<this>): void {
    if (changed.has("active")) {
      this.setAttribute("data-open", this.active ? "true" : "false");
      if (!this.internalToggle) {
        this.dispatchToggle();
      }
    }
    if (changed.has("accordionPanelDisabled")) {
      this.toggleAttribute("idsaccordionpaneldisabled", this.accordionPanelDisabled);
    }
  }

  public toggleActive(): void {
    if (this.accordionPanelDisabled || this.idsAccordionPanelDisabled) return;
    this.internalToggle = true;
    this.active = !this.active;
    this.dispatchToggle();
    this.internalToggle = false;
  }

  private dispatchToggle(): void {
    this.dispatchEvent(
      new CustomEvent<ToggleContentEvent>("onToggleContent", {
        detail: { panel: this },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="accordion-panel ${this.active ? "active" : ""}" data-hook-ids="accordion-panel">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-accordion-panel": IdsAccordionPanel;
  }
}
