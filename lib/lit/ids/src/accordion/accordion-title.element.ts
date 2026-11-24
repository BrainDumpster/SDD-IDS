/**
 * AccordionTitle — edf-core `ids-accordion-title` + IDS header/trigger contract.
 * Chevron: `ids-icon-button` (ghostNeutral, small, `chev-down-thick`) — the
 * focusable trigger control; the header row is a non-button surface.
 */
import { LitElement, PropertyValues, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import type { IdsAccordion } from "./accordion.element.js";
import type { IdsAccordionPanel } from "./accordion-panel.element.js";
import { accordionTitleStyles } from "./accordion.styles.js";
import { ACCORDION_CHEVRON_ICON_SLUG } from "./accordion.constants.js";
import "../icon-button/register.js";

export class IdsAccordionTitle extends LitElement {
  static override styles = [accordionTitleStyles];

  @state()
  private active = false;

  private panel: IdsAccordionPanel | null = null;
  private root: IdsAccordion | null = null;
  private triggerId = "";
  private panelRegionId = "";
  private titleEl: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-accordion-title");
    queueMicrotask(() => this.bindPanel());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.panel?.removeEventListener("onToggleContent", this.onPanelToggle);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  override firstUpdated(): void {
    this.titleEl = this.renderRoot.querySelector<HTMLElement>(".accordion-title");
    if (this.titleEl && typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.syncTruncationTooltip());
      this.resizeObserver.observe(this.titleEl);
    }
  }

  override updated(_changed: PropertyValues<this>): void {
    this.syncTruncationTooltip();
  }

  /**
   * Design-spec: the full title is exposed via a native `title` tooltip only while
   * the 2-line clamp is actually truncating it (measured overflow).
   */
  private syncTruncationTooltip(): void {
    const el = this.titleEl;
    if (!el) return;
    const truncated = el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
    const text = this.ownTitleText();
    if (truncated && text) {
      el.setAttribute("title", text);
    } else {
      el.removeAttribute("title");
    }
  }

  /** Light-DOM text that feeds the title slot (excludes named slots such as `meta`). */
  private ownTitleText(): string {
    return Array.from(this.childNodes)
      .filter((node) => !(node instanceof Element && node.hasAttribute("slot")))
      .map((node) => node.textContent ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();
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

  /**
   * Chevron control — `ids-icon-button` (ghost neutral · small). Per the
   * design-spec it is the focusable trigger control, so it carries the
   * trigger `id` + forwarded `aria-*` onto its inner shadow button. The
   * header row stays a non-button surface (no nested `<button>`).
   */
  private renderTriggerControl(titleId: string | typeof nothing) {
    const label = this.ownTitleText() || "Toggle section";
    return html`
      <ids-icon-button
        class="accordion-chevron"
        id=${this.triggerId || nothing}
        variant="ghostNeutral"
        size="small"
        shape=${ACCORDION_CHEVRON_ICON_SLUG}
        arialabel=${label}
        aria-label=${label}
        arialabelledby=${titleId}
        ariaexpanded=${String(this.active)}
        ariacontrols=${this.panelRegionId || nothing}
        ?disabled=${this.disabled}
        data-hook-ids="accordion-chevron"
      ></ids-icon-button>
    `;
  }

  override render() {
    const chevron = this.chevronPosition;
    const titleId = this.triggerId ? `${this.triggerId}-title` : nothing;
    return html`
      <h3>
        <div
          class="accordion-header ${this.active ? "active-header" : ""} accordion-header--${chevron} ${
            this.disabled ? "accordion-header--disabled" : ""
          }"
          data-hook-ids="accordion-header"
          data-open=${this.active ? "true" : "false"}
          data-disabled=${this.disabled ? "true" : "false"}
          @click=${this.handleClick}
          @keydown=${this.handleKeydown}
        >
          ${chevron === "left" ? this.renderTriggerControl(titleId) : nothing}
          <span class="accordion-title" id=${titleId} data-hook-ids="accordion-title">
            <slot @slotchange=${() => this.requestUpdate()}></slot>
          </span>
          <slot name="meta" class="accordion-meta" data-hook-ids="accordion-meta"></slot>
          ${chevron === "right" ? this.renderTriggerControl(titleId) : nothing}
        </div>
      </h3>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-accordion-title": IdsAccordionTitle;
  }
}
