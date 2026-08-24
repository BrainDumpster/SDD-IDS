/**
 * Column filter inner UIs — render inside `IdsDatagridFilter` / `FilterPanelBody`.
 * Outer L-frame chrome is grid-owned (`IdsDatagrid`).
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { IdsCheckbox, IdsCheckboxLabel } from "../checkbox";
import { IdsDatePicker } from "../date-picker";
import { IdsIcon } from "../icon";
import { IdsTimePicker } from "../time-picker";
import {
  defaultIdsDatagridDateFilterState,
  formatIdsDatagridDateFilterSummary,
  IDS_DATAGRID_DATE_FILTER_MODES,
  IDS_DATAGRID_DATE_MODE_LABELS,
  type IdsDatagridDateFilterMode,
  type IdsDatagridDateFilterState,
} from "./IdsDatagridDateFilter";
import {
  defaultIdsDatagridDateTimeFilterState,
  formatIdsDatagridDateTimeFilterSummary,
  IDS_DATAGRID_DATETIME_FILTER_MODES,
  IDS_DATAGRID_DATETIME_MODE_LABELS,
  type IdsDatagridDateTimeFilterMode,
  type IdsDatagridDateTimeFilterState,
} from "./IdsDatagridDateTimeFilter";
import {
  defaultIdsDatagridNumericFilterState,
  IDS_DATAGRID_NUMERIC_OPERATOR_LABELS,
  type IdsDatagridNumericFilterState,
  type IdsDatagridNumericOperator,
} from "./IdsDatagridNumericFilter";
import gridStyles from "./IdsDatagrid.module.css";
import dateTimeStyles from "./IdsDatagridDateTimeFilter.module.css";
import multiStyles from "./IdsDatagridMultiselectFilter.module.css";
import numericStyles from "./IdsDatagridNumericFilter.module.css";
import singleStyles from "./IdsDatagridSingleSelectFilter.module.css";

/* -------------------------------------------------------------------------- */
/* Text search (Column Search / 37822:91073)                                  */
/* -------------------------------------------------------------------------- */

export interface IdsDatagridTextFilterProps {
  placeholder?: string;
  "aria-label": string;
  value?: string;
  onChange?: (value: string) => void;
}

export function IdsDatagridTextFilter({
  placeholder = "Search",
  "aria-label": ariaLabel,
  value,
  onChange,
}: IdsDatagridTextFilterProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const query = value ?? uncontrolledValue;
  const showClear = query.length > 0;

  const setQuery = (next: string) => {
    if (value === undefined) setUncontrolledValue(next);
    onChange?.(next);
  };

  return (
    <div className={gridStyles.filterPopupSearchRow} data-text-filter data-ids="ids-datagrid-text-filter">
      <IdsIcon shape="search-16" className={gridStyles.filterPopupSearchIcon} />
      <div className={gridStyles.filterPopupSearchInputWrap}>
        <input
          type="search"
          className={gridStyles.filterPopupSearchInput}
          placeholder={placeholder}
          aria-label={ariaLabel}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {showClear ? (
          <button
            type="button"
            className={gridStyles.filterPopupSearchClear}
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            <IdsIcon
              shape="ctrl-close-16"
              className={gridStyles.filterPopupSearchClearIcon}
              style={{ width: 12, height: 12 }}
            />
          </button>
        ) : null}
      </div>
    </div>
  );
}
IdsDatagridTextFilter.displayName = "IdsDatagridTextFilter";

/* -------------------------------------------------------------------------- */
/* Combobox-Multiselect / Dropdown-MultiSelect                                */
/* -------------------------------------------------------------------------- */

export interface IdsDatagridMultiselectFilterProps {
  options: readonly string[];
  selectedValues: readonly string[];
  onSelectedValuesChange: (next: string[]) => void;
  groupLabel: string;
  /** false → Dropdown-MultiSelect (no search). Default true → Combobox-Multiselect. */
  showSearch?: boolean;
}

function optionId(groupLabel: string, value: string, index: number): string {
  const slug = `${groupLabel}-${value}-${index}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `ids-datagrid-filter-${slug}`;
}

export function IdsDatagridMultiselectFilter({
  options,
  selectedValues,
  onSelectedValuesChange,
  groupLabel,
  showSearch = true,
}: IdsDatagridMultiselectFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, searchQuery, showSearch]);

  const selectedCount = useMemo(
    () => filteredOptions.reduce((n, o) => n + (selectedSet.has(o) ? 1 : 0), 0),
    [filteredOptions, selectedSet],
  );
  const allChecked = filteredOptions.length > 0 && selectedCount === filteredOptions.length;
  const indeterminate = selectedCount > 0 && selectedCount < filteredOptions.length;

  const toggleAll = (checked: boolean) => {
    if (checked) {
      const next = new Set(selectedSet);
      for (const o of filteredOptions) next.add(o);
      onSelectedValuesChange([...next]);
    } else {
      const remove = new Set(filteredOptions);
      onSelectedValuesChange(selectedValues.filter((v) => !remove.has(v)));
    }
  };

  const clearAll = () => {
    const remove = new Set(filteredOptions);
    onSelectedValuesChange(selectedValues.filter((v) => !remove.has(v)));
  };

  const toggleOne = (opt: string, checked: boolean) => {
    const next = new Set(selectedSet);
    if (checked) next.add(opt);
    else next.delete(opt);
    onSelectedValuesChange([...next]);
  };

  return (
    <div
      className={multiStyles.root}
      role="group"
      aria-label={`${groupLabel}: multiselect filter`}
      data-ids="ids-datagrid-multiselect-filter"
    >
      {showSearch ? (
        <div className={multiStyles.searchRow}>
          <div className={multiStyles.searchField}>
            <IdsIcon shape="search-16" className={multiStyles.searchIcon} />
            <div className={multiStyles.searchInputWrap}>
              <input
                type="text"
                className={multiStyles.searchInput}
                placeholder="Search"
                aria-label={`Search ${groupLabel} options`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery.length > 0 ? (
                <button
                  type="button"
                  className={multiStyles.searchClear}
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                >
                  <IdsIcon
                    shape="ctrl-close-16"
                    className={multiStyles.searchClearIcon}
                    style={{ width: 12, height: 12 }}
                  />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className={multiStyles.selectAllRow}>
        <div className={multiStyles.selectAllLeft}>
          <IdsCheckbox
            id={`ids-datagrid-filter-${groupLabel}-select-all`.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            checked={allChecked}
            indeterminate={indeterminate}
            onChange={toggleAll}
          >
            <IdsCheckboxLabel>Select All</IdsCheckboxLabel>
          </IdsCheckbox>
        </div>
        <button
          type="button"
          className={multiStyles.clearAllBtn}
          onClick={clearAll}
          disabled={selectedCount === 0}
        >
          Clear All
        </button>
      </div>

      <ul className={multiStyles.optionList} role="listbox" aria-label={`${groupLabel} options`}>
        {filteredOptions.map((opt, index) => (
          <li key={opt} className={multiStyles.optionItem}>
            <IdsCheckbox
              id={optionId(groupLabel, opt, index)}
              name="ids-datagrid-type-filter"
              value={opt}
              checked={selectedSet.has(opt)}
              onChange={(c) => toggleOne(opt, c)}
            >
              <IdsCheckboxLabel>{opt}</IdsCheckboxLabel>
            </IdsCheckbox>
          </li>
        ))}
      </ul>
    </div>
  );
}
IdsDatagridMultiselectFilter.displayName = "IdsDatagridMultiselectFilter";

export function IdsDatagridDropdownMultiSelectFilter(
  props: Omit<IdsDatagridMultiselectFilterProps, "showSearch">,
) {
  return <IdsDatagridMultiselectFilter {...props} showSearch={false} />;
}
IdsDatagridDropdownMultiSelectFilter.displayName = "IdsDatagridDropdownMultiSelectFilter";

/* -------------------------------------------------------------------------- */
/* Combobox-SingleSelect / Dropdown-SingleSelect                              */
/* -------------------------------------------------------------------------- */

export interface IdsDatagridSingleSelectFilterProps {
  options: readonly string[];
  selectedValue: string | null;
  onSelectedValueChange: (next: string | null) => void;
  groupLabel: string;
  showSearch?: boolean;
}

export function IdsDatagridSingleSelectFilter({
  options,
  selectedValue,
  onSelectedValueChange,
  groupLabel,
  showSearch = true,
}: IdsDatagridSingleSelectFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, searchQuery, showSearch]);

  return (
    <div
      className={singleStyles.root}
      role="group"
      aria-label={`${groupLabel}: single-select filter`}
      data-ids="ids-datagrid-singleselect-filter"
    >
      {showSearch ? (
        <div className={singleStyles.searchRow}>
          <div className={singleStyles.searchField}>
            <IdsIcon shape="search-16" className={singleStyles.searchIcon} />
            <div className={singleStyles.searchInputWrap}>
              <input
                type="text"
                className={singleStyles.searchInput}
                placeholder="Search"
                aria-label={`Search ${groupLabel} options`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery.length > 0 ? (
                <button
                  type="button"
                  className={singleStyles.searchClear}
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                >
                  <IdsIcon
                    shape="ctrl-close-16"
                    className={singleStyles.searchClearIcon}
                    style={{ width: 12, height: 12 }}
                  />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <ul className={singleStyles.optionList} role="listbox" aria-label={`${groupLabel} options`}>
        {filteredOptions.map((opt) => {
          const isSelected = opt === selectedValue;
          return (
            <li
              key={opt}
              role="option"
              aria-selected={isSelected}
              className={`${singleStyles.optionItem} ${isSelected ? singleStyles.optionItemSelected : ""}`}
              onClick={() => onSelectedValueChange(opt)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectedValueChange(opt);
                }
              }}
              tabIndex={0}
            >
              <span className={singleStyles.optionLabel}>{opt}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
IdsDatagridSingleSelectFilter.displayName = "IdsDatagridSingleSelectFilter";

export function IdsDatagridDropdownSingleSelectFilter(
  props: Omit<IdsDatagridSingleSelectFilterProps, "showSearch">,
) {
  return <IdsDatagridSingleSelectFilter {...props} showSearch={false} />;
}
IdsDatagridDropdownSingleSelectFilter.displayName = "IdsDatagridDropdownSingleSelectFilter";

/* -------------------------------------------------------------------------- */
/* Numeric                                                                    */
/* -------------------------------------------------------------------------- */

export interface IdsDatagridNumericUnitOption {
  value: string;
  label: string;
}

export interface IdsDatagridNumericFilterProps {
  state: IdsDatagridNumericFilterState;
  onStateChange: (next: IdsDatagridNumericFilterState) => void;
  groupLabel: string;
  unitOptions?: IdsDatagridNumericUnitOption[];
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

function NativeUnitDropdown({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: IdsDatagridNumericUnitOption[];
  value?: string;
  onChange?: (next: string) => void;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? "-Select-";
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("keydown", handleEsc, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("keydown", handleEsc, true);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className={numericStyles.unitDropdownRoot}>
      <button
        ref={triggerRef}
        type="button"
        className={numericStyles.unitTriggerBtn}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className={numericStyles.unitTriggerLabel}>{selectedLabel}</span>
        <span className={numericStyles.unitTriggerCaret} aria-hidden>
          <IdsIcon shape="arrow-drop-tri-caret" style={{ width: 10, height: 10 }} />
        </span>
      </button>
      {open ? (
        <div className={numericStyles.unitPopup} role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                className={numericStyles.unitOption}
                role="option"
                aria-selected={isSelected}
                data-selected={isSelected ? "" : undefined}
                onClick={() => {
                  onChange?.(opt.value);
                  close();
                  triggerRef.current?.focus();
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function NumericValueField({
  id,
  helperText,
  value,
  onChange,
  "aria-label": ariaLabel,
  unitOptions,
  unitValue,
  onUnitChange,
  unitAriaLabel,
}: {
  id: string;
  helperText: string;
  value: string;
  onChange: (next: string) => void;
  "aria-label": string;
  unitOptions?: IdsDatagridNumericUnitOption[];
  unitValue?: string;
  onUnitChange?: (next: string) => void;
  unitAriaLabel?: string;
}) {
  const hasUnit = unitOptions && unitOptions.length > 0;
  return (
    <div className={numericStyles.valueField}>
      <div className={hasUnit ? numericStyles.valueRow : undefined}>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={numericStyles.valueInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={ariaLabel}
        />
        {hasUnit ? (
          <div className={numericStyles.unitDropdownWrap}>
            <NativeUnitDropdown
              options={unitOptions}
              value={unitValue}
              onChange={onUnitChange}
              ariaLabel={unitAriaLabel}
            />
          </div>
        ) : null}
      </div>
      <p className={numericStyles.valueHelper}>{helperText}</p>
    </div>
  );
}

export function IdsDatagridNumericFilter({
  state,
  onStateChange,
  groupLabel,
  unitOptions,
}: IdsDatagridNumericFilterProps) {
  const slug = groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const groupName = `${slug}-numeric-filter`;

  const setOperator = (operator: IdsDatagridNumericOperator) => {
    if (operator === "all") {
      onStateChange(defaultIdsDatagridNumericFilterState());
      return;
    }
    onStateChange({ ...state, operator });
  };

  return (
    <div
      className={numericStyles.root}
      role="radiogroup"
      aria-label={`${groupLabel}: numeric filter`}
      data-ids="ids-datagrid-numeric-filter"
    >
      {NUMERIC_OPERATORS.map((operator) => {
        const showSingleValue =
          state.operator === operator && operatorNeedsValue(operator) && operator !== "between";
        const showBetween = state.operator === operator && operator === "between";
        const checked = state.operator === operator;
        const inputId = `${slug}-op-${operator}`;

        return (
          <div key={operator}>
            <div className={numericStyles.optionRow}>
              <label
                className={numericStyles.optionLabel}
                htmlFor={inputId}
                onClick={operator === "all" ? () => setOperator("all") : undefined}
              >
                <span className={numericStyles.radioRoot} data-checked={checked ? "" : undefined}>
                  <input
                    type="radio"
                    id={inputId}
                    name={groupName}
                    value={operator}
                    checked={checked}
                    onChange={() => setOperator(operator)}
                    className={numericStyles.radioInput}
                  />
                  <span
                    className={numericStyles.radioIndicator}
                    data-checked={checked ? "" : undefined}
                  />
                </span>
                {IDS_DATAGRID_NUMERIC_OPERATOR_LABELS[operator]}
              </label>
            </div>
            {showSingleValue ? (
              <div className={numericStyles.valueBlock}>
                <NumericValueField
                  id={`${slug}-value`}
                  helperText="Numeric value"
                  value={state.value ?? ""}
                  onChange={(value) => onStateChange({ ...state, value })}
                  aria-label={`${groupLabel} numeric value`}
                  unitOptions={unitOptions}
                  unitValue={state.unit}
                  onUnitChange={(unit) => onStateChange({ ...state, unit })}
                  unitAriaLabel={`${groupLabel} unit`}
                />
              </div>
            ) : null}
            {showBetween ? (
              <div className={numericStyles.valueBlock}>
                <NumericValueField
                  id={`${slug}-start`}
                  helperText="Starting value"
                  value={state.value ?? ""}
                  onChange={(value) => onStateChange({ ...state, value })}
                  aria-label={`${groupLabel} starting value`}
                  unitOptions={unitOptions}
                  unitValue={state.unit}
                  onUnitChange={(unit) => onStateChange({ ...state, unit })}
                  unitAriaLabel={`${groupLabel} starting value unit`}
                />
                <NumericValueField
                  id={`${slug}-end`}
                  helperText="Ending value"
                  value={state.valueEnd ?? ""}
                  onChange={(valueEnd) => onStateChange({ ...state, valueEnd })}
                  aria-label={`${groupLabel} ending value`}
                  unitOptions={unitOptions}
                  unitValue={state.unitEnd}
                  onUnitChange={(unitEnd) => onStateChange({ ...state, unitEnd })}
                  unitAriaLabel={`${groupLabel} ending value unit`}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
IdsDatagridNumericFilter.displayName = "IdsDatagridNumericFilter";

/* -------------------------------------------------------------------------- */
/* Date                                                                       */
/* -------------------------------------------------------------------------- */

export interface IdsDatagridDateFilterProps {
  state: IdsDatagridDateFilterState;
  onStateChange: (next: IdsDatagridDateFilterState) => void;
  groupLabel: string;
}

function dateModeShowsSummary(mode: IdsDatagridDateFilterMode): boolean {
  return mode !== "specific-date" && mode !== "custom-range";
}

export function IdsDatagridDateFilter({
  state,
  onStateChange,
  groupLabel,
}: IdsDatagridDateFilterProps) {
  const slug = groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const groupName = `${slug}-date-filter`;
  const [hoverMode, setHoverMode] = useState<IdsDatagridDateFilterMode | null>(null);

  const setMode = (mode: IdsDatagridDateFilterMode) => {
    if (mode === "all") {
      onStateChange(defaultIdsDatagridDateFilterState());
      return;
    }
    onStateChange({ ...state, mode });
  };

  const suppressRadioFocusOnPointer = (event: ReactMouseEvent<HTMLLabelElement>) => {
    if (event.button === 0) event.preventDefault();
  };

  return (
    <div
      className={dateTimeStyles.root}
      data-date-filter=""
      data-ids="ids-datagrid-date-filter"
      role="radiogroup"
      aria-label={`${groupLabel}: date filter`}
    >
      {IDS_DATAGRID_DATE_FILTER_MODES.map((mode) => {
        const checked = state.mode === mode;
        const inputId = `${slug}-mode-${mode}`;
        const isHovered = hoverMode === mode;
        const showSummary = (checked || isHovered) && dateModeShowsSummary(mode);
        const summaryState: IdsDatagridDateFilterState = checked ? state : { ...state, mode };
        const summary = showSummary ? formatIdsDatagridDateFilterSummary(summaryState) : null;
        const showSpecific = checked && mode === "specific-date";
        const showCustom = checked && mode === "custom-range";

        return (
          <div key={mode}>
            <div
              className={dateTimeStyles.optionRow}
              onMouseEnter={() => setHoverMode(mode)}
              onMouseLeave={() => setHoverMode(null)}
            >
              <label
                className={dateTimeStyles.optionLabel}
                htmlFor={inputId}
                onMouseDown={suppressRadioFocusOnPointer}
                onClick={mode === "all" ? () => setMode("all") : undefined}
              >
                <span className={dateTimeStyles.radioRoot} data-checked={checked ? "" : undefined}>
                  <input
                    type="radio"
                    id={inputId}
                    name={groupName}
                    value={mode}
                    checked={checked}
                    onChange={() => setMode(mode)}
                    className={dateTimeStyles.radioInput}
                  />
                  <span
                    className={dateTimeStyles.radioIndicator}
                    data-checked={checked ? "" : undefined}
                  />
                </span>
                <span className={dateTimeStyles.labelText}>{IDS_DATAGRID_DATE_MODE_LABELS[mode]}</span>
              </label>
              {summary ? (
                <span className={dateTimeStyles.summary} aria-hidden>
                  {summary}
                </span>
              ) : null}
            </div>
            {showSpecific ? (
              <div className={dateTimeStyles.expandedBlock}>
                <div className={dateTimeStyles.dateTimeRow}>
                  <div className={dateTimeStyles.dateField}>
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
            ) : null}
            {showCustom ? (
              <div className={dateTimeStyles.expandedBlock}>
                <div className={dateTimeStyles.dateTimeRow}>
                  <div className={dateTimeStyles.dateField}>
                    <IdsDatePicker
                      label="Start:"
                      value={state.rangeStartDate ?? null}
                      onChange={(rangeStartDate) => onStateChange({ ...state, rangeStartDate })}
                      formatHint="MM-DD-YYYY"
                      placeholder="MM-DD-YYYY"
                    />
                  </div>
                </div>
                <div className={dateTimeStyles.dateTimeRow}>
                  <div className={dateTimeStyles.dateField}>
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
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
IdsDatagridDateFilter.displayName = "IdsDatagridDateFilter";

/* -------------------------------------------------------------------------- */
/* Date and Time                                                              */
/* -------------------------------------------------------------------------- */

export interface IdsDatagridDateTimeFilterProps {
  state: IdsDatagridDateTimeFilterState;
  onStateChange: (next: IdsDatagridDateTimeFilterState) => void;
  groupLabel: string;
}

function dateTimeModeShowsSummary(mode: IdsDatagridDateTimeFilterMode): boolean {
  return mode !== "specific-date" && mode !== "custom-range";
}

export function IdsDatagridDateTimeFilter({
  state,
  onStateChange,
  groupLabel,
}: IdsDatagridDateTimeFilterProps) {
  const slug = groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const groupName = `${slug}-datetime-filter`;
  const [hoverMode, setHoverMode] = useState<IdsDatagridDateTimeFilterMode | null>(null);

  const setMode = (mode: IdsDatagridDateTimeFilterMode) => {
    if (mode === "all") {
      onStateChange(defaultIdsDatagridDateTimeFilterState());
      return;
    }
    onStateChange({ ...state, mode });
  };

  const suppressRadioFocusOnPointer = (event: ReactMouseEvent<HTMLLabelElement>) => {
    if (event.button === 0) event.preventDefault();
  };

  return (
    <div
      className={dateTimeStyles.root}
      data-datetime-filter=""
      data-ids="ids-datagrid-datetime-filter"
      role="radiogroup"
      aria-label={`${groupLabel}: date and time filter`}
    >
      {IDS_DATAGRID_DATETIME_FILTER_MODES.map((mode) => {
        const checked = state.mode === mode;
        const inputId = `${slug}-mode-${mode}`;
        const isHovered = hoverMode === mode;
        const showSummary = (checked || isHovered) && dateTimeModeShowsSummary(mode);
        const summaryState: IdsDatagridDateTimeFilterState = checked ? state : { ...state, mode };
        const summary = showSummary ? formatIdsDatagridDateTimeFilterSummary(summaryState) : null;
        const showSpecific = checked && mode === "specific-date";
        const showCustom = checked && mode === "custom-range";

        return (
          <div key={mode}>
            <div
              className={dateTimeStyles.optionRow}
              onMouseEnter={() => setHoverMode(mode)}
              onMouseLeave={() => setHoverMode(null)}
            >
              <label
                className={dateTimeStyles.optionLabel}
                htmlFor={inputId}
                onMouseDown={suppressRadioFocusOnPointer}
                onClick={mode === "all" ? () => setMode("all") : undefined}
              >
                <span className={dateTimeStyles.radioRoot} data-checked={checked ? "" : undefined}>
                  <input
                    type="radio"
                    id={inputId}
                    name={groupName}
                    value={mode}
                    checked={checked}
                    onChange={() => setMode(mode)}
                    className={dateTimeStyles.radioInput}
                  />
                  <span
                    className={dateTimeStyles.radioIndicator}
                    data-checked={checked ? "" : undefined}
                  />
                </span>
                <span className={dateTimeStyles.labelText}>
                  {IDS_DATAGRID_DATETIME_MODE_LABELS[mode]}
                </span>
              </label>
              {summary ? (
                <span className={dateTimeStyles.summary} aria-hidden>
                  {summary}
                </span>
              ) : null}
            </div>
            {showSpecific ? (
              <div className={dateTimeStyles.expandedBlock}>
                <div className={dateTimeStyles.dateTimeRow}>
                  <div className={dateTimeStyles.dateField}>
                    <IdsDatePicker
                      label="Date:"
                      value={state.specificDate ?? null}
                      onChange={(specificDate) => onStateChange({ ...state, specificDate })}
                      formatHint="MM-DD-YYYY"
                      placeholder="MM-DD-YYYY"
                    />
                  </div>
                  <div className={dateTimeStyles.timeField}>
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
            ) : null}
            {showCustom ? (
              <div className={dateTimeStyles.expandedBlock}>
                <div className={dateTimeStyles.dateTimeRow}>
                  <div className={dateTimeStyles.dateField}>
                    <IdsDatePicker
                      label="Start Date:"
                      value={state.rangeStartDate ?? null}
                      onChange={(rangeStartDate) => onStateChange({ ...state, rangeStartDate })}
                      formatHint="MM-DD-YYYY"
                      placeholder="MM-DD-YYYY"
                    />
                  </div>
                  <div className={dateTimeStyles.timeField}>
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
                <div className={dateTimeStyles.dateTimeRow}>
                  <div className={dateTimeStyles.dateField}>
                    <IdsDatePicker
                      label="End Date:"
                      value={state.rangeEndDate ?? null}
                      onChange={(rangeEndDate) => onStateChange({ ...state, rangeEndDate })}
                      formatHint="MM-DD-YYYY"
                      placeholder="MM-DD-YYYY"
                    />
                  </div>
                  <div className={dateTimeStyles.timeField}>
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
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
IdsDatagridDateTimeFilter.displayName = "IdsDatagridDateTimeFilter";
