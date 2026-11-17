/**
 * IdsCardTextContent — Content Type=Text (Figma `15718:219736`).
 *
 * Tag: `ids-card-text-content`
 */
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { cardTextContentStyles } from "./card.styles.js";

export class IdsCardTextContent extends LitElement {
  static override styles = [cardTextContentStyles];

  @property({ type: String, attribute: "sectiontitle" })
  sectionTitle = "Section Title";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-card-text-content");
  }

  override render() {
    return html`
      <div class="ids-card-text-content" data-ids="ids-card-text-content-root">
        <p class="ids-card-text-section-title">${this.sectionTitle}</p>
        <div class="ids-card-text-paragraph"><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-card-text-content": IdsCardTextContent;
  }
}
