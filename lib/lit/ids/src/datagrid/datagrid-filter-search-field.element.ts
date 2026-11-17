/**
 * Default text filter search field — Angular `ids-datagrid-filter-search-field`
 * / React `IdsDatagridTextFilter` (Figma `37822:91077`).
 */
import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import "../icon/register.js";

export class IdsDatagridFilterSearchField extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }

    .searchRow {
      padding: var(--padding-padding-8, 8px);
      width: 100%;
      box-sizing: border-box;
    }

    .searchField {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      border: var(--border-width-border-default, 1px) solid var(--color-border-gray-neutral-base);
      background: var(--color-background-surface-component);
      padding: var(--padding-padding-2, 2px) var(--padding-padding-16, 16px);
    }

    .searchField[data-focus-visible="true"]::after {
      content: "";
      position: absolute;
      inset: -4px;
      border: var(--border-width-border-default, 1px) solid var(--color-border-brand-base);
      border-radius: var(--corner-radius-radius-4, 4px);
      pointer-events: none;
    }

    .searchIcon {
      flex-shrink: 0;
      color: var(--color-icon-brand-base);
    }

    .searchInputWrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1 1 auto;
      min-width: 0;
      gap: var(--spacing-space-8, 8px);
      padding-left: var(--padding-padding-8, 8px);
      padding-top: var(--padding-padding-4, 4px);
      padding-bottom: var(--padding-padding-4, 4px);
    }

    .searchInput {
      all: unset;
      flex: 1 1 auto;
      min-width: 0;
      font-size: var(--font-size-body-2, 14px);
      font-weight: 400;
      line-height: var(--font-line-height-line-height-20, 20px);
      color: var(--color-text-gray-neutral);
    }

    .searchClear {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 12px;
      height: 12px;
      flex-shrink: 0;
      cursor: pointer;
      color: var(--color-icon-gray-neutral-accessible);
    }
  `;

  @property({ type: String })
  placeholder = "Search";

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "Search column";

  @property({ type: String })
  query = "";

  @state() private searchFocused = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridFilterSearchField");
  }

  private emitQuery(value: string): void {
    this.query = value;
    this.dispatchEvent(
      new CustomEvent("query-change", {
        detail: { query: value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="searchRow">
        <div class="searchField" data-focus-visible=${this.searchFocused ? "true" : nothing}>
          <ids-icon class="searchIcon" shape-name="search-16" size="16"></ids-icon>
          <div class="searchInputWrap">
            <input
              type="search"
              class="searchInput"
              .value=${this.query}
              placeholder=${this.placeholder}
              aria-label=${this.ariaLabel}
              @input=${(e: Event) => this.emitQuery((e.target as HTMLInputElement).value)}
              @focus=${() => {
                this.searchFocused = true;
              }}
              @blur=${() => {
                this.searchFocused = false;
              }}
            />
            ${this.query.trim()
              ? html`
                  <button
                    type="button"
                    class="searchClear"
                    aria-label="Clear search"
                    @click=${() => this.emitQuery("")}
                  >
                    <ids-icon shape-name="ctrl-close-16" size="12"></ids-icon>
                  </button>
                `
              : nothing}
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-datagrid-filter-search-field": IdsDatagridFilterSearchField;
  }
}
