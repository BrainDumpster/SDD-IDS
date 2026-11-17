/**
 * Anatomy: `DatagridDetailPanelSlot` — sibling of grid wrap (not a `<col>`).
 * Angular: `ids-datagrid-detail-panel` · React: `IdsDatagridDetailPanel`
 *
 * Prefer projecting `ids-detail-panel attachmode="datagrid"` as the child.
 * When omitted and host `withDetailPanel` is true, the grid renders a default
 * `ids-detail-panel` itself.
 */
import { LitElement, css, html } from "lit";
import { findDatagridHost } from "./datagrid.utils.js";

export class IdsDatagridDetailPanel extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex: 0 0 auto;
      align-self: stretch;
      min-height: 0;
      box-sizing: border-box;
    }

    :host([hidden]) {
      display: none !important;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridDetailPanel");
    this.classList.add("detailPanel");
    if (this.getAttribute("slot") !== "detail-panel") {
      this.setAttribute("slot", "detail-panel");
    }
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
    "ids-datagrid-detail-panel": IdsDatagridDetailPanel;
  }
}
