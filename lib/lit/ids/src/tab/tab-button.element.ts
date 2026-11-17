/**
 * IdsTabButton — composition carrier for tab label text.
 * Tag: `ids-tab-button` (React `IdsTabButton` parity).
 * Collected by `ids-tabs`; not rendered on its own.
 */
import { LitElement, html } from "lit";
import { tabCarrierStyles } from "./tab.styles.js";

export class IdsTabButton extends LitElement {
  static override styles = [tabCarrierStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-tab-button");
  }

  /** Label text from light DOM. */
  get labelText(): string {
    return (this.textContent ?? "").trim();
  }

  override render() {
    return html`<slot></slot>`;
  }
}
