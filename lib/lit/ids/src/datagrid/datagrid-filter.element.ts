/**
 * Anatomy: `FilterPanelBody` slot — holds filter inner UI only.
 * L-frame (`FilterToggle` / tab / panel) is owned by `ids-datagrid`.
 *
 * Angular: `ids-datagrid-filter` + TemplateRef
 * React: `IdsDatagridFilter`
 */
import { LitElement, css, html } from "lit";

export class IdsDatagridFilter extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridFilter");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-datagrid-filter": IdsDatagridFilter;
  }
}
