/**
 * IDS Radio Button — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/radio-button`
 * Source: `components/ids/radio-button/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Hierarchy (content projection):
 *   IdsRadioGroup
 *     IdsRadioButton[]
 *       input + controlOuter (+ controlInnerDot)
 *       IdsRadioLabel — required
 *       IdsHelper? | IdsError? — optional
 *
 * Selectors: IdsRadioGroup, ids-radio-button, ids-radio-control, ids-radio-label
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { IdsError, IdsErrorText } from "../error";
import { IdsHelper } from "../helper";
import styles from "./IdsRadioButton.module.css";

export type IdsRadioDataState = "default" | "hover" | "focus-visible" | "disabled";
export type IdsRadioOrientation = "vertical" | "horizontal";

/* -------------------------------------------------------------------------- */
/* Group context                                                              */
/* -------------------------------------------------------------------------- */

interface IdsRadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled: boolean;
  error: boolean;
  orientation: IdsRadioOrientation;
  setValue: (next: string) => void;
  focusedValue?: string;
}

const IdsRadioGroupContext = createContext<IdsRadioGroupContextValue | null>(null);

function useOptionalRadioGroup(): IdsRadioGroupContextValue | null {
  return useContext(IdsRadioGroupContext);
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* IdsRadioGroup                                                              */
/* -------------------------------------------------------------------------- */

export interface IdsRadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  children?: ReactNode;
  /** Shared group name for native single-select. */
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: IdsRadioOrientation;
  /** Visible group label text. */
  label?: string;
  showLabel?: boolean;
  /** Optional 16x16 icon node rendered after the label text. */
  labelIcon?: ReactNode;
  labelPosition?: "left" | "top";
  /** Shows a `*` required mark inside the group label. */
  required?: boolean;
  /** Accessible name fallback when no visible group label is rendered. */
  ariaLabel?: string;
  /** Group-wide error state; also renders the `errorText` message. */
  error?: boolean;
  errorText?: ReactNode;
}

export function IdsRadioGroup({
  children,
  name,
  value: valueProp,
  defaultValue,
  onChange,
  disabled = false,
  orientation = "vertical",
  label,
  showLabel = true,
  labelIcon,
  labelPosition = "left",
  required = false,
  ariaLabel,
  error = false,
  errorText,
  className,
  id: idProp,
  onKeyDown: onKeyDownProp,
  onFocus: onFocusProp,
  ...rest
}: IdsRadioGroupProps) {
  const reactId = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const groupId = idProp ?? `ids-radio-group-${reactId}`;
  const labelId = `${groupId}-label`;
  const errorId = `${groupId}-error`;

  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = isControlled ? valueProp : uncontrolled;

  const [focusedValue, setFocusedValue] = useState<string | undefined>(valueProp ?? defaultValue);

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  useEffect(() => {
    if (valueProp !== undefined) setFocusedValue(valueProp);
  }, [valueProp]);

  useEffect(() => {
    if (focusedValue !== undefined) return;
    const groupEl = groupRef.current;
    if (!groupEl) return;
    const radios = Array.from(
      groupEl.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${CSS.escape(name)}"]`),
    );
    if (!radios.length) return;
    const selected = radios.find((r) => r.checked);
    setFocusedValue((selected ?? radios[0]).value);
  }, [focusedValue, name]);

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.type === "radio") {
        setFocusedValue(target.value);
      }
      onFocusProp?.(event);
    },
    [onFocusProp],
  );

  const focusOption = useCallback(
    (target: HTMLInputElement) => {
      target.focus();
      setFocusedValue(target.value);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const current = event.target;
      if (!(current instanceof HTMLInputElement) || current.type !== "radio") {
        onKeyDownProp?.(event);
        return;
      }

      const groupEl = groupRef.current;
      if (!groupEl) {
        onKeyDownProp?.(event);
        return;
      }

      const radios = Array.from(
        groupEl.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${CSS.escape(name)}"]`),
      );
      if (!radios.length) {
        onKeyDownProp?.(event);
        return;
      }

      const currentIndex = radios.indexOf(current);
      const isCurrentEnabled = current.getAttribute("aria-disabled") !== "true";

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight": {
          event.preventDefault();
          const target = radios[(currentIndex + 1) % radios.length];
          focusOption(target);
          break;
        }
        case "ArrowUp":
        case "ArrowLeft": {
          event.preventDefault();
          const target =
            radios[(currentIndex - 1 + radios.length) % radios.length];
          focusOption(target);
          break;
        }
        case "Home": {
          event.preventDefault();
          focusOption(radios[0]);
          break;
        }
        case "End": {
          event.preventDefault();
          focusOption(radios[radios.length - 1]);
          break;
        }
        case " ":
        case "Spacebar":
        case "Enter": {
          event.preventDefault();
          if (isCurrentEnabled) {
            setValue(current.value);
          }
          break;
        }
        default:
          break;
      }

      onKeyDownProp?.(event);
    },
    [focusOption, name, onKeyDownProp, setValue],
  );

  const ctx = useMemo<IdsRadioGroupContextValue>(
    () => ({ name, value, disabled, error, orientation, setValue, focusedValue }),
    [name, value, disabled, error, orientation, setValue, focusedValue],
  );

  const shouldRenderLabel = showLabel && Boolean(label);
  const hasErrorMessage = Boolean(error && errorText);

  return (
    <IdsRadioGroupContext.Provider value={ctx}>
      <div
        {...rest}
        ref={groupRef}
        id={groupId}
        role="radiogroup"
        className={cx(styles["IdsRadioGroup"], className)}
        data-ids="IdsRadioGroup"
        data-orientation={orientation}
        data-label-position={labelPosition}
        data-has-error-message={hasErrorMessage ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        aria-labelledby={shouldRenderLabel ? labelId : undefined}
        aria-label={!shouldRenderLabel ? ariaLabel : undefined}
        aria-invalid={error || undefined}
        aria-errormessage={hasErrorMessage ? errorId : undefined}
        aria-required={required || undefined}
        aria-disabled={disabled ? true : undefined}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >
        {shouldRenderLabel ? (
          <span
            id={labelId}
            className={styles["IdsRadioGroupLabel"]}
            data-ids="IdsRadioGroupLabel"
          >
            {label}
            {required ? (
              <span
                className={styles["IdsRadioGroupLabelRequired"]}
                data-ids="IdsRadioGroupLabelRequired"
                aria-hidden="true"
              >
                *
              </span>
            ) : null}
            {labelIcon ? (
              <span className={styles["IdsRadioGroupLabelIcon"]}>{labelIcon}</span>
            ) : null}
          </span>
        ) : null}
        <div
          className={styles["IdsRadioGroupBody"]}
          data-ids="IdsRadioGroupBody"
        >
          <div
            className={styles["IdsRadioGroupItems"]}
            data-ids="IdsRadioGroupItems"
          >
            {children}
          </div>
          {hasErrorMessage ? (
            <IdsError id={errorId}>
              <IdsErrorText>{errorText}</IdsErrorText>
            </IdsError>
          ) : null}
        </div>
      </div>
    </IdsRadioGroupContext.Provider>
  );
}
IdsRadioGroup.displayName = "IdsRadioGroup";

/* -------------------------------------------------------------------------- */
/* IdsRadioLabel                                                              */
/* -------------------------------------------------------------------------- */

const IdsRadioItemContext = createContext<{ inputId: string } | null>(null);

function useIdsRadioItem(component: string) {
  const ctx = useContext(IdsRadioItemContext);
  if (!ctx) throw new Error(`${component} must be used within IdsRadioButton.`);
  return ctx;
}

export interface IdsRadioLabelProps {
  children?: ReactNode;
  className?: string;
}

export function IdsRadioLabel({ children, className }: IdsRadioLabelProps) {
  useIdsRadioItem("IdsRadioLabel");
  if (children == null || children === false) return null;
  return (
    <span className={cx(styles["ids-radio-label"], className)} data-ids="ids-radio-label">
      {children}
    </span>
  );
}
IdsRadioLabel.displayName = "IdsRadioLabel";

function isLabelElement(child: ReactElement): boolean {
  return (
    child.type === IdsRadioLabel ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName === "IdsRadioLabel")
  );
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

function partitionChildren(children: ReactNode): {
  label: ReactElement | null;
  helper: ReactElement | null;
  error: ReactElement | null;
} {
  let label: ReactElement | null = null;
  let helper: ReactElement | null = null;
  let error: ReactElement | null = null;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (isLabelElement(child)) label = child;
    else if (isHelperElement(child)) helper = child;
    else if (isErrorElement(child)) error = child;
  });
  return { label, helper, error };
}

/* -------------------------------------------------------------------------- */
/* IdsRadioButton                                                             */
/* -------------------------------------------------------------------------- */

export interface IdsRadioButtonProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "checked" | "defaultChecked" | "onChange" | "children" | "size" | "value"
  > {
  children?: ReactNode;
  /** Option value (required). */
  value: string;
  /**
   * Group name when used standalone (outside IdsRadioGroup).
   * Inside a group, the group's `name` wins.
   */
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  /** Forces error styling on the control (merged with group `error` and `IdsError` child). */
  error?: boolean;
  onChange?: (checked: boolean) => void;
  /** Demo/testing visual override only. */
  dataState?: IdsRadioDataState;
}

export const IdsRadioButton = forwardRef<HTMLInputElement, IdsRadioButtonProps>(
  function IdsRadioButton(
    {
      children,
      value,
      name: nameProp,
      checked: checkedProp,
      defaultChecked,
      disabled = false,
      error: errorProp = false,
      onChange,
      dataState,
      id: idProp,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const group = useOptionalRadioGroup();
    const reactId = useId();
    const inputId = idProp ?? `ids-radio-${reactId}`;
    const messageId = `${inputId}-message`;

    const name = group?.name ?? nameProp;
    if (!name) {
      throw new Error(
        "IdsRadioButton: provide `name`, or place the control inside `IdsRadioGroup`.",
      );
    }

    const isDisabled = Boolean(disabled || group?.disabled || dataState === "disabled");

    const isItemControlled = checkedProp !== undefined;
    const isStandaloneUncontrolled = !group && !isItemControlled;
    const [uncontrolledChecked, setUncontrolledChecked] = useState(Boolean(defaultChecked));
    const checked = group
      ? group.value === value
      : isItemControlled
        ? Boolean(checkedProp)
        : uncontrolledChecked;

    const { label, helper, error: errorMessage } = partitionChildren(children);
    if (!label) {
      throw new Error("IdsRadioButton: project `IdsRadioLabel` (required for accessibility).");
    }
    if (helper && errorMessage) {
      throw new Error("IdsRadioButton: project either `IdsHelper` or `IdsError`, not both.");
    }

    const hasError = Boolean(errorProp || group?.error || errorMessage);
    const message = errorMessage ?? helper;

    const tabIndex = group
      ? group.focusedValue === value
        ? 0
        : -1
      : isDisabled
        ? -1
        : 0;

    const itemCtx = useMemo(() => ({ inputId }), [inputId]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      if (group) {
        group.setValue(value);
      }
      if (isStandaloneUncontrolled) {
        setUncontrolledChecked(event.target.checked);
      }
      onChange?.(event.target.checked);
    };

    const projectedMessage =
      message != null
        ? React.cloneElement(message as ReactElement<{ id?: string; disabled?: boolean }>, {
            id: messageId,
            disabled: isDisabled,
          })
        : null;

    return (
      <IdsRadioItemContext.Provider value={itemCtx}>
        <div
          className={cx(styles["ids-radio-button"], className)}
          data-ids="ids-radio-button"
          data-checked={checked ? "true" : "false"}
          data-disabled={isDisabled ? "true" : "false"}
          data-error={hasError ? "true" : "false"}
          data-state={dataState && dataState !== "default" ? dataState : undefined}
          data-value={value}
        >
          <label
            className={styles["ids-radio-row"]}
            data-ids="ids-radio-row"
            data-disabled={isDisabled ? "true" : "false"}
            htmlFor={inputId}
          >
            <input
              {...rest}
              ref={forwardedRef}
              id={inputId}
              type="radio"
              tabIndex={tabIndex}
              className={styles["ids-radio-input"]}
              name={name}
              value={value}
              checked={Boolean(checked)}
              aria-disabled={isDisabled ? true : undefined}
              aria-invalid={hasError || undefined}
              aria-describedby={projectedMessage ? messageId : undefined}
              onChange={handleChange}
            />
            <span
              className={styles["ids-radio-control"]}
              data-ids="ids-radio-control"
              aria-hidden="true"
            >
              <span className={styles["ids-radio-dot"]} data-ids="ids-radio-dot" />
            </span>
            {label}
          </label>
          {projectedMessage}
        </div>
      </IdsRadioItemContext.Provider>
    );
  },
);

IdsRadioButton.displayName = "IdsRadioButton";

export const IdsRadioButtonCompound = Object.assign(IdsRadioButton, {
  Label: IdsRadioLabel,
  Group: IdsRadioGroup,
});

export default IdsRadioButtonCompound;
