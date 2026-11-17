/**
 * IdsCardKeyValueContent — Content Type=Key Value Pair (Figma `15718:220110`).
 * Composes lit `ids-icon`.
 *
 * Tag: `ids-card-key-value-content`
 */
import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import "../icon/register.js";
import type { IdsCardKeyValueItem } from "./card.constants.js";
import { cardKeyValueContentStyles } from "./card.styles.js";

export class IdsCardKeyValueContent extends LitElement {
  static override styles = [cardKeyValueContentStyles];

  @property({ attribute: false })
  items: IdsCardKeyValueItem[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-card-key-value-content");
  }

  override render() {
    const items = Array.isArray(this.items) ? this.items : [];
    return html`
      <dl
        class="ids-card-key-value-list"
        data-ids="ids-card-key-value-content-root"
      >
        ${items.map(
          (item) => html`
            <div class="ids-card-key-value-row">
              <dt class="ids-card-key-value-label">${item.label}:</dt>
              <dd class="ids-card-key-value-value">
                ${item.iconSlug
                  ? html`<ids-icon
                      class="ids-card-key-value-icon"
                      shape=${item.iconSlug}
                      size="16"
                      color="var(--color-icon-gray-neutral-base)"
                    ></ids-icon>`
                  : nothing}
                <span>${item.value}</span>
              </dd>
            </div>
          `,
        )}
      </dl>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-card-key-value-content": IdsCardKeyValueContent;
  }
}
