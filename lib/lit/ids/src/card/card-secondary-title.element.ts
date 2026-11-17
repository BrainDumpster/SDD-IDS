/**
 * IdsCardSecondaryTitle — optional secondary title (Figma Dashboard-Element-Card).
 * Rendered inline after `|` when used with `title` — Body 1 /
 * `var(--color-text-gray-neutral)`.
 *
 * Tag: `ids-card-secondary-title`
 * Place in `ids-card` slot `secondary-title`, or rely on `secondarytitle` attr.
 */
import { LitElement, html } from "lit";
import { cardSecondaryTitleStyles } from "./card.styles.js";

export class IdsCardSecondaryTitle extends LitElement {
  static override styles = [cardSecondaryTitleStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-card-secondary-title-host");
    if (!this.getAttribute("slot")) {
      this.setAttribute("slot", "secondary-title");
    }
  }

  override render() {
    return html`
      <span
        class="ids-card-secondary-title"
        data-ids="ids-card-secondary-title"
      >
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-card-secondary-title": IdsCardSecondaryTitle;
  }
}
