/**
 * Numeric column filter panel — React `IdsDatagridNumericFilter` parity
 * (Figma `.Filter-Element-NumericFilter` `44360:182265`).
 *
 * Tag: `ids-datagrid-filter-numeric`
 * Event: `state-change` detail: IdsDatagridNumericFilterState
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import "../icon/register.js";
import {
  IDS_DATAGRID_NUMERIC_OPERATOR_LABELS,
  defaultIdsDatagridNumericFilterState,
  type IdsDatagridNumericFilterState,
  type IdsDatagridNumericOperator,
} from "./datagrid-numeric-filter.model.js";
import { datagridNumericFilterStyles } from "./datagrid-filter-numeric.styles.js";

export interface IdsDatagridNumericUnitOption {
  value: string;
  label: string;
}

const NUMERIC_OPERATORS: IdsDatagridNumericOperator[] = [
  "all",
  "equals",
  "not-equals",
  "greater-than",
  "greater-than-equal",
  "less-than",
  "less-than-equal",
  "between",
];

function operatorNeedsValue(operator: IdsDatagridNumericOperator): boolean {
  return operator !== "all";
}

let numericUid = 0;

export class IdsDatagridFilterNumeric extends LitElement {
  static override styles = [datagridNumericFilterStyles];

  @property({ type: String, attribute: "grouplabel" })
  groupLabel = "Numeric";

  @property({ attribute: false })
  state: IdsDatagridNumericFilterState = defaultIdsDatagridNumericFilterState();

  @property({ attribute: false })
  unitOptions: IdsDatagridNumericUnitOption[] = [];

  @state() private unitOpenFor: "primary" | "end" | null = null;
  @state() private pointerFocusKey: string | null = null;

  private readonly instanceId = `ids-dg-num-${++numericUid}`;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridFilterNumeric");
    this.setAttribute("data-numeric-filter", "");
  }

  private emitState(next: IdsDatagridNumericFilterState): void {
    this.state = next;
    this.dispatchEvent(
      new CustomEvent("state-change", {
        detail: { state: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private setOperator(operator: IdsDatagridNumericOperator): void {
    if (operator === "all") {
      this.emitState(defaultIdsDatagridNumericFilterState());
      return;
    }
    this.emitState({ ...this.state, operator });
  }

  private renderUnitDropdown(
    which: "primary" | "end",
    value: string | undefined,
    onChange: (next: string) => void,
    ariaLabel: string,
  ) {
    if (!this.unitOptions.length) return nothing;
    const open = this.unitOpenFor === which;
    const selectedLabel =
      this.unitOptions.find((o) => o.value === value)?.label ?? "-Select-";
    return html`
      <div class="unitDropdownWrap">
        <div class="unitDropdownRoot">
          <button
            type="button"
            class="unitTriggerBtn"
            aria-haspopup="listbox"
            aria-expanded=${open ? "true" : "false"}
            aria-label=${ariaLabel}
            @click=${(e: Event) => {
              e.stopPropagation();
              this.unitOpenFor = open ? null : which;
            }}
          >
            <span class="unitTriggerLabel">${selectedLabel}</span>
            <span class="unitTriggerCaret" aria-hidden="true">
              <ids-icon shape-name="arrow-drop-tri-caret" size="10"></ids-icon>
            </span>
          </button>
          ${open
            ? html`
                <div class="unitPopup" role="listbox">
                  ${this.unitOptions.map(
                    (opt) => html`
                      <button
                        type="button"
                        class="unitOption"
                        role="option"
                        aria-selected=${opt.value === value ? "true" : "false"}
                        data-selected=${opt.value === value ? "" : nothing}
                        @click=${(e: Event) => {
                          e.stopPropagation();
                          onChange(opt.value);
                          this.unitOpenFor = null;
                        }}
                      >
                        ${opt.label}
                      </button>
                    `,
                  )}
                </div>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  private renderValueField(opts: {
    id: string;
    helperText: string;
    value: string;
    onChange: (next: string) => void;
    ariaLabel: string;
    unitValue?: string;
    onUnitChange?: (next: string) => void;
    unitAriaLabel?: string;
    unitWhich: "primary" | "end";
  }) {
    const hasUnit = this.unitOptions.length > 0;
    return html`
      <div class="valueField">
        <div class=${hasUnit ? "valueRow" : nothing}>
          <span class="valueInputWrap">
            <input
              id=${opts.id}
              type="text"
              inputmode="decimal"
              class="valueInput"
              .value=${opts.value}
              aria-label=${opts.ariaLabel}
              data-pointer-focus=${this.pointerFocusKey === opts.id ? "true" : nothing}
              @pointerdown=${() => {
                this.pointerFocusKey = opts.id;
              }}
              @blur=${() => {
                this.pointerFocusKey = null;
              }}
              @input=${(e: Event) => opts.onChange((e.target as HTMLInputElement).value)}
            />
          </span>
          ${hasUnit && opts.onUnitChange && opts.unitAriaLabel
            ? this.renderUnitDropdown(
                opts.unitWhich,
                opts.unitValue,
                opts.onUnitChange,
                opts.unitAriaLabel,
              )
            : nothing}
        </div>
        <p class="valueHelper">${opts.helperText}</p>
      </div>
    `;
  }

  override render() {
    const slug = this.groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "numeric";
    const groupName = `${this.instanceId}-${slug}`;

    return html`
      <div
        class="root"
        role="radiogroup"
        aria-label=${`${this.groupLabel}: numeric filter`}
        data-numeric-filter=""
        data-ids="ids-datagrid-numeric-filter"
      >
        ${NUMERIC_OPERATORS.map((operator) => {
          const checked = this.state.operator === operator;
          const inputId = `${groupName}-op-${operator}`;
          const showSingleValue =
            checked && operatorNeedsValue(operator) && operator !== "between";
          const showBetween = checked && operator === "between";
          return html`
            <div>
              <div class="optionRow">
                <label
                  class="optionLabel"
                  for=${inputId}
                  @click=${operator === "all"
                    ? () => this.setOperator("all")
                    : undefined}
                >
                  <span class="radioRoot" data-checked=${checked ? "" : nothing}>
                    <input
                      type="radio"
                      id=${inputId}
                      class="radioInput"
                      name=${groupName}
                      value=${operator}
                      .checked=${checked}
                      @change=${() => this.setOperator(operator)}
                    />
                    <span
                      class="radioIndicator"
                      data-checked=${checked ? "" : nothing}
                    ></span>
                  </span>
                  ${IDS_DATAGRID_NUMERIC_OPERATOR_LABELS[operator]}
                </label>
              </div>
              ${showSingleValue
                ? html`
                    <div class="valueBlock">
                      ${this.renderValueField({
                        id: `${groupName}-value`,
                        helperText: "Numeric value",
                        value: this.state.value ?? "",
                        onChange: (value) => this.emitState({ ...this.state, value }),
                        ariaLabel: `${this.groupLabel} numeric value`,
                        unitValue: this.state.unit,
                        onUnitChange: (unit) => this.emitState({ ...this.state, unit }),
                        unitAriaLabel: `${this.groupLabel} unit`,
                        unitWhich: "primary",
                      })}
                    </div>
                  `
                : nothing}
              ${showBetween
                ? html`
                    <div class="valueBlock">
                      ${this.renderValueField({
                        id: `${groupName}-start`,
                        helperText: "Starting value",
                        value: this.state.value ?? "",
                        onChange: (value) => this.emitState({ ...this.state, value }),
                        ariaLabel: `${this.groupLabel} starting value`,
                        unitValue: this.state.unit,
                        onUnitChange: (unit) => this.emitState({ ...this.state, unit }),
                        unitAriaLabel: `${this.groupLabel} starting value unit`,
                        unitWhich: "primary",
                      })}
                      ${this.renderValueField({
                        id: `${groupName}-end`,
                        helperText: "Ending value",
                        value: this.state.valueEnd ?? "",
                        onChange: (valueEnd) => this.emitState({ ...this.state, valueEnd }),
                        ariaLabel: `${this.groupLabel} ending value`,
                        unitValue: this.state.unitEnd,
                        onUnitChange: (unitEnd) =>
                          this.emitState({ ...this.state, unitEnd }),
                        unitAriaLabel: `${this.groupLabel} ending value unit`,
                        unitWhich: "end",
                      })}
                    </div>
                  `
                : nothing}
            </div>
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-datagrid-filter-numeric": IdsDatagridFilterNumeric;
  }
}
