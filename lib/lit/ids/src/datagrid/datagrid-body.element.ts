/**
 * Anatomy: `DatagridBody` — row collection wrapper (data-only; not the scroll viewport).
 * Angular: `ids-datagrid-body` · React: `IdsDatagridBody`
 */
import { LitElement, css, html } from "lit";

export class IdsDatagridBody extends LitElement {
  static override styles = css`
    :host {
      display: contents;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridBody");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-datagrid-body": IdsDatagridBody;
  }
}
