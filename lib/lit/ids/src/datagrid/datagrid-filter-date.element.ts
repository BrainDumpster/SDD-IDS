/**
 * Date column filter panel — React `IdsDatagridDateFilter` parity
 * (Figma `.Filter-Element-DateFilter` `37822:90838`).
 *
 * Tag: `ids-datagrid-filter-date`
 * Event: `state-change` detail: IdsDatagridDateFilterState
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import "../date-picker/register.js";
import {
  IDS_DATAGRID_DATE_FILTER_MODES,
  IDS_DATAGRID_DATE_MODE_LABELS,
  defaultIdsDatagridDateFilterState,
  formatIdsDatagridDateFilterSummary,
  type IdsDatagridDateFilterMode,
  type IdsDatagridDateFilterState,
} from "./datagrid-date-filter.model.js";
import { datagridDateTimeFilterStyles } from "./datagrid-filter-datetime.styles.js";

function modeShowsSummary(mode: IdsDatagridDateFilterMode): boolean {
  return mode !== "specific-date" && mode !== "custom-range";
}

let dateUid = 0;

export class IdsDatagridFilterDate extends LitElement {
  static override styles = [datagridDateTimeFilterStyles];

  @property({ type: String, attribute: "grouplabel" })
  groupLabel = "Date";

  @property({ attribute: false })
  state: IdsDatagridDateFilterState = defaultIdsDatagridDateFilterState();

  @state() private hoverMode: IdsDatagridDateFilterMode | null = null;

  private readonly instanceId = `ids-dg-date-${++dateUid}`;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridFilterDate");
    this.setAttribute("data-date-filter", "");
  }

  private emitState(next: IdsDatagridDateFilterState): void {
    this.state = next;
    this.dispatchEvent(
      new CustomEvent("state-change", {
        detail: { state: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private setMode(mode: IdsDatagridDateFilterMode): void {
    if (mode === "all") {
      this.emitState(defaultIdsDatagridDateFilterState());
      return;
    }
    this.emitState({ ...this.state, mode });
  }

  private suppressRadioFocusOnPointer(event: MouseEvent): void {
    if (event.button === 0) event.preventDefault();
  }

  override render() {
    const slug = this.groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "date";
    const groupName = `${this.instanceId}-${slug}`;

    return html`
      <div
        class="root"
        role="radiogroup"
        aria-label=${`${this.groupLabel}: date filter`}
        data-date-filter=""
        data-ids="ids-datagrid-date-filter"
      >
        ${IDS_DATAGRID_DATE_FILTER_MODES.map((mode) => {
          const checked = this.state.mode === mode;
          const inputId = `${groupName}-mode-${mode}`;
          const isHovered = this.hoverMode === mode;
          const canShowSummary = modeShowsSummary(mode);
          const summaryState: IdsDatagridDateFilterState = checked
            ? this.state
            : { ...this.state, mode };
          const summary = canShowSummary
            ? formatIdsDatagridDateFilterSummary(summaryState)
            : null;
          const summaryVisible = (checked || isHovered) && summary != null;
          const showSpecific = checked && mode === "specific-date";
          const showCustom = checked && mode === "custom-range";

          return html`
            <div>
              <div
                class="optionRow"
                @mouseenter=${() => {
                  this.hoverMode = mode;
                }}
                @mouseleave=${() => {
                  this.hoverMode = null;
                }}
              >
                <label
                  class="optionLabel"
                  for=${inputId}
                  @mousedown=${this.suppressRadioFocusOnPointer}
                  @click=${mode === "all" ? () => this.setMode("all") : undefined}
                >
                  <span class="radioRoot" data-checked=${checked ? "" : nothing}>
                    <input
                      type="radio"
                      id=${inputId}
                      class="radioInput"
                      name=${groupName}
                      value=${mode}
                      .checked=${checked}
                      @change=${() => this.setMode(mode)}
                    />
                    <span
                      class="radioIndicator"
                      data-checked=${checked ? "" : nothing}
                    ></span>
                  </span>
                  <span class="labelText">${IDS_DATAGRID_DATE_MODE_LABELS[mode]}</span>
                </label>
                ${summary != null
                  ? html`
                      <span
                        class="summary"
                        aria-hidden="true"
                        style="visibility:${summaryVisible ? "visible" : "hidden"}"
                      >
                        ${summary}
                      </span>
                    `
                  : nothing}
              </div>
              ${showSpecific
                ? html`
                    <div class="expandedBlock">
                      <div class="dateTimeRow">
                        <div class="dateField">
                          <ids-date-picker
                            label="Date:"
                            formathint="MM-DD-YYYY"
                            placeholder="MM-DD-YYYY"
                            .value=${this.state.specificDate ?? null}
                            @change=${(e: CustomEvent<{ date: Date | null }>) =>
                              this.emitState({
                                ...this.state,
                                specificDate: e.detail.date,
                              })}
                          ></ids-date-picker>
                        </div>
                      </div>
                    </div>
                  `
                : nothing}
              ${showCustom
                ? html`
                    <div class="expandedBlock">
                      <div class="customRangeColumns">
                        <div class="rangeColumn">
                          <ids-date-picker
                            label="Start:"
                            labellayout="above"
                            formathint="MM-DD-YYYY"
                            placeholder="MM-DD-YYYY"
                            .value=${this.state.rangeStartDate ?? null}
                            @change=${(e: CustomEvent<{ date: Date | null }>) =>
                              this.emitState({
                                ...this.state,
                                rangeStartDate: e.detail.date,
                              })}
                          ></ids-date-picker>
                        </div>
                        <div class="rangeColumn">
                          <ids-date-picker
                            label="End:"
                            labellayout="above"
                            formathint="MM-DD-YYYY"
                            placeholder="MM-DD-YYYY"
                            .value=${this.state.rangeEndDate ?? null}
                            @change=${(e: CustomEvent<{ date: Date | null }>) =>
                              this.emitState({
                                ...this.state,
                                rangeEndDate: e.detail.date,
                              })}
                          ></ids-date-picker>
                        </div>
                      </div>
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
    "ids-datagrid-filter-date": IdsDatagridFilterDate;
  }
}
