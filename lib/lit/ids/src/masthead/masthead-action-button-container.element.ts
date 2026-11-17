/**
 * IdsMastheadActionButtonContainer — horizontal cluster for masthead utilities.
 *
 * Tag: `ids-masthead-action-button-container`
 * Spec: `components/ids/masthead/design-spec.md` → MastheadActionButtonContainer
 */
import { LitElement, html } from "lit";
import { actionButtonContainerStyles } from "./masthead.styles.js";

export class IdsMastheadActionButtonContainer extends LitElement {
  static override styles = [actionButtonContainerStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsMastheadActionButtonContainer");
  }

  override render() {
    return html`
      <div
        class="IdsMastheadActionButtonContainer"
        data-ids="IdsMastheadActionButtonContainer"
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-masthead-action-button-container": IdsMastheadActionButtonContainer;
  }
}
