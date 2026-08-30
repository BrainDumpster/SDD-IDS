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
 * Selectors: ids-radio-group, ids-radio-button, ids-radio-control, ids-radio-label
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { IdsError } from "../error";
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
  setValue: (next: string) => void;
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

export interface IdsRadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  children?: ReactNode;
  /** Shared group name for native single-select. */
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: IdsRadioOrientation;
}

export function IdsRadioGroup({
  children,
  name,
  value: valueProp,
  defaultValue,
  onChange,
  disabled = false,
  orientation = "vertical",
  className,
  ...rest
}: IdsRadioGroupProps) {
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = isControlled ? valueProp : uncontrolled;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const ctx = useMemo<IdsRadioGroupContextValue>(
    () => ({ name, value, disabled, setValue }),
    [name, value, disabled, setValue],
  );

  return (
    <IdsRadioGroupContext.Provider value={ctx}>
      <div
        {...rest}
        role="radiogroup"
        className={cx(
          styles["ids-radio-group"],
          orientation === "horizontal"
            ? styles["ids-radio-group--horizontal"]
            : styles["ids-radio-group--vertical"],
          className,
        )}
        data-ids="ids-radio-group"
        data-orientation={orientation}
        data-disabled={disabled ? "true" : undefined}
      >
        {children}
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
    const checked = group
      ? group.value === value
      : isItemControlled
        ? Boolean(checkedProp)
        : undefined;

    const { label, helper, error: errorMessage } = partitionChildren(children);
    if (!label) {
      throw new Error("IdsRadioButton: project `IdsRadioLabel` (required for accessibility).");
    }
    if (helper && errorMessage) {
      throw new Error("IdsRadioButton: project either `IdsHelper` or `IdsError`, not both.");
    }

    const hasError = Boolean(errorMessage);
    const message = errorMessage ?? helper;
    const isCheckedVisual =
      checked === true || (checked === undefined && Boolean(defaultChecked));

    const itemCtx = useMemo(() => ({ inputId }), [inputId]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      if (group) {
        group.setValue(value);
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
          data-checked={isCheckedVisual ? "true" : "false"}
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
              className={styles["ids-radio-input"]}
              name={name}
              value={value}
              checked={
                group || isItemControlled
                  ? Boolean(checked)
                  : undefined
              }
              defaultChecked={
                !group && !isItemControlled ? defaultChecked : undefined
              }
              disabled={isDisabled}
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
