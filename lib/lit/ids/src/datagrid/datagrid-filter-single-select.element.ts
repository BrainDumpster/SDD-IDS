/**
 * Single-select column filter — Angular `ids-datagrid-filter-single-select`
 * / React `IdsDatagridSingleSelectFilter`.
 */
import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

export class IdsDatagridFilterSingleSelect extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .filterSingleSelectPanel {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 160px;
      max-height: 366px;
      overflow-y: auto;
      padding: 0 0 var(--padding-padding-4, 4px);
      box-sizing: border-box;
      background: var(--color-background-surface-component);
    }

    .filterOption {
      appearance: none;
      -webkit-appearance: none;
      border: none;
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 40px;
      text-align: left;
      padding: var(--padding-padding-10, 10px) var(--padding-padding-16, 16px);
      font-size: var(--font-size-body-2, 14px);
      font-weight: 400;
      line-height: var(--font-line-height-line-height-20, 20px);
      color: var(--color-text-gray-neutral);
      background: var(--color-background-surface-component);
      cursor: pointer;
      box-sizing: border-box;
      transition: background 80ms ease;
    }

    .filterOption:hover {
      background: var(--color-background-brand-lighter-slate);
      box-shadow:
        inset 0 1px 0 0 var(--color-border-brand-base-neutral),
        inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
    }

    .filterOption:active,
    .filterOptionSelected {
      background: var(--color-background-brand-light-slate);
      color: var(--color-text-brand-strong);
      box-shadow:
        inset 0 1px 0 0 var(--color-border-brand-base-neutral),
        inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
    }
  `;

  @property({ attribute: false })
  options: string[] = [];

  @property({ attribute: false })
  selectedValue: string | null = null;

  @property({ type: String, attribute: "arialabel" })
  ariaLabel = "Filter options";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridFilterSingleSelect");
  }

  private select(value: string | null): void {
    this.selectedValue = value;
    this.dispatchEvent(
      new CustomEvent("selected-value-change", {
        detail: { selectedValue: value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="filterSingleSelectPanel" role="listbox" aria-label=${this.ariaLabel}>
        <button
          type="button"
          class=${classMap({
            filterOption: true,
            filterOptionSelected: this.selectedValue === null,
          })}
          @click=${() => this.select(null)}
        >
          All
        </button>
        ${this.options.map(
          (option) => html`
            <button
              type="button"
              class=${classMap({
                filterOption: true,
                filterOptionSelected: this.selectedValue === option,
              })}
              role="option"
              aria-selected=${this.selectedValue === option ? "true" : "false"}
              @click=${() => this.select(option)}
            >
              ${option}
            </button>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-datagrid-filter-single-select": IdsDatagridFilterSingleSelect;
  }
}
