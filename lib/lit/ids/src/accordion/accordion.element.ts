/**
 * Accordion root — edf-core API (`multiplePanelOpen` / `idsMultiplePanelOpen`)
 * + design-spec `chevronPosition` and keyboard roving focus.
 */
import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import type { IdsAccordionPanel, ToggleContentEvent } from "./accordion-panel.element.js";

export type AccordionChevronPosition = "left" | "right";

export class IdsAccordion extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }
  `;

  /**
   * @deprecated Prefer `multiplePanelOpen`.
   * When true, more than one panel may stay open.
   */
  @property({ type: Boolean, attribute: "idsmultiplepanelopen" })
  set idsMultiplePanelOpen(val: boolean) {
    this.multiplePanelOpen = val;
  }
  get idsMultiplePanelOpen(): boolean {
    return this.multiplePanelOpen;
  }

  /** When true, more than one panel may stay open (edf-core). Design-spec alias: `multiple`. */
  @property({ type: Boolean, reflect: true })
  multiplePanelOpen = false;

  /** Design-spec: `multiple` → same as `multiplePanelOpen`. */
  @property({ type: Boolean, attribute: "multiple" })
  set multiple(val: boolean) {
    this.multiplePanelOpen = val;
  }
  get multiple(): boolean {
    return this.multiplePanelOpen;
  }

  /** Design-spec: chevron left (default) or right. */
  @property({ type: String, reflect: true, attribute: "chevron-position" })
  chevronPosition: AccordionChevronPosition = "left";

  private panels: IdsAccordionPanel[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-accordion");
    this.addEventListener("onToggleContent", this.onToggleContent as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("onToggleContent", this.onToggleContent as EventListener);
  }

  private refreshPanels(): void {
    this.panels = Array.from(this.querySelectorAll("ids-accordion-panel"));
  }

  private onToggleContent = (event: Event): void => {
    const detail = (event as CustomEvent<ToggleContentEvent>).detail;
    const toggled = detail?.panel;
    if (!toggled) return;

    this.refreshPanels();

    if (!this.multiplePanelOpen && !this.idsMultiplePanelOpen) {
      for (const panel of this.panels) {
        if (panel !== toggled && panel.active) {
          panel.active = false;
        }
      }
    }

    const openValues = this.panels
      .filter((p) => p.active)
      .map((p, i) => p.value || p.id || String(i));

    this.dispatchEvent(
      new CustomEvent("value-change", {
        detail: { openValues },
        bubbles: true,
        composed: true,
      }),
    );
  };

  /** Keyboard contract from design-spec (Arrow / Home / End / Enter / Space). */
  onTriggerKeydown(event: KeyboardEvent, panel: IdsAccordionPanel): void {
    this.refreshPanels();
    const enabled = this.panels.filter(
      (p) => !p.accordionPanelDisabled && !p.hasAttribute("idsaccordionpaneldisabled"),
    );
    if (!enabled.length) return;

    const index = enabled.indexOf(panel);
    if (index < 0) return;

    let target = panel;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        target = enabled[(index + 1) % enabled.length]!;
        break;
      case "ArrowUp":
        event.preventDefault();
        target = enabled[(index - 1 + enabled.length) % enabled.length]!;
        break;
      case "Home":
        event.preventDefault();
        target = enabled[0]!;
        break;
      case "End":
        event.preventDefault();
        target = enabled[enabled.length - 1]!;
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        panel.toggleActive();
        return;
      default:
        return;
    }

    const value = target.value || target.id || "";
    const trigger = this.querySelector(
      `#ids-accordion-trigger-${CSS.escape(value)}`,
    ) as HTMLElement | null;
    // Prefer shadow trigger inside title
    const title = target.querySelector("ids-accordion-title");
    const shadowBtn = title?.shadowRoot?.querySelector("button") as HTMLButtonElement | null;
    (shadowBtn ?? trigger)?.focus();
  }

  private onSlotChange(): void {
    this.refreshPanels();
  }

  override render() {
    return html`<slot @slotchange=${this.onSlotChange}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-accordion": IdsAccordion;
  }
}
