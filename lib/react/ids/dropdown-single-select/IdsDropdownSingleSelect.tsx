/**
 * IDS Dropdown: Single-select — React implementation from design-spec.
 *
 * Path: `lib/react/ids/dropdown-single-select`
 * Source: `components/ids/dropdown-single-select/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   IdsDropdownSingleSelect (root)
 *     Label? → FieldContainer + MenuPopup (shared DropdownMenu)
 *       Options → Option* (Mode B markers; sections via kind)
 *     IdsHelper? | IdsError?
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
import { IdsError } from "../error";
import { IdsHelper } from "../helper";
import {
  IdsTooltip,
  TooltipBody,
  TooltipPanel,
  TooltipTrigger,
} from "../tooltip";
import {
  DropdownMenu,
  IdsDropdownTriggerShell,
} from "../dropdown-shared";
import {
  IdsDropdownSingleSelectOption,
  type IdsDropdownSingleSelectOptionProps,
} from "./IdsDropdownSingleSelectOption";
import { IdsDropdownSingleSelectOptions } from "./IdsDropdownSingleSelectOptions";
import styles from "./IdsDropdownSingleSelect.module.css";

export type IdsDropdownSingleSelectSize = "small" | "large";
export type IdsDropdownSingleSelectMenuWidth = "trigger" | "content";

export interface IdsDropdownSingleSelectOptionModel {
  id: string;
  label: string;
  disabled?: boolean;
  kind?: "option" | "section" | "divider";
}

export interface IdsDropdownSingleSelectProps {
  children?: ReactNode;
  size?: IdsDropdownSingleSelectSize | string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  menuWidth?: IdsDropdownSingleSelectMenuWidth | string;
  showClearAll?: boolean;
  showRadio?: boolean;
  maxVisibleItems?: number;
  noResultsLabel?: string;
  options?: IdsDropdownSingleSelectOptionModel[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
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

function resolveSize(value: unknown): IdsDropdownSingleSelectSize {
  return value === "small" ? "small" : "large";
}

function resolveMenuWidth(value: unknown): IdsDropdownSingleSelectMenuWidth {
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
    child.type === IdsDropdownSingleSelectOptions ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName ===
        "IdsDropdownSingleSelectOptions")
  );
}

function isOptionElement(child: ReactElement): boolean {
  return (
    child.type === IdsDropdownSingleSelectOption ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName ===
        "IdsDropdownSingleSelectOption")
  );
}

function partitionChildren(children: ReactNode): {
  helper: ReactElement | null;
  error: ReactElement | null;
  optionsFromChildren: IdsDropdownSingleSelectOptionModel[];
} {
  let helper: ReactElement | null = null;
  let error: ReactElement | null = null;
  const optionsFromChildren: IdsDropdownSingleSelectOptionModel[] = [];

  const collectOption = (child: ReactElement) => {
    if (!isOptionElement(child)) return;
    const props = child.props as IdsDropdownSingleSelectOptionProps;
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
  size: IdsDropdownSingleSelectSize;
  required: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={styles.label}
      data-size={size === "small" ? "small" : undefined}
      data-ids="ids-dropdown-single-select-label"
    >
      {text}
      {required ? <span aria-hidden="true">*</span> : null}
    </label>
  );
}

export function IdsDropdownSingleSelect({
  children,
  size: sizeProp = "large",
  label,
  required = false,
  placeholder = "Select",
  disabled = false,
  searchable = false,
  menuWidth: menuWidthProp = "trigger",
  showClearAll = false,
  showRadio = false,
  maxVisibleItems = 6,
  noResultsLabel = "No results found",
  options: optionsProp,
  value: valueProp,
  defaultValue = "",
  onChange,
  actionLabel,
  onAction,
  onOpenChange,
  onSearch,
  defaultOpen = false,
  fullWidth = false,
  className,
  style,
  id,
}: IdsDropdownSingleSelectProps) {
  const reactId = useId();
  const rootId = id ?? `ids-dropdown-single-select-${reactId}`;
  const messageId = `${rootId}-message`;

  const size = resolveSize(sizeProp);
  const menuWidth = resolveMenuWidth(menuWidthProp);

  const { helper, error: errorMessage, optionsFromChildren } = partitionChildren(children);
  if (helper && errorMessage) {
    throw new Error(
      "IdsDropdownSingleSelect: project either `IdsHelper` or `IdsError`, not both.",
    );
  }

  const options = useMemo(() => {
    if (optionsProp != null && optionsProp.length > 0) return optionsProp;
    return optionsFromChildren;
  }, [optionsProp, optionsFromChildren]);

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedId = isControlled ? (valueProp ?? "") : internalValue;

  const idToLabel = useMemo(() => {
    const map = new Map<string, string>();
    for (const opt of options) {
      if (opt.kind === "section" || opt.kind === "divider") continue;
      map.set(opt.id, opt.label);
    }
    return map;
  }, [options]);

  const selectedLabel =
    (selectedId && (idToLabel.get(selectedId) ?? selectedId)) || "";
  const hasSelection = Boolean(selectedLabel);
  const hasError = Boolean(errorMessage);
  const message = errorMessage ?? helper;

  const emitChange = (nextId: string) => {
    if (!isControlled) setInternalValue(nextId);
    onChange?.(nextId);
  };

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
            emitChange(option.id);
          },
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options],
  );

  const trigger = (
    <IdsDropdownTriggerShell
      size={size}
      disabled={disabled}
      error={hasError}
      filled={hasSelection}
      style={fullWidth ? { width: "100%" } : undefined}
      left={
        <TruncatingValue
          text={hasSelection ? selectedLabel : placeholder}
          tooltip={hasSelection ? selectedLabel : undefined}
        />
      }
    />
  );

  return (
    <div
      id={rootId}
      className={cx(styles.root, className)}
      style={style}
      data-ids="ids-dropdown-single-select-container"
      data-size={size}
      data-full-width={fullWidth ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-invalid={hasError ? "true" : undefined}
    >
      <div className={styles.fieldRow} data-ids="ids-dropdown-single-select-field-row">
        {label ? (
          <FieldLabel text={label} size={size} required={required} htmlFor={rootId} />
        ) : null}
        <div
          className={styles.field}
          data-ids="ids-dropdown-single-select"
          data-full-width={fullWidth ? "true" : undefined}
        >
          <DropdownMenu
            selectionMode="single"
            selectedValues={selectedLabel ? [selectedLabel] : []}
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
            showClearAll={showClearAll}
            showSingleSelectRadio={showRadio}
            onClearAllClick={() => emitChange("")}
            footerActionLabel={actionLabel}
            onFooterActionClick={onAction}
            defaultOpen={defaultOpen && !disabled}
            onOpenChange={onOpenChange}
            ariaDescribedBy={message ? messageId : undefined}
            ariaInvalid={hasError}
            ariaLabel={label}
            listboxId={`${rootId}-listbox`}
          />
          <div className={styles.optionsSlot} data-ids="ids-dropdown-single-select-options" hidden>
            {options.map((opt) => (
              <div
                key={opt.id}
                data-ids="ids-dropdown-single-select-option"
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

IdsDropdownSingleSelect.displayName = "IdsDropdownSingleSelect";

export const IdsDropdownSingleSelectCompound = Object.assign(IdsDropdownSingleSelect, {
  Options: IdsDropdownSingleSelectOptions,
  Option: IdsDropdownSingleSelectOption,
});

export default IdsDropdownSingleSelectCompound;
