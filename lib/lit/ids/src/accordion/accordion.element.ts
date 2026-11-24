/**
 * Accordion root — edf-core API (`multiplePanelOpen` / `idsMultiplePanelOpen`)
 * + design-spec `chevronPosition`, sizing props, `defaultValue`, and keyboard
 * focus contract (Home / End / Enter / Space).
 */
import { LitElement, PropertyValues, css, html } from "lit";
import { property } from "lit/decorators.js";
import type { IdsAccordionPanel, ToggleContentEvent } from "./accordion-panel.element.js";

export type AccordionChevronPosition = "left" | "right";

/** Design-spec length: numbers are px, strings are any CSS length. */
export type AccordionLength = number | string;

/** Custom property read by the panel body to cap its height (see accordion.styles.ts). */
const PANEL_MAX_HEIGHT_VAR = "--ids-accordion-panel-max-height";

/** Converts a design-spec length to a CSS value. Returns `null` when unset. */
export function toAccordionCssLength(value: AccordionLength | null | undefined): string | null {
  if (value === null || value === undefined || value === "") return null;
  return typeof value === "number" ? `${value}px` : value;
}

export class IdsAccordion extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 240px;
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

  /**
   * Design-spec: root width. Default fluid (`100%`, bounded by `min-width: 240px`).
   * Numbers are px; strings are any CSS length.
   */
  @property({ attribute: false })
  width: AccordionLength | null = null;

  /**
   * Design-spec: root max-width. Default unset (fills the container).
   * Numbers are px; strings are any CSS length.
   */
  @property({ attribute: false })
  maxWidth: AccordionLength | null = null;

  /**
   * Design-spec: caps panel body height. Default unset (panel grows with content).
   * When set, overflowing body content scrolls vertically. Numbers are px; strings are any CSS length.
   */
  @property({ attribute: false })
  panelMaxHeight: AccordionLength | null = null;

  /**
   * Design-spec: `value`s of panels open on first render.
   * Only the first match is opened when `multiple` is false.
   */
  @property({ attribute: false })
  defaultValue: string[] = [];

  private panels: IdsAccordionPanel[] = [];
  private defaultValueApplied = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-accordion");
    this.addEventListener("onToggleContent", this.onToggleContent as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("onToggleContent", this.onToggleContent as EventListener);
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("width")) {
      this.applyStyle("width", toAccordionCssLength(this.width));
    }
    if (changed.has("maxWidth")) {
      this.applyStyle("maxWidth", toAccordionCssLength(this.maxWidth));
    }
    if (changed.has("panelMaxHeight")) {
      const value = toAccordionCssLength(this.panelMaxHeight);
      if (value === null) {
        this.style.removeProperty(PANEL_MAX_HEIGHT_VAR);
      } else {
        this.style.setProperty(PANEL_MAX_HEIGHT_VAR, value);
      }
    }
  }

  private applyStyle(prop: "width" | "maxWidth", value: string | null): void {
    if (value === null) {
      this.style[prop] = "";
    } else {
      this.style[prop] = value;
    }
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

  /**
   * Keyboard contract from design-spec: Home / End move focus.
   * Enter / Space intentionally NOT handled here — the chevron is an
   * `ids-icon-button` whose inner shadow `<button>` produces a native
   * click that toggles via the header row's click handler; calling
   * `toggleActive()` here as well would toggle twice per keypress.
   */
  onTriggerKeydown(event: KeyboardEvent, panel: IdsAccordionPanel): void {
    this.refreshPanels();
    const enabled = this.panels.filter(
      (p) => !p.accordionPanelDisabled && !p.hasAttribute("idsaccordionpaneldisabled"),
    );
    if (!enabled.length) return;

    let target: IdsAccordionPanel;

    switch (event.key) {
      case "Home":
        event.preventDefault();
        target = enabled[0]!;
        break;
      case "End":
        event.preventDefault();
        target = enabled[enabled.length - 1]!;
        break;
      default:
        return;
    }

    const value = target.value || target.id || "";
    // Prefer the icon-button's inner shadow button (the focusable control);
    // fall back to a plain shadow button or the light-DOM trigger id.
    const title = target.querySelector("ids-accordion-title");
    const iconButton = title?.shadowRoot?.querySelector("ids-icon-button");
    const shadowBtn = (iconButton?.shadowRoot?.querySelector("button") ??
      title?.shadowRoot?.querySelector("button")) as HTMLButtonElement | null;
    const trigger = this.querySelector(
      `#ids-accordion-trigger-${CSS.escape(value)}`,
    ) as HTMLElement | null;
    (shadowBtn ?? trigger)?.focus();
  }

  /** Opens the panels named in `defaultValue` (once, on first slot assignment). */
  private applyDefaultValue(): void {
    if (this.defaultValueApplied || !this.defaultValue.length) return;
    this.defaultValueApplied = true;

    let opened = false;
    for (const panel of this.panels) {
      const wanted = this.defaultValue.includes(panel.value);
      if (!wanted) continue;
      if (!this.multiplePanelOpen && !this.idsMultiplePanelOpen && opened) continue;
      panel.active = true;
      opened = true;
    }
  }

  private onSlotChange(): void {
    this.refreshPanels();
    this.applyDefaultValue();
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
