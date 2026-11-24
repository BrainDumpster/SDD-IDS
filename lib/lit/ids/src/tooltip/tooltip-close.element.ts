/**
 * IdsTooltipClose — `ids-tooltip-close` close action for `closable` tooltips.
 *
 * Design-spec: a `24×24` IDS Icon Button (`variant: ghost neutral`,
 * `size: small`) rendering the `ctrl-close-16` glyph; activates
 * `ids-tooltip.dismiss("close-click")` on the nearest `ids-tooltip` host.
 * Renders nothing when the parent tooltip is not `closable`.
 */
import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { tooltipCloseStyles } from "./tooltip.styles.js";
import type { IdsTooltip } from "./tooltip.element.js";
import "../icon-button/register.js";

export class IdsTooltipClose extends LitElement {
  static override styles = [tooltipCloseStyles];

  /** Glyph slug — default `ctrl-close-16` per design-spec. */
  @property({ type: String })
  shape = "ctrl-close-16";

  /** Accessible label forwarded to the icon button. */
  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "Close tooltip";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-tooltip-close");
  }

  private get tooltip(): IdsTooltip | null {
    return this.closest("ids-tooltip");
  }

  private onClick = (): void => {
    this.tooltip?.dismiss("close-click");
  };

  override render() {
    if (!this.tooltip?.closable) return nothing;
    return html`
      <ids-icon-button
        variant="ghostNeutral"
        size="small"
        shape=${this.shape}
        arialabel=${this.ariaLabel}
        aria-label=${this.ariaLabel}
        @click=${this.onClick}
      ></ids-icon-button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-tooltip-close": IdsTooltipClose;
  }
}
