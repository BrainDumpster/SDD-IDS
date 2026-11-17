/**
 * IdsControlHelper — shared projected helper message for form controls.
 *
 * Tag: `ids-control-helper`
 * React parity: `IdsHelper` + `IdsHelperText` (`lib/react/ids/helper`)
 *
 * ```html
 * <ids-control-helper>Helper text</ids-control-helper>
 *
 * <ids-control-helper>
 *   <ids-icon slot="icon" shape="info-circ-solid" size="16"></ids-icon>
 *   Optional icon + helper text
 * </ids-control-helper>
 * ```
 */
import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import { controlMessageStyles } from "./control.styles.js";

export class IdsControlHelper extends LitElement {
  static override styles = [controlMessageStyles];

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state()
  private hasIconSlot = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-control-helper");
  }

  override updated(): void {
    this.toggleAttribute("data-disabled", this.disabled);
    this.toggleAttribute("data-has-icon", this.hasIconSlot);
  }

  private onIconSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.hasIconSlot = slot.assignedNodes({ flatten: true }).length > 0;
  };

  override render() {
    return html`
      <span
        class="ids-control-icon"
        data-ids="ids-control-helper-icon"
        aria-hidden="true"
        ?hidden=${!this.hasIconSlot}
      >
        <slot name="icon" @slotchange=${this.onIconSlotChange}></slot>
      </span>
      <span class="ids-control-text" data-ids="ids-control-helper-text">
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-control-helper": IdsControlHelper;
  }
}
