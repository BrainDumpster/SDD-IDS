/**
 * IdsControlError — shared projected error message for form controls.
 *
 * Tag: `ids-control-error`
 * React parity: `IdsError` + `IdsErrorText` (`lib/react/ids/error`)
 *
 * Default critical icon when no `slot="icon"` is projected (hidden when disabled).
 *
 * ```html
 * <ids-control-error>Error message</ids-control-error>
 *
 * <ids-control-error nowrap>
 *   <ids-icon slot="icon" shape="status-critical-square-solid" size="16" variant="img"></ids-icon>
 *   Custom icon + error text
 * </ids-control-error>
 * ```
 */
import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import "../icon/register.js";
import { CONTROL_ERROR_ICON_SLUG } from "./control.constants.js";
import { controlMessageStyles } from "./control.styles.js";

export class IdsControlError extends LitElement {
  static override styles = [controlMessageStyles];

  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * When set, error copy stays on one line (Text Box design-spec).
   * Other form controls may omit it to allow wrapping.
   */
  @property({ type: Boolean, reflect: true })
  nowrap = false;

  @state()
  private hasIconSlot = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-control-error");
    this.setAttribute("role", "alert");
  }

  override updated(): void {
    this.toggleAttribute("data-disabled", this.disabled);
    // Default critical icon counts as having an icon (unless disabled).
    this.toggleAttribute(
      "data-has-icon",
      this.hasIconSlot || !this.disabled,
    );
  }

  private onIconSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.hasIconSlot = slot.assignedNodes({ flatten: true }).length > 0;
  };

  private renderDefaultIcon() {
    if (this.hasIconSlot || this.disabled) return null;
    return html`
      <ids-icon
        shape=${CONTROL_ERROR_ICON_SLUG}
        size="16"
        variant="img"
      ></ids-icon>
    `;
  }

  override render() {
    const showIconChrome = this.hasIconSlot || !this.disabled;
    return html`
      <span
        class="ids-control-icon"
        data-ids="ids-control-error-icon"
        aria-hidden="true"
        ?hidden=${!showIconChrome}
      >
        <slot name="icon" @slotchange=${this.onIconSlotChange}></slot>
        ${this.renderDefaultIcon()}
      </span>
      <span class="ids-control-text" data-ids="ids-control-error-text">
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-control-error": IdsControlError;
  }
}
