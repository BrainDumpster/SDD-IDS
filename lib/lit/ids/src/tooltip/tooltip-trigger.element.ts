/**
 * IdsTooltipTrigger — light-DOM trigger anchor for `ids-tooltip`.
 */
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { tooltipTriggerStyles } from "./tooltip.styles.js";
import type { IdsTooltip } from "./tooltip.element.js";

export class IdsTooltipTrigger extends LitElement {
  static override styles = [tooltipTriggerStyles];

  @property({ type: String, reflect: true })
  display: "inline" | "block" = "inline";

  private get tooltip(): IdsTooltip | null {
    return this.closest("ids-tooltip");
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-tooltip-trigger");
    this.tabIndex = 0;
    this.addEventListener("mouseenter", this.onEnter);
    this.addEventListener("mouseleave", this.onLeave);
    this.addEventListener("focusin", this.onFocus);
    this.addEventListener("focusout", this.onBlur);
  }

  override disconnectedCallback(): void {
    this.removeEventListener("mouseenter", this.onEnter);
    this.removeEventListener("mouseleave", this.onLeave);
    this.removeEventListener("focusin", this.onFocus);
    this.removeEventListener("focusout", this.onBlur);
    super.disconnectedCallback();
  }

  private onEnter = (): void => {
    this.tooltip?.requestOpenFromHover();
  };

  private onLeave = (): void => {
    this.tooltip?.requestClose();
  };

  private onFocus = (): void => {
    this.tooltip?.requestOpenImmediate();
  };

  private onBlur = (): void => {
    this.tooltip?.requestClose();
  };

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-tooltip-trigger": IdsTooltipTrigger;
  }
}
