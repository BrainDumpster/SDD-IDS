import {
  defaultIdsDataGridNumericFilterState,
  IDS_DATAGRID_NUMERIC_OPERATOR_LABELS,
  type IdsDataGridNumericFilterState,
  type IdsDataGridNumericOperator,
} from "./IdsDataGridNumericFilter";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import styles from "./IdsDataGridTypeNumericFilterPanel.module.css";

const OPERATORS: IdsDataGridNumericOperator[] = [
  "all",
  "equals",
  "not-equals",
  "greater-than",
  "greater-than-equal",
  "less-than",
  "less-than-equal",
  "between",
];

function operatorNeedsValue(operator: IdsDataGridNumericOperator): boolean {
  return operator !== "all";
}

export interface NumericFilterUnitOption {
  value: string;
  label: string;
}

export interface IdsDataGridTypeNumericFilterPanelProps {
  state: IdsDataGridNumericFilterState;
  onStateChange: (next: IdsDataGridNumericFilterState) => void;
  /** Accessible name for the operator group (e.g. column title). */
  groupLabel: string;
  /** Optional unit dropdown options (e.g. KB/MB/GB). User-defined; when provided, renders a single-select beside each value field. */
  unitOptions?: NumericFilterUnitOption[];
}

/**
 * Native dropdown used inside the DataGrid filter popup.
 * Base UI Menu.Trigger does not work reliably inside portals,
 * so this lightweight implementation manages its own open state
 * while matching the IDS Dropdown: Single-select design spec.
 */
function NativeUnitDropdown({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: NumericFilterUnitOption[];
  value?: string;
  onChange?: (next: string) => void;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? "-Select-";

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        close();
      }
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
    <div ref={rootRef} className={styles.unitDropdownRoot}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.unitTriggerBtn}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className={styles.unitTriggerLabel}>{selectedLabel}</span>
        <span className={styles.unitTriggerCaret} aria-hidden>
          <Icon shapeName="arrow-drop-tri-caret" style={{ width: 10, height: 10 }} />
        </span>
      </button>
      {open && (
        <div className={styles.unitPopup} role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                className={styles.unitOption}
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
      )}
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
  unitOptions?: NumericFilterUnitOption[];
  unitValue?: string;
  onUnitChange?: (next: string) => void;
  unitAriaLabel?: string;
}) {
  const hasUnit = unitOptions && unitOptions.length > 0;

  return (
    <div className={styles.valueField}>
      <div className={hasUnit ? styles.valueRow : undefined}>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={styles.valueInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={ariaLabel}
        />
        {hasUnit && (
          <div className={styles.unitDropdownWrap}>
            <NativeUnitDropdown
              options={unitOptions}
              value={unitValue}
              onChange={onUnitChange}
              ariaLabel={unitAriaLabel}
            />
          </div>
        )}
      </div>
      <p className={styles.valueHelper}>{helperText}</p>
    </div>
  );
}

/**
 * Numeric column filter (Figma `.Filter-Element-NumericFilter` / `44360:182265`).
 * Uses native radio inputs styled to match IDS RadioButton spec
 * (see `components/ids/radio-button/design-spec.md`).
 * Native radios are used instead of Base UI Radio to avoid
 * event-chain issues inside the DataGrid's portal-based filter popup.
 */
export function IdsDataGridTypeNumericFilterPanel({
  state,
  onStateChange,
  groupLabel,
  unitOptions,
}: IdsDataGridTypeNumericFilterPanelProps) {
  const slug = groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const groupName = `${slug}-numeric-filter`;

  const setOperator = (operator: IdsDataGridNumericOperator) => {
    if (operator === "all") {
      onStateChange(defaultIdsDataGridNumericFilterState());
      return;
    }
    onStateChange({ ...state, operator });
  };

  return (
    <div
      className={styles.root}
      role="radiogroup"
      aria-label={`${groupLabel}: numeric filter`}
    >
      {OPERATORS.map((operator) => {
        const showSingleValue =
          state.operator === operator &&
          operatorNeedsValue(operator) &&
          operator !== "between";
        const showBetween = state.operator === operator && operator === "between";
        const checked = state.operator === operator;
        const inputId = `${slug}-op-${operator}`;

        return (
          <div key={operator}>
            <div className={styles.optionRow}>
              <label
                className={styles.optionLabel}
                htmlFor={inputId}
                onClick={operator === "all" ? () => setOperator("all") : undefined}
              >
                <span
                  className={styles.radioRoot}
                  data-checked={checked ? "" : undefined}
                >
                  <input
                    type="radio"
                    id={inputId}
                    name={groupName}
                    value={operator}
                    checked={checked}
                    onChange={() => setOperator(operator)}
                    className={styles.radioInput}
                  />
                  <span
                    className={styles.radioIndicator}
                    data-checked={checked ? "" : undefined}
                  />
                </span>
                {IDS_DATAGRID_NUMERIC_OPERATOR_LABELS[operator]}
              </label>
            </div>
            {showSingleValue && (
              <div className={styles.valueBlock}>
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
            )}
            {showBetween && (
              <div className={styles.valueBlock}>
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
            )}
          </div>
        );
      })}
    </div>
  );
}
