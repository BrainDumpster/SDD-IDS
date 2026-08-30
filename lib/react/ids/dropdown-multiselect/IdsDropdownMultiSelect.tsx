/**
 * IDS Dropdown: Multiselect — React implementation from design-spec.
 *
 * Path: `lib/react/ids/dropdown-multiselect`
 * Source: `components/ids/dropdown-multiselect/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   IdsDropdownMultiSelect (root)
 *     Label? → FieldContainer + MenuPopup (shared DropdownMenu)
 *       Options → Option* (Mode B; sections via kind)
 *     IdsHelper? | IdsError?
 *     SelectedCountBadge? + SelectedCountTooltip? (field slot)
 *
 * Shared menu/trigger: `lib/react/ids/dropdown-shared` (design-spec Implementation Notes).
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
  IdsDropdownMultiSelectOption,
  type IdsDropdownMultiSelectOptionProps,
} from "./IdsDropdownMultiSelectOption";
import { IdsDropdownMultiSelectOptions } from "./IdsDropdownMultiSelectOptions";
import styles from "./IdsDropdownMultiSelect.module.css";

export type IdsDropdownMultiSelectSize = "small" | "large";
export type IdsDropdownMultiSelectMenuWidth = "trigger" | "content";

export interface IdsDropdownMultiSelectOptionModel {
  id: string;
  label: string;
  disabled?: boolean;
  kind?: "option" | "section" | "divider";
}

export interface IdsDropdownMultiSelectProps {
  children?: ReactNode;
  size?: IdsDropdownMultiSelectSize | string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  menuWidth?: IdsDropdownMultiSelectMenuWidth | string;
  maxVisibleItems?: number;
  noResultsLabel?: string;
  options?: IdsDropdownMultiSelectOptionModel[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  showSelectAllClearAll?: boolean;
  selectAllLabel?: string;
  clearAllLabel?: string;
  onSelectAll?: (visibleValues?: string[]) => void;
  onClearAll?: (visibleValues?: string[]) => void;
  clearAllDisabled?: boolean;
  showSelectedBadge?: boolean;
  showSelectedTooltip?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onOpenChange?: (open: boolean) => void;
  onSearch?: (query: string) => void;
  defaultOpen?: boolean;
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveSize(value: unknown): IdsDropdownMultiSelectSize {
  return value === "small" ? "small" : "large";
}

function resolveMenuWidth(value: unknown): IdsDropdownMultiSelectMenuWidth {
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
    child.type === IdsDropdownMultiSelectOptions ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName ===
        "IdsDropdownMultiSelectOptions")
  );
}

function isOptionElement(child: ReactElement): boolean {
  return (
    child.type === IdsDropdownMultiSelectOption ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName ===
        "IdsDropdownMultiSelectOption")
  );
}

function partitionChildren(children: ReactNode): {
  helper: ReactElement | null;
  error: ReactElement | null;
  optionsFromChildren: IdsDropdownMultiSelectOptionModel[];
} {
  let helper: ReactElement | null = null;
  let error: ReactElement | null = null;
  const optionsFromChildren: IdsDropdownMultiSelectOptionModel[] = [];

  const collectOption = (child: ReactElement) => {
    if (!isOptionElement(child)) return;
    const props = child.props as IdsDropdownMultiSelectOptionProps;
    if (!props.id) return;
    optionsFromChildren.push({
      id: props.id,
      label: props.label,
      disabled: props.disabled,
      kind: props.kind,
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
    if (isOptionElement(child)) collectOption(child);
  });

  return { helper, error, optionsFromChildren };
}

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
  size: IdsDropdownMultiSelectSize;
  required: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={styles.label}
      data-size={size === "small" ? "small" : undefined}
      data-ids="ids-dropdown-multiselect-label"
    >
      {text}
      {required ? <span aria-hidden="true">*</span> : null}
    </label>
  );
}

export function IdsDropdownMultiSelect({
  children,
  size: sizeProp = "large",
  label,
  required = false,
  placeholder = "Select",
  disabled = false,
  searchable = false,
  menuWidth: menuWidthProp = "trigger",
  maxVisibleItems = 6,
  noResultsLabel = "No results found",
  options: optionsProp,
  value: valueProp,
  defaultValue = [],
  onChange,
  showSelectAllClearAll = false,
  selectAllLabel = "Select All",
  clearAllLabel = "Clear All",
  onSelectAll,
  onClearAll,
  clearAllDisabled,
  showSelectedBadge = true,
  showSelectedTooltip = true,
  actionLabel,
  onAction,
  onOpenChange,
  onSearch,
  defaultOpen = false,
  fullWidth = false,
  className,
  style,
  id,
}: IdsDropdownMultiSelectProps) {
  const reactId = useId();
  const rootId = id ?? `ids-dropdown-multiselect-${reactId}`;
  const messageId = `${rootId}-message`;

  const size = resolveSize(sizeProp);
  const menuWidth = resolveMenuWidth(menuWidthProp);

  const { helper, error: errorMessage, optionsFromChildren } = partitionChildren(children);
  if (helper && errorMessage) {
    throw new Error(
      "IdsDropdownMultiSelect: project either `IdsHelper` or `IdsError`, not both.",
    );
  }

  const options = useMemo(() => {
    if (optionsProp != null && optionsProp.length > 0) return optionsProp;
    return optionsFromChildren;
  }, [optionsProp, optionsFromChildren]);

  const selectableOptions = useMemo(
    () => options.filter((o) => o.kind !== "section" && o.kind !== "divider"),
    [options],
  );

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const selectedIds = isControlled ? (valueProp ?? []) : internalValue;

  const idToLabel = useMemo(() => {
    const map = new Map<string, string>();
    for (const opt of selectableOptions) map.set(opt.id, opt.label);
    return map;
  }, [selectableOptions]);

  const labelToId = useMemo(() => {
    const map = new Map<string, string>();
    for (const opt of selectableOptions) map.set(opt.label, opt.id);
    return map;
  }, [selectableOptions]);

  const selectedLabels = useMemo(
    () =>
      selectedIds
        .map((idOrLabel) => idToLabel.get(idOrLabel) ?? idOrLabel)
        .filter(Boolean),
    [selectedIds, idToLabel],
  );

  const selectedDisplay = selectedLabels.join(", ");
  const hasSelection = selectedLabels.length > 0;
  const hasError = Boolean(errorMessage);
  const message = errorMessage ?? helper;

  const emitChange = (nextIds: string[]) => {
    if (!isControlled) setInternalValue(nextIds);
    onChange?.(nextIds);
  };

  const applySelectionByLabels = (nextLabels: string[]) => {
    const nextIds = nextLabels.map((lbl) => labelToId.get(lbl) ?? lbl);
    emitChange(nextIds);
  };

  const enabledLabels = useMemo(
    () => selectableOptions.filter((o) => !o.disabled).map((o) => o.label),
    [selectableOptions],
  );

  const items = useMemo(
    () =>
      options.map((option) => {
        if (option.kind === "section" || option.kind === "divider") {
          return {
            id: option.id,
            label: option.label,
            kind: option.kind,
          };
        }
        return {
          id: option.id,
          value: option.label,
          label: option.label,
          selectable: true as const,
          disabled: option.disabled,
          onClick: () => {
            if (option.disabled) return;
            const has = selectedLabels.includes(option.label);
            applySelectionByLabels(
              has
                ? selectedLabels.filter((entry) => entry !== option.label)
                : [...selectedLabels, option.label],
            );
          },
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options, selectedLabels],
  );

  const selectAllChecked =
    enabledLabels.length > 0 &&
    enabledLabels.every((lbl) => selectedLabels.includes(lbl));
  const selectAllIndeterminate =
    selectedLabels.length > 0 &&
    !selectAllChecked &&
    enabledLabels.some((lbl) => selectedLabels.includes(lbl));

  const effectiveClearAllDisabled =
    clearAllDisabled ?? selectedLabels.length === 0;

  const badgeNode =
    showSelectedBadge && hasSelection ? (
      <span className={styles.badgeWrap}>
        {showSelectedTooltip ? (
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
        ) : (
          <span className={styles.badgeTrigger}>
            <IdsBadge
              value={selectedLabels.length}
              type={disabled ? "disabled" : "default"}
            />
          </span>
        )}
      </span>
    ) : null;

  const trigger = (
    <IdsDropdownTriggerShell
      size={size}
      disabled={disabled}
      error={hasError}
      filled={hasSelection}
      style={fullWidth ? { width: "100%" } : undefined}
      left={
        <>
          {badgeNode}
          {showSelectedBadge && hasSelection ? (
            <TruncatingValue text={selectedDisplay || placeholder} />
          ) : (
            <TruncatingValue
              text={hasSelection ? selectedDisplay : placeholder}
              tooltip={hasSelection ? selectedDisplay : undefined}
            />
          )}
        </>
      }
    />
  );

  return (
    <div
      id={rootId}
      className={cx(styles.root, className)}
      style={style}
      data-ids="ids-dropdown-multiselect-container"
      data-size={size}
      data-full-width={fullWidth ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-invalid={hasError ? "true" : undefined}
    >
      <div className={styles.fieldRow} data-ids="ids-dropdown-multiselect-field-row">
        {label ? (
          <FieldLabel text={label} size={size} required={required} htmlFor={rootId} />
        ) : null}
        <div
          className={styles.field}
          data-ids="ids-dropdown-multiselect"
          data-full-width={fullWidth ? "true" : undefined}
        >
          <DropdownMenu
            selectionMode="multi"
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
            showSelectAllClearAll={showSelectAllClearAll}
            selectAllLabel={selectAllLabel}
            clearAllLabel={clearAllLabel}
            selectAllChecked={selectAllChecked}
            selectAllIndeterminate={selectAllIndeterminate}
            onSelectAllClick={(visible) => {
              if (onSelectAll) {
                onSelectAll(visible);
                return;
              }
              const scope = visible ?? enabledLabels;
              const allInScope = scope.every((lbl) => selectedLabels.includes(lbl));
              applySelectionByLabels(
                allInScope
                  ? selectedLabels.filter((lbl) => !scope.includes(lbl))
                  : Array.from(new Set([...selectedLabels, ...scope])),
              );
            }}
            onClearAllClick={(visible) => {
              if (onClearAll) {
                onClearAll(visible);
                return;
              }
              applySelectionByLabels(
                visible
                  ? selectedLabels.filter((entry) => !visible.includes(entry))
                  : [],
              );
            }}
            clearAllDisabled={effectiveClearAllDisabled}
            footerActionLabel={actionLabel}
            onFooterActionClick={onAction}
            defaultOpen={defaultOpen && !disabled}
            onOpenChange={onOpenChange}
            ariaDescribedBy={message ? messageId : undefined}
            ariaInvalid={hasError}
            ariaLabel={label}
            listboxId={`${rootId}-listbox`}
          />
          <div className={styles.optionsSlot} data-ids="ids-dropdown-multiselect-options" hidden>
            {options.map((opt) => (
              <div
                key={opt.id}
                data-ids="ids-dropdown-multiselect-option"
                data-option-id={opt.id}
                data-kind={opt.kind ?? "option"}
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
      </div>
    </div>
  );
}

IdsDropdownMultiSelect.displayName = "IdsDropdownMultiSelect";

export const IdsDropdownMultiSelectCompound = Object.assign(IdsDropdownMultiSelect, {
  Options: IdsDropdownMultiSelectOptions,
  Option: IdsDropdownMultiSelectOption,
});

export default IdsDropdownMultiSelectCompound;
