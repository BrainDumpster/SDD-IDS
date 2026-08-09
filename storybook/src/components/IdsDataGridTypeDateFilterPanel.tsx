import { useState, type MouseEvent } from "react";
import {
  defaultIdsDataGridDateFilterState,
  formatIdsDataGridDateFilterSummary,
  IDS_DATAGRID_DATE_FILTER_MODES,
  IDS_DATAGRID_DATE_MODE_LABELS,
  type IdsDataGridDateFilterMode,
  type IdsDataGridDateFilterState,
} from "./IdsDataGridDateFilter";
import { IdsDatePicker } from "./IdsDatePicker";
import styles from "./IdsDataGridTypeDateAndTimeFilterPanel.module.css";

export interface IdsDataGridTypeDateFilterPanelProps {
  state: IdsDataGridDateFilterState;
  onStateChange: (next: IdsDataGridDateFilterState) => void;
  /** Accessible name for the preset group (e.g. column title). */
  groupLabel: string;
}

function modeShowsSummary(mode: IdsDataGridDateFilterMode): boolean {
  return mode !== "specific-date" && mode !== "custom-range";
}

/**
 * Date-only column filter (Figma `.Filter-Element-DateFilter` / `37822:90838`).
 * Same preset radios as date-time; expanded rows use DatePicker only (no TimePicker).
 */
export function IdsDataGridTypeDateFilterPanel({
  state,
  onStateChange,
  groupLabel,
}: IdsDataGridTypeDateFilterPanelProps) {
  const slug = groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const groupName = `${slug}-date-filter`;
  const [hoverMode, setHoverMode] = useState<IdsDataGridDateFilterMode | null>(null);

  const setMode = (mode: IdsDataGridDateFilterMode) => {
    if (mode === "all") {
      onStateChange(defaultIdsDataGridDateFilterState());
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
      data-date-filter=""
      role="radiogroup"
      aria-label={`${groupLabel}: date filter`}
    >
      {IDS_DATAGRID_DATE_FILTER_MODES.map((mode) => {
        const checked = state.mode === mode;
        const inputId = `${slug}-mode-${mode}`;
        const isHovered = hoverMode === mode;
        const canShowSummary = modeShowsSummary(mode);
        const summaryState: IdsDataGridDateFilterState = checked ? state : { ...state, mode };
        const summary = canShowSummary ? formatIdsDataGridDateFilterSummary(summaryState) : null;
        const summaryVisible = (checked || isHovered) && summary != null;
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
                  {IDS_DATAGRID_DATE_MODE_LABELS[mode]}
                </span>
              </label>
              {summary != null && (
                <span
                  className={styles.summary}
                  aria-hidden
                  style={{ visibility: summaryVisible ? "visible" : "hidden" }}
                >
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
                </div>
              </div>
            )}
            {showCustom && (
              <div className={styles.expandedBlock}>
                <div className={styles.dateTimeRow}>
                  <div className={styles.dateField}>
                    <IdsDatePicker
                      label="Start:"
                      value={state.rangeStartDate ?? null}
                      onChange={(rangeStartDate) => onStateChange({ ...state, rangeStartDate })}
                      formatHint="MM-DD-YYYY"
                      placeholder="MM-DD-YYYY"
                    />
                  </div>
                </div>
                <div className={styles.dateTimeRow}>
                  <div className={styles.dateField}>
                    <IdsDatePicker
                      label="End:"
                      value={state.rangeEndDate ?? null}
                      onChange={(rangeEndDate) => onStateChange({ ...state, rangeEndDate })}
                      formatHint="MM-DD-YYYY"
                      placeholder="MM-DD-YYYY"
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
