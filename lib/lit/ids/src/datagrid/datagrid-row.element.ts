/**
 * Anatomy: `DatagridRow` — registers row id; cells sync values into the host.
 * Angular: `ids-datagrid-row` · React: `IdsDatagridRow`
 */
import { LitElement, PropertyValues, css, html } from "lit";
import { property } from "lit/decorators.js";
import { findDatagridHost } from "./datagrid.utils.js";

export class IdsDatagridRow extends LitElement {
  static override styles = css`
    :host {
      display: none;
    }
  `;

  @property({ type: String, attribute: "row-id", reflect: true })
  rowId = "";

  /** Angular alias `rowId` as attribute `rowid`. */
  @property({ type: String, attribute: "rowid" })
  set rowid(value: string) {
    this.rowId = value ?? "";
  }
  get rowid(): string {
    return this.rowId;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridRow");
    this.syncRow();
  }

  override disconnectedCallback(): void {
    const host = findDatagridHost(this);
    if (this.rowId && host) host.unregisterRow(this.rowId);
    super.disconnectedCallback();
  }

  override updated(changed: PropertyValues<this>): void {
    if (changed.has("rowId")) this.syncRow();
  }

  private syncRow(): void {
    if (!this.rowId) return;
    const host = findDatagridHost(this);
    if (!host) return;
    host.registerRow({ rowId: this.rowId, cells: new Map() });
    // Re-sync cells after row registration.
    for (const cell of this.querySelectorAll("ids-datagrid-cell")) {
      (cell as { sync?: () => void }).sync?.();
    }
  }

  override render() {
    return html`<slot @slotchange=${() => this.syncRow()}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-datagrid-row": IdsDatagridRow;
  }
}
