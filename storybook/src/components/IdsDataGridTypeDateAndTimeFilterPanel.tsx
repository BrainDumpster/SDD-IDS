import { useState, type MouseEvent } from "react";
import {
  defaultIdsDataGridDateTimeFilterState,
  formatIdsDataGridDateTimeFilterSummary,
  IDS_DATAGRID_DATETIME_FILTER_MODES,
  IDS_DATAGRID_DATETIME_MODE_LABELS,
  type IdsDataGridDateTimeFilterMode,
  type IdsDataGridDateTimeFilterState,
} from "./IdsDataGridDateAndTimeFilter";
import { IdsDatePicker } from "./IdsDatePicker";
import { IdsTimePicker } from "./IdsTimePicker";
import styles from "./IdsDataGridTypeDateAndTimeFilterPanel.module.css";

export interface IdsDataGridTypeDateAndTimeFilterPanelProps {
  state: IdsDataGridDateTimeFilterState;
  onStateChange: (next: IdsDataGridDateTimeFilterState) => void;
  /** Accessible name for the preset group (e.g. column title). */
  groupLabel: string;
}

function modeShowsSummary(mode: IdsDataGridDateTimeFilterMode): boolean {
  return mode !== "specific-date" && mode !== "custom-range";
}

/**
 * Date and Time column filter (Figma `.Filter-Element-DateAndTimeFilter` / `44360:181306`).
 * Native radios match IDS Radio Button spec (see numeric filter panel).
 * Date/time fields delegate to `IdsDatePicker` and `IdsTimePicker`.
 */
export function IdsDataGridTypeDateAndTimeFilterPanel({
  state,
  onStateChange,
  groupLabel,
}: IdsDataGridTypeDateAndTimeFilterPanelProps) {
  const slug = groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const groupName = `${slug}-datetime-filter`;
  const [hoverMode, setHoverMode] = useState<IdsDataGridDateTimeFilterMode | null>(null);

  const setMode = (mode: IdsDataGridDateTimeFilterMode) => {
    if (mode === "all") {
      onStateChange(defaultIdsDataGridDateTimeFilterState());
      return;
    }
    onStateChange({ ...state, mode });
  };

  const suppressRadioFocusOnPointer = (event: MouseEvent<HTMLLabelElement>) => {
    if (event.button === 0) event.preventDefault();
  };

  return (
    <div
      className={styles.root}
      data-datetime-filter=""
      role="radiogroup"
      aria-label={`${groupLabel}: date and time filter`}
    >
      {IDS_DATAGRID_DATETIME_FILTER_MODES.map((mode) => {
        const checked = state.mode === mode;
        const inputId = `${slug}-mode-${mode}`;
        const isHovered = hoverMode === mode;
        const showSummary = (checked || isHovered) && modeShowsSummary(mode);
        const summaryState: IdsDataGridDateTimeFilterState = checked ? state : { ...state, mode };
        const summary = showSummary ? formatIdsDataGridDateTimeFilterSummary(summaryState) : null;
        const showSpecific = checked && mode === "specific-date";
        const showCustom = checked && mode === "custom-range";

        return (
          <div key={mode}>
            <div
              className={styles.optionRow}
              onMouseEnter={() => setHoverMode(mode)}
              onMouseLeave={() => setHoverMode(null)}
            >
              <label
                className={styles.optionLabel}
                htmlFor={inputId}
                onMouseDown={suppressRadioFocusOnPointer}
                onClick={mode === "all" ? () => setMode("all") : undefined}
              >
                <span className={styles.radioRoot} data-checked={checked ? "" : undefined}>
                  <input
                    type="radio"
                    id={inputId}
                    name={groupName}
                    value={mode}
                    checked={checked}
                    onChange={() => setMode(mode)}
                    className={styles.radioInput}
                  />
                  <span
                    className={styles.radioIndicator}
                    data-checked={checked ? "" : undefined}
                  />
                </span>
                <span className={styles.labelText}>
                  {IDS_DATAGRID_DATETIME_MODE_LABELS[mode]}
                </span>
              </label>
              {summary && (
                <span className={styles.summary} aria-hidden>
                  {summary}
                </span>
              )}
            </div>
            {showSpecific && (
              <div className={styles.expandedBlock}>
                <div className={styles.dateTimeRow}>
                  <div className={styles.dateField}>
                    <IdsDatePicker
                      label="Date:"
                      value={state.specificDate ?? null}
                      onChange={(specificDate) => onStateChange({ ...state, specificDate })}
                      formatHint="MM-DD-YYYY"
                      placeholder="MM-DD-YYYY"
                    />
                  </div>
                  <div className={styles.timeField}>
                    <IdsTimePicker
                      label="Time (optional):"
                      value={state.specificTime ?? null}
                      onChange={(specificTime) => onStateChange({ ...state, specificTime })}
                      formatHint="HH:MM AM/PM"
                      placeholder="HH:MM AM/PM"
                      clockType="12h"
                    />
                  </div>
                </div>
              </div>
            )}
            {showCustom && (
              <div className={styles.expandedBlock}>
                <div className={styles.dateTimeRow}>
                  <div className={styles.dateField}>
                    <IdsDatePicker
                      label="Start Date:"
                      value={state.rangeStartDate ?? null}
                      onChange={(rangeStartDate) => onStateChange({ ...state, rangeStartDate })}
                      formatHint="MM-DD-YYYY"
                      placeholder="MM-DD-YYYY"
                    />
                  </div>
                  <div className={styles.timeField}>
                    <IdsTimePicker
                      label="Time (optional):"
                      value={state.rangeStartTime ?? null}
                      onChange={(rangeStartTime) => onStateChange({ ...state, rangeStartTime })}
                      formatHint="HH:MM AM/PM"
                      placeholder="HH:MM AM/PM"
                      clockType="12h"
                    />
                  </div>
                </div>
                <div className={styles.dateTimeRow}>
                  <div className={styles.dateField}>
                    <IdsDatePicker
                      label="End Date:"
                      value={state.rangeEndDate ?? null}
                      onChange={(rangeEndDate) => onStateChange({ ...state, rangeEndDate })}
                      formatHint="MM-DD-YYYY"
                      placeholder="MM-DD-YYYY"
                    />
                  </div>
                  <div className={styles.timeField}>
                    <IdsTimePicker
                      label="Time (optional):"
                      value={state.rangeEndTime ?? null}
                      onChange={(rangeEndTime) => onStateChange({ ...state, rangeEndTime })}
                      formatHint="HH:MM AM/PM"
                      placeholder="HH:MM AM/PM"
                      clockType="12h"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
