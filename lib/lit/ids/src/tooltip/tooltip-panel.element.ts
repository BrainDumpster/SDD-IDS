/**
 * IdsTooltipPanel — portaled popup shell + arrow + body slot.
 */
import { LitElement, html } from "lit";
import { state } from "lit/decorators.js";
import type { IdsTooltipArrowAlign, IdsTooltipSide } from "./tooltip.constants.js";
import { tooltipPanelStyles } from "./tooltip.styles.js";
import type { IdsTooltip } from "./tooltip.element.js";

export class IdsTooltipPanel extends LitElement {
  static override styles = [tooltipPanelStyles];

  @state()
  private arrowSide: IdsTooltipSide = "top";

  @state()
  private arrowAlign: IdsTooltipArrowAlign = "center";

  private get tooltip(): IdsTooltip | null {
    // After portal to body, closest no longer finds host — keep weak ref.
    return this._tooltip;
  }

  private _tooltip: IdsTooltip | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-tooltip-panel");
    this.setAttribute("role", "tooltip");
    const parent = this.closest("ids-tooltip");
    if (parent) this._tooltip = parent;
    this.addEventListener("mouseenter", this.onEnter);
    this.addEventListener("mouseleave", this.onLeave);
  }

  override disconnectedCallback(): void {
    this.removeEventListener("mouseenter", this.onEnter);
    this.removeEventListener("mouseleave", this.onLeave);
    super.disconnectedCallback();
  }

  setArrow(
    side: IdsTooltipSide,
    align: IdsTooltipArrowAlign,
    _offset: number,
  ): void {
    this.arrowSide = side;
    this.arrowAlign = align;
  }

  private onEnter = (): void => {
    // Keep open while pointer is on popup (non-closable).
    if (!this.tooltip?.closable) {
      this.tooltip?.requestOpenImmediate();
    }
  };

  private onLeave = (): void => {
    this.tooltip?.requestClose();
  };

  override render() {
    return html`
      <span
        class="ids-tooltip-arrow"
        data-ids="ids-tooltip-arrow"
        data-side=${this.arrowSide}
        data-align=${this.arrowAlign}
        aria-hidden="true"
      >
        <span class="ids-tooltip-arrow-graphic">
          <svg class="ids-tooltip-arrow-svg" viewBox="0 0 10 6">
            <path
              class="ids-tooltip-arrow-fill"
              d="M0.5 5.5L5 0.5L9.5 5.5L9.5 6.5L0.5 6.5Z"
            ></path>
            <path
              class="ids-tooltip-arrow-stroke"
              d="M0.5 5.5L5 0.5L9.5 5.5"
            ></path>
          </svg>
        </span>
      </span>
      <div class="ids-tooltip-panel" data-ids="ids-tooltip-panel-surface">
        <div class="ids-tooltip-scroll" data-ids="ids-tooltip-scroll">
          <div class="ids-tooltip-content" data-ids="ids-tooltip-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-tooltip-panel": IdsTooltipPanel;
  }
}
