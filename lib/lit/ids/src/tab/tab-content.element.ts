/**
 * IdsTabContent — composition carrier for tab panel body.
 * Tag: `ids-tab-content` (React `IdsTabContent` parity).
 * Collected by `ids-tabs`; panel body is projected when active.
 */
import { LitElement, html } from "lit";
import { tabCarrierStyles } from "./tab.styles.js";

export class IdsTabContent extends LitElement {
  static override styles = [tabCarrierStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-tab-content");
  }

  override render() {
    return html`<slot></slot>`;
  }
}
