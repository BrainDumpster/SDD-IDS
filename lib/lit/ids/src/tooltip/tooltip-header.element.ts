/**
 * IdsTooltipHeader — optional title region.
 */
import { LitElement, html } from "lit";
import { tooltipHeaderStyles } from "./tooltip.styles.js";

export class IdsTooltipHeader extends LitElement {
  static override styles = [tooltipHeaderStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-tooltip-header");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-tooltip-header": IdsTooltipHeader;
  }
}
