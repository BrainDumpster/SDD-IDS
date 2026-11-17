/**
 * Multiselect column filter — Angular `ids-datagrid-filter-multiselect`
 * / React `IdsDatagridMultiselectFilter` (Figma checkbox list).
 */
import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import "../checkbox/register.js";

export class IdsDatagridFilterMultiselect extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .filterMultiselectPanel {
      display: flex;
      flex-direction: column;
      gap: 0;
      padding: 0;
      width: 100%;
      box-sizing: border-box;
      background: var(--color-background-surface-component);
    }

    .filterOptionRow {
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 40px;
      padding: var(--padding-padding-10, 10px) var(--padding-padding-16, 16px);
      box-sizing: border-box;
      background: var(--color-background-surface-component);
      transition: background 80ms ease;
      cursor: pointer;
    }

    .filterOptionRow:hover {
      background: var(--color-background-brand-lighter-slate);
      box-shadow:
        inset 0 1px 0 0 var(--color-border-brand-base-neutral),
        inset 0 -1px 0 0 var(--color-border-brand-base-neutral);
    }

    .filterOptionRow ids-checkbox {
      display: flex;
      width: 100%;
    }
  `;

  @property({ attribute: false })
  options: string[] = [];

  @property({ attribute: false })
  selectedValues: string[] = [];

  @property({ type: String, attribute: "grouplabel" })
  groupLabel = "Filter";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridFilterMultiselect");
  }

  private isSelected(option: string): boolean {
    return this.selectedValues.includes(option);
  }

  private onToggle(option: string, checked: boolean): void {
    const next = new Set(this.selectedValues);
    if (checked) next.add(option);
    else next.delete(option);
    this.selectedValues = [...next];
    this.dispatchEvent(
      new CustomEvent("selected-values-change", {
        detail: { selectedValues: this.selectedValues },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="filterMultiselectPanel" role="group" aria-label=${this.groupLabel}>
        ${this.options.map(
          (option) => html`
            <div class="filterOptionRow">
              <ids-checkbox
                .checked=${this.isSelected(option)}
                @checked-change=${(e: CustomEvent<boolean>) => {
                  this.onToggle(option, Boolean(e.detail));
                }}
              >
                <label>${option}</label>
              </ids-checkbox>
            </div>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-datagrid-filter-multiselect": IdsDatagridFilterMultiselect;
  }
}
