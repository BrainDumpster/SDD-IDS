/**
 * IDS Dropdown / Combo Box — React implementation from design-spec.
 *
 * Path: `lib/react/ids/dropdown-combo-box`
 * Source: `components/ids/dropdown-combo-box/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (container composition — NO INVENTION beyond design-spec):
 *   IdsDropdownComboBox          (`combobox-container`)
 *     Combobox field + menu      (`combobox`)
 *       IdsComboboxOptions       (`combobox-options`) — Mode B marker
 *         IdsComboboxOption*     (`combobox-option`) — Mode B markers
 *     IdsHelper? | IdsError?     — optional projected message (mutually exclusive)
 *
 * Mode A: `options: { id; label; disabled? }[]` (Composition & API).
 * Mode B: nested `IdsComboboxOptions` / `IdsComboboxOption`.
 *
 * Menu/popup behavior is the shared DropdownMenu contract from design-spec
 * Implementation Notes (Base UI Menu + ScrollArea).
 */

import React, {
  Children,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { IdsBadge } from "../badge";
import { IdsError } from "../error";
import { IdsHelper } from "../helper";
import {
  IdsTooltip,
  TooltipBody,
  TooltipHeader,
  TooltipPanel,
  TooltipTrigger,
} from "../tooltip";
import {
  DropdownMenu,
  IdsDropdownTriggerShell,
} from "../dropdown-shared";
import {
  IdsComboboxOption,
  type IdsComboboxOptionProps,
} from "./IdsComboboxOption";
import { IdsComboboxOptions } from "./IdsComboboxOptions";
import styles from "./IdsDropdownComboBox.module.css";

export type IdsDropdownComboBoxMode = "combobox-single" | "combobox-multi";
export type IdsDropdownComboBoxSize = "small" | "large";
export type IdsDropdownComboBoxMenuWidth = "trigger" | "content";

export interface IdsDropdownComboBoxOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface IdsDropdownComboBoxProps {
  children?: ReactNode;
  /** Spec: `combobox-single` | `combobox-multi`. Unknown → `combobox-single`. */
  mode?: IdsDropdownComboBoxMode | string;
  /** Spec: `small` | `large`. Default `large`. Unknown → `large`. */
  size?: IdsDropdownComboBoxSize | string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  menuWidth?: IdsDropdownComboBoxMenuWidth | string;
  /** Single-select only — Clear All row when a value is selected. */
  showClearAll?: boolean;
  maxVisibleItems?: number;
  noResultsLabel?: string;
  /** Mode A option model (Composition & API). */
  options?: IdsDropdownComboBoxOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (payload: string | string[]) => void;
  onSearch?: (query: string) => void;
  onOpenChange?: (open: boolean) => void;
  onSelectAll?: (visibleValues?: string[]) => void;
  onClearAll?: (visibleValues?: string[]) => void;
  showSelectedPanel?: boolean;
  showSelectedExpanded?: boolean;
  onShowSelectedExpandedChange?: (expanded: boolean) => void;
  onRemoveSelectedTag?: (value: string) => void;
  /** @deprecated Panel dismiss X removed — use `onClearAll`. */
  onShowSelectedPanelClear?: () => void;
  /** Demo/testing — forces popup open. Must not block interaction when unset. */
  defaultOpen?: boolean;
  /** Stretch field to container width (min 186 / max 700 via shell). */
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveMode(value: unknown): IdsDropdownComboBoxMode {
  return value === "combobox-multi" ? "combobox-multi" : "combobox-single";
}

function resolveSize(value: unknown): IdsDropdownComboBoxSize {
  return value === "small" ? "small" : "large";
}

function resolveMenuWidth(value: unknown): IdsDropdownComboBoxMenuWidth {
  return value === "content" ? "content" : "trigger";
}

function isHelperElement(child: ReactElement): boolean {
  return (
    child.type === IdsHelper ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName === "IdsHelper")
  );
}

function isErrorElement(child: ReactElement): boolean {
  return (
    child.type === IdsError ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName === "IdsError")
  );
}

function isOptionsElement(child: ReactElement): boolean {
  return (
    child.type === IdsComboboxOptions ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName === "IdsComboboxOptions")
  );
}

function isOptionElement(child: ReactElement): boolean {
  return (
    child.type === IdsComboboxOption ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName === "IdsComboboxOption")
  );
}

function partitionChildren(children: ReactNode): {
  helper: ReactElement | null;
  error: ReactElement | null;
  optionsFromChildren: IdsDropdownComboBoxOption[];
} {
  let helper: ReactElement | null = null;
  let error: ReactElement | null = null;
  const optionsFromChildren: IdsDropdownComboBoxOption[] = [];

  const collectOption = (child: ReactElement) => {
    if (!isOptionElement(child)) return;
    const props = child.props as IdsComboboxOptionProps;
    if (!props.id) return;
    optionsFromChildren.push({
      id: props.id,
      label: props.label,
      disabled: props.disabled,
    });
  };

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (isHelperElement(child)) {
      helper = child;
      return;
    }
    if (isErrorElement(child)) {
      error = child;
      return;
    }
    if (isOptionsElement(child)) {
      Children.forEach((child.props as { children?: ReactNode }).children, (opt) => {
        if (isValidElement(opt)) collectOption(opt);
      });
      return;
    }
    if (isOptionElement(child)) {
      collectOption(child);
    }
  });

  return { helper, error, optionsFromChildren };
}

function normalizeSelected(
  mode: IdsDropdownComboBoxMode,
  value: string | string[] | undefined,
): string[] {
  if (value == null) return [];
  if (mode === "combobox-multi") {
    return Array.isArray(value) ? value : value ? [value] : [];
  }
  if (Array.isArray(value)) return value[0] ? [value[0]] : [];
  return value ? [value] : [];
}

/**
 * Single-line value that truncates with an ellipsis; when (and only when) the
 * text is actually cut off, wrap in IDS Tooltip (design-spec Interactions).
 */
function TruncatingValue({ text, tooltip }: { text: string; tooltip?: string }) {
  const [truncated, setTruncated] = useState(false);
  const observerRef = useRef<ResizeObserver | null>(null);

  const measureRef = useCallback((el: HTMLSpanElement | null) => {
    observerRef.current?.disconnect();
    if (!el) return;
    const check = () => setTruncated(el.scrollWidth > el.clientWidth + 1);
    check();
    observerRef.current = new ResizeObserver(check);
    observerRef.current.observe(el);
  }, []);

  const valueSpan = (
    <span ref={measureRef} className={styles.valueText}>
      {text}
    </span>
  );

  if (!(truncated && tooltip)) return valueSpan;

  return (
    <IdsTooltip side="top" arrowAlign="start" hugContent>
      <TooltipTrigger display="block">{valueSpan}</TooltipTrigger>
      <TooltipPanel>
        <TooltipBody>{tooltip}</TooltipBody>
      </TooltipPanel>
    </IdsTooltip>
  );
}

function FieldLabel({
  text,
  size,
  required,
  htmlFor,
}: {
  text: string;
  size: IdsDropdownComboBoxSize;
  required: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={styles.label}
      data-size={size === "small" ? "small" : undefined}
      data-ids="ids-combobox-label"
    >
      {text}
      {required ? <span aria-hidden="true">*</span> : null}
    </label>
  );
}

export function IdsDropdownComboBox({
  children,
  mode: modeProp = "combobox-single",
  size: sizeProp = "large",
  label,
  required = false,
  placeholder = "Select",
  disabled = false,
  searchable = false,
  menuWidth: menuWidthProp = "trigger",
  showClearAll = false,
  maxVisibleItems = 6,
  noResultsLabel = "No results found",
  options: optionsProp,
  value: valueProp,
  defaultValue,
  onChange,
  onSearch,
  onOpenChange,
  onSelectAll,
  onClearAll,
  showSelectedPanel = false,
  showSelectedExpanded,
  onShowSelectedExpandedChange,
  onRemoveSelectedTag,
  defaultOpen = false,
  fullWidth = false,
  className,
  style,
  id,
}: IdsDropdownComboBoxProps) {
  const reactId = useId();
  const rootId = id ?? `ids-dropdown-combo-box-${reactId}`;
  const messageId = `${rootId}-message`;

  const mode = resolveMode(modeProp);
  const size = resolveSize(sizeProp);
  const menuWidth = resolveMenuWidth(menuWidthProp);
  const isMulti = mode === "combobox-multi";

  const { helper, error: errorMessage, optionsFromChildren } = partitionChildren(children);
  if (helper && errorMessage) {
    throw new Error(
      "IdsDropdownComboBox: project either `IdsHelper` or `IdsError`, not both.",
    );
  }

  const options = useMemo(() => {
    if (optionsProp != null && optionsProp.length > 0) return optionsProp;
    return optionsFromChildren;
  }, [optionsProp, optionsFromChildren]);

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(() =>
    normalizeSelected(mode, defaultValue),
  );
  const selectedIds = isControlled
    ? normalizeSelected(mode, valueProp)
    : internalValue;

  const emitChange = (nextIds: string[]) => {
    if (!isControlled) setInternalValue(nextIds);
    if (isMulti) {
      onChange?.(nextIds);
    } else {
      onChange?.(nextIds[0] ?? "");
    }
  };

  const idToLabel = useMemo(() => {
    const map = new Map<string, string>();
    for (const opt of options) map.set(opt.id, opt.label);
    return map;
  }, [options]);

  const labelToId = useMemo(() => {
    const map = new Map<string, string>();
    for (const opt of options) map.set(opt.label, opt.id);
    return map;
  }, [options]);

  // DropdownMenu matches selectedValues to item.value (labels in proven stories).
  const selectedLabels = useMemo(
    () =>
      selectedIds.map((idOrLabel) => idToLabel.get(idOrLabel) ?? idOrLabel),
    [selectedIds, idToLabel],
  );

  const selectedDisplay = selectedLabels.join(", ");
  const hasSelection = selectedLabels.length > 0;
  const hasError = Boolean(errorMessage);
  const message = errorMessage ?? helper;

  const applySelectionByLabels = (nextLabels: string[]) => {
    const nextIds = nextLabels.map((label) => labelToId.get(label) ?? label);
    emitChange(isMulti ? nextIds : nextIds.slice(0, 1));
  };

  const items = useMemo(
    () =>
      options.map((option) => ({
        id: option.id,
        value: option.label,
        label: option.label,
        selectable: true as const,
        disabled: option.disabled,
        onClick: () => {
          if (option.disabled) return;
          if (isMulti) {
            const has = selectedLabels.includes(option.label);
            applySelectionByLabels(
              has
                ? selectedLabels.filter((entry) => entry !== option.label)
                : [...selectedLabels, option.label],
            );
          } else {
            applySelectionByLabels([option.label]);
          }
        },
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- applySelectionByLabels closes over selectedLabels
    [options, isMulti, selectedLabels],
  );

  const trigger = (
    <IdsDropdownTriggerShell
      size={size}
      disabled={disabled}
      error={hasError}
      filled={hasSelection}
      style={fullWidth ? { width: "100%" } : undefined}
      left={
        isMulti && hasSelection ? (
          <>
            <span className={styles.badgeWrap}>
              <IdsTooltip side="top" arrowAlign="start" hugContent>
                <TooltipTrigger>
                  <span className={styles.badgeTrigger}>
                    <IdsBadge
                      value={selectedLabels.length}
                      type={disabled ? "disabled" : "default"}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipPanel>
                  <TooltipHeader>{`${selectedLabels.length} Items`}</TooltipHeader>
                  <TooltipBody>{selectedDisplay}</TooltipBody>
                </TooltipPanel>
              </IdsTooltip>
            </span>
            <TruncatingValue text={selectedDisplay || placeholder} />
          </>
        ) : (
          <TruncatingValue
            text={hasSelection ? selectedDisplay : placeholder}
            tooltip={hasSelection ? selectedDisplay : undefined}
          />
        )
      }
    />
  );

  const combobox = (
    <div
      className={styles.combobox}
      data-ids="ids-combobox"
      data-full-width={fullWidth ? "true" : undefined}
      style={fullWidth ? { width: "100%" } : undefined}
    >
      <DropdownMenu
        selectionMode={isMulti ? "multi" : "single"}
        selectedValues={selectedLabels}
        trigger={trigger}
        items={items}
        disabled={disabled}
        showSearch={searchable}
        onSearchValueChange={onSearch}
        menuWidth={menuWidth}
        matchTriggerWidth
        fullWidth={fullWidth}
        maxVisibleItems={maxVisibleItems}
        noResultsLabel={noResultsLabel}
        showClearAll={!isMulti && showClearAll}
        showSelectAllClearAll={isMulti}
        selectAllChecked={
          isMulti &&
          options.length > 0 &&
          selectedLabels.length === options.filter((o) => !o.disabled).length
        }
        selectAllIndeterminate={
          isMulti &&
          selectedLabels.length > 0 &&
          selectedLabels.length < options.filter((o) => !o.disabled).length
        }
        onSelectAllClick={(visible) => {
          if (onSelectAll) {
            onSelectAll(visible);
            return;
          }
          const scope = visible ?? options.filter((o) => !o.disabled).map((o) => o.label);
          const allInScope = scope.every((label) => selectedLabels.includes(label));
          applySelectionByLabels(
            allInScope
              ? selectedLabels.filter((label) => !scope.includes(label))
              : Array.from(new Set([...selectedLabels, ...scope])),
          );
        }}
        onClearAllClick={(visible) => {
          if (onClearAll) {
            onClearAll(visible);
            return;
          }
          if (isMulti) {
            applySelectionByLabels(
              visible
                ? selectedLabels.filter((entry) => !visible.includes(entry))
                : [],
            );
          } else {
            applySelectionByLabels([]);
          }
        }}
        clearAllDisabled={selectedLabels.length === 0}
        showSelectedPanel={isMulti && showSelectedPanel}
        showSelectedExpanded={showSelectedExpanded}
        onShowSelectedExpandedChange={onShowSelectedExpandedChange}
        onRemoveSelectedTag={(labelValue) => {
          if (onRemoveSelectedTag) {
            onRemoveSelectedTag(labelToId.get(labelValue) ?? labelValue);
            return;
          }
          applySelectionByLabels(selectedLabels.filter((entry) => entry !== labelValue));
        }}
        defaultOpen={defaultOpen && !disabled}
        onOpenChange={onOpenChange}
        ariaDescribedBy={message ? messageId : undefined}
        ariaInvalid={hasError}
        ariaLabel={label}
        listboxId={`${rootId}-listbox`}
      />
      {/* Hidden options projection for a11y/tree consumers — markers render null. */}
      <div className={styles.optionsSlot} data-ids="ids-combobox-options" hidden>
        {options.map((opt) => (
          <div
            key={opt.id}
            data-ids="ids-combobox-option"
            data-option-id={opt.id}
            data-disabled={opt.disabled ? "true" : undefined}
          >
            {opt.label}
          </div>
        ))}
      </div>
      {message != null
        ? React.cloneElement(message, {
            id: messageId,
            disabled: disabled || undefined,
          } as Record<string, unknown>)
        : null}
    </div>
  );

  return (
    <div
      id={rootId}
      className={cx(styles.root, className)}
      style={style}
      data-ids="ids-combobox-container"
      data-mode={mode}
      data-size={size}
      data-full-width={fullWidth ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-invalid={hasError ? "true" : undefined}
    >
      <div className={styles.fieldRow} data-ids="ids-combobox-field-row">
        {label ? (
          <FieldLabel text={label} size={size} required={required} htmlFor={rootId} />
        ) : null}
        {combobox}
      </div>
    </div>
  );
}

IdsDropdownComboBox.displayName = "IdsDropdownComboBox";

export const IdsDropdownComboBoxCompound = Object.assign(IdsDropdownComboBox, {
  Options: IdsComboboxOptions,
  Option: IdsComboboxOption,
});

export default IdsDropdownComboBoxCompound;
