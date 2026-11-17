/**
 * Anatomy: `DatagridCell` — cell value keyed by `field`.
 * Angular: `ids-datagrid-cell` · React: `IdsDatagridCell`
 */
import { LitElement, PropertyValues, css, html } from "lit";
import { property } from "lit/decorators.js";
import { findDatagridHost } from "./datagrid.utils.js";
import type { IdsDatagridRow } from "./datagrid-row.element.js";

export class IdsDatagridCell extends LitElement {
  static override styles = css`
    :host {
      display: none;
    }
  `;

  @property({ type: String, reflect: true })
  field = "";

  @property({ type: String })
  value = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridCell");
    this.sync();
  }

  override updated(changed: PropertyValues<this>): void {
    if (changed.has("field") || changed.has("value")) this.sync();
  }

  /** Invoked by row after registration. */
  sync(): void {
    if (!this.field) return;
    const row = this.closest("ids-datagrid-row") as IdsDatagridRow | null;
    const host = findDatagridHost(this);
    if (!row?.rowId || !host) return;
    const text =
      this.value !== "" && this.value != null
        ? String(this.value)
        : (this.textContent ?? "").trim();
    host.setRowCell(row.rowId, this.field, text);
  }

  override render() {
    return html`<slot @slotchange=${() => this.sync()}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-datagrid-cell": IdsDatagridCell;
  }
}
