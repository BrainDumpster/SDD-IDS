/**
 * IdsTooltipBody — body content region.
 */
import { LitElement, html } from "lit";
import { tooltipBodyStyles } from "./tooltip.styles.js";

export class IdsTooltipBody extends LitElement {
  static override styles = [tooltipBodyStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-tooltip-body");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-tooltip-body": IdsTooltipBody;
  }
}
