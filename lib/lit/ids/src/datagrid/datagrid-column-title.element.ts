/**
 * Anatomy: `DatagridColumnTitle` — projected header label (Angular `ids-datagrid-column-title`).
 */
import { LitElement, css, html } from "lit";

export class IdsDatagridColumnTitle extends LitElement {
  static override styles = css`
    :host {
      display: none;
    }
  `;

  /** Plain text title collected by the parent column. */
  get text(): string {
    return (this.textContent ?? "").trim();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridColumnTitle");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-datagrid-column-title": IdsDatagridColumnTitle;
  }
}
