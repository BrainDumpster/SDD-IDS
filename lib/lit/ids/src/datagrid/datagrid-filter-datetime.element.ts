/**
 * Date and Time column filter panel — React `IdsDatagridDateTimeFilter` parity
 * (Figma `.Filter-Element-DateAndTimeFilter` `44360:181306`).
 *
 * Tag: `ids-datagrid-filter-datetime`
 * Event: `state-change` detail: IdsDatagridDateTimeFilterState
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import "../date-picker/register.js";
import "../time-picker/register.js";
import {
  IDS_DATAGRID_DATETIME_FILTER_MODES,
  IDS_DATAGRID_DATETIME_MODE_LABELS,
  defaultIdsDatagridDateTimeFilterState,
  formatIdsDatagridDateTimeFilterSummary,
  type IdsDatagridDateTimeFilterMode,
  type IdsDatagridDateTimeFilterState,
} from "./datagrid-datetime-filter.model.js";
import { datagridDateTimeFilterStyles } from "./datagrid-filter-datetime.styles.js";

function modeShowsSummary(mode: IdsDatagridDateTimeFilterMode): boolean {
  return mode !== "specific-date" && mode !== "custom-range";
}

let dateTimeUid = 0;

export class IdsDatagridFilterDateTime extends LitElement {
  static override styles = [datagridDateTimeFilterStyles];

  @property({ type: String, attribute: "grouplabel" })
  groupLabel = "Date and Time";

  @property({ attribute: false })
  state: IdsDatagridDateTimeFilterState = defaultIdsDatagridDateTimeFilterState();

  @state() private hoverMode: IdsDatagridDateTimeFilterMode | null = null;

  private readonly instanceId = `ids-dg-dt-${++dateTimeUid}`;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagridFilterDateTime");
    this.setAttribute("data-datetime-filter", "");
  }

  private emitState(next: IdsDatagridDateTimeFilterState): void {
    this.state = next;
    this.dispatchEvent(
      new CustomEvent("state-change", {
        detail: { state: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private setMode(mode: IdsDatagridDateTimeFilterMode): void {
    if (mode === "all") {
      this.emitState(defaultIdsDatagridDateTimeFilterState());
      return;
    }
    this.emitState({ ...this.state, mode });
  }

  private suppressRadioFocusOnPointer(event: MouseEvent): void {
    if (event.button === 0) event.preventDefault();
  }

  override render() {
    const slug =
      this.groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "datetime";
    const groupName = `${this.instanceId}-${slug}`;

    return html`
      <div
        class="root"
        role="radiogroup"
        aria-label=${`${this.groupLabel}: date and time filter`}
        data-datetime-filter=""
        data-ids="ids-datagrid-datetime-filter"
      >
        ${IDS_DATAGRID_DATETIME_FILTER_MODES.map((mode) => {
          const checked = this.state.mode === mode;
          const inputId = `${groupName}-mode-${mode}`;
          const isHovered = this.hoverMode === mode;
          const canShowSummary = modeShowsSummary(mode);
          const summaryState: IdsDatagridDateTimeFilterState = checked
            ? this.state
            : { ...this.state, mode };
          const summary = canShowSummary
            ? formatIdsDatagridDateTimeFilterSummary(summaryState)
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
                  <span class="labelText">${IDS_DATAGRID_DATETIME_MODE_LABELS[mode]}</span>
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
                        <div class="timeField">
                          <ids-time-picker
                            label="Time:"
                            formathint="HH:MM AM/PM"
                            placeholder="HH:MM AM/PM"
                            clocktype="12h"
                            .value=${this.state.specificTime ?? null}
                            @change=${(e: CustomEvent<{ value: string | null }>) =>
                              this.emitState({
                                ...this.state,
                                specificTime: e.detail.value,
                              })}
                          ></ids-time-picker>
                        </div>
                      </div>
                    </div>
                  `
                : nothing}
              ${showCustom
                ? html`
                    <div class="expandedBlock" data-custom-range="">
                      <div class="dateTimeRow">
                        <div class="dateField">
                          <ids-date-picker
                            label="Start Date:"
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
                        <div class="timeField">
                          <ids-time-picker
                            label="Time:"
                            formathint="HH:MM AM/PM"
                            placeholder="HH:MM AM/PM"
                            clocktype="12h"
                            .value=${this.state.rangeStartTime ?? null}
                            @change=${(e: CustomEvent<{ value: string | null }>) =>
                              this.emitState({
                                ...this.state,
                                rangeStartTime: e.detail.value,
                              })}
                          ></ids-time-picker>
                        </div>
                      </div>
                      <div class="dateTimeRow">
                        <div class="dateField">
                          <ids-date-picker
                            label="End Date:"
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
                        <div class="timeField">
                          <ids-time-picker
                            label="Time:"
                            formathint="HH:MM AM/PM"
                            placeholder="HH:MM AM/PM"
                            clocktype="12h"
                            .value=${this.state.rangeEndTime ?? null}
                            @change=${(e: CustomEvent<{ value: string | null }>) =>
                              this.emitState({
                                ...this.state,
                                rangeEndTime: e.detail.value,
                              })}
                          ></ids-time-picker>
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
    "ids-datagrid-filter-datetime": IdsDatagridFilterDateTime;
  }
}
