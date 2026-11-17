/**
 * Anatomy: `DatagridFooter` / `DatagridPaginationSlot`.
 * Angular: `ids-datagrid-footer` · React: `IdsDatagridFooter`
 */
import { LitElement, css, html } from "lit";
import { findDatagridHost } from "./datagrid.utils.js";

export class IdsDatagridFooter extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridFooter");
    findDatagridHost(this)?.requestSync();
  }

  override disconnectedCallback(): void {
    findDatagridHost(this)?.requestSync();
    super.disconnectedCallback();
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-datagrid-footer": IdsDatagridFooter;
  }
}
