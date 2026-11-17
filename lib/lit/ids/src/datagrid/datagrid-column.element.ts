/**
 * Anatomy: `DatagridColumnHeader` metadata + optional title/filter children.
 * Does not paint header chrome — host owns L-frame / colgroup / sticky pins.
 *
 * Angular: `ids-datagrid-column`
 * React: `IdsDatagridColumn`
 */
import { LitElement, PropertyValues, css, html } from "lit";
import { property } from "lit/decorators.js";
import type { IdsDatagridColumnAlign } from "./datagrid.constants.js";
import { findDatagridHost } from "./datagrid.utils.js";
import type { IdsDatagridColumnTitle } from "./datagrid-column-title.element.js";
import type { IdsDatagridFilter } from "./datagrid-filter.element.js";

export class IdsDatagridColumn extends LitElement {
  static override styles = css`
    :host {
      display: none;
    }
  `;

  /** Column key (`DatagridColumn.key` / Angular `field`). */
  @property({ type: String, reflect: true })
  field = "";

  @property({ type: String })
  title = "";

  @property({ type: Number, attribute: "minwidth" })
  minWidth?: number;

  @property({ type: Number })
  width?: number;

  @property({ type: Number, attribute: "defaultwidth" })
  defaultWidth?: number;

  @property({ type: Boolean, reflect: true })
  sortable = false;

  @property({ type: Boolean, reflect: true })
  filterable = false;

  @property({ type: Boolean, attribute: "filteractive", reflect: true })
  filterActive = false;

  @property({ type: Boolean, attribute: "columnhideable", reflect: true })
  columnHideable = false;

  @property({ type: String, reflect: true })
  align: IdsDatagridColumnAlign = "left";

  private lastTitle = "";
  /** Cached so L-frame portal reparenting does not drop the filter reference. */
  private cachedFilterEl: HTMLElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridColumn");
    this.syncColumn();
  }

  override disconnectedCallback(): void {
    const host = findDatagridHost(this);
    if (this.field && host) host.unregisterColumn(this.field);
    super.disconnectedCallback();
  }

  override updated(changed: PropertyValues<this>): void {
    if (
      changed.has("field") ||
      changed.has("title") ||
      changed.has("minWidth") ||
      changed.has("width") ||
      changed.has("defaultWidth") ||
      changed.has("sortable") ||
      changed.has("filterable") ||
      changed.has("filterActive") ||
      changed.has("columnHideable") ||
      changed.has("align")
    ) {
      this.syncColumn();
    }
  }

  /** Called by host when light-DOM children change. */
  syncRegistration(): void {
    this.syncColumn();
  }

  private resolveTitle(): string {
    const titleEl = this.querySelector("ids-datagrid-column-title") as IdsDatagridColumnTitle | null;
    const fromSlot = titleEl?.text ?? "";
    return fromSlot || this.title || this.field;
  }

  private syncColumn(): void {
    if (!this.field) return;
    const host = findDatagridHost(this);
    if (!host) return;
    const title = this.resolveTitle();
    this.lastTitle = title;
    const found = this.querySelector("ids-datagrid-filter") as IdsDatagridFilter | null;
    if (found) this.cachedFilterEl = found;
    host.registerColumn({
      field: this.field,
      title,
      minWidth: this.minWidth,
      width: this.width,
      defaultWidth: this.defaultWidth,
      sortable: this.sortable,
      filterable: this.filterable,
      filterActive: this.filterActive,
      columnHideable: this.columnHideable,
      align: this.align,
      filterEl: found ?? this.cachedFilterEl,
    });
  }

  override render() {
    // Keep children in light DOM for host filter portal + title text.
    return html`<slot @slotchange=${() => this.syncColumn()}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-datagrid-column": IdsDatagridColumn;
  }
}
