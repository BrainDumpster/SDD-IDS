/**
 * IDS Checkbox — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/checkbox`
 * Source: `components/ids/checkbox/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Hierarchy (content projection):
 *   IdsCheckbox
 *     input + controlBox (+ CSS indicator)
 *     IdsCheckboxLabel     — required
 *     IdsHelper? | IdsError? — optional message (shared IDS primitives)
 *
 * Selectors: ids-checkbox, ids-checkbox-control, ids-checkbox-label
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
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { IdsError } from "../error";
import { IdsHelper } from "../helper";
import styles from "./IdsCheckbox.module.css";

export type IdsCheckboxDataState = "default" | "hover" | "focus-visible" | "disabled";

export interface IdsCheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "checked" | "defaultChecked" | "onChange" | "children" | "size"
  > {
  children?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  /** Partial / mixed selection (Figma “Partial”; ARIA `mixed`). */
  indeterminate?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  onChange?: (checked: boolean) => void;
  /** Demo/testing visual override only. */
  dataState?: IdsCheckboxDataState;
}

interface IdsCheckboxContextValue {
  inputId: string;
}

const IdsCheckboxContext = createContext<IdsCheckboxContextValue | null>(null);

function useIdsCheckbox(component: string): IdsCheckboxContextValue {
  const ctx = useContext(IdsCheckboxContext);
  if (!ctx) {
    throw new Error(`${component} must be used within IdsCheckbox.`);
  }
  return ctx;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* IdsCheckboxLabel                                                           */
/* -------------------------------------------------------------------------- */

export interface IdsCheckboxLabelProps {
  children?: ReactNode;
  className?: string;
}

export function IdsCheckboxLabel({ children, className }: IdsCheckboxLabelProps) {
  useIdsCheckbox("IdsCheckboxLabel");
  if (children == null || children === false) return null;
  return (
    <span className={cx(styles["ids-checkbox-label"], className)} data-ids="ids-checkbox-label">
      {children}
    </span>
  );
}
IdsCheckboxLabel.displayName = "IdsCheckboxLabel";

function isLabelElement(child: ReactElement): boolean {
  return (
    child.type === IdsCheckboxLabel ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName === "IdsCheckboxLabel")
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
/* IdsCheckbox                                                                */
/* -------------------------------------------------------------------------- */

export const IdsCheckbox = forwardRef<HTMLInputElement, IdsCheckboxProps>(function IdsCheckbox(
  {
    children,
    checked: checkedProp,
    defaultChecked = false,
    indeterminate = false,
    disabled = false,
    name,
    value,
    onChange,
    dataState,
    id: idProp,
    className,
    ...rest
  },
  forwardedRef,
) {
  const reactId = useId();
  const inputId = idProp ?? `ids-checkbox-${reactId}`;
  const messageId = `${inputId}-message`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = checkedProp !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const checked = isControlled ? Boolean(checkedProp) : uncontrolledChecked;

  const isDisabled = Boolean(disabled || dataState === "disabled");
  const showPartial = Boolean(indeterminate);
  const showChecked = checked && !showPartial;

  const { label, helper, error: errorMessage } = partitionChildren(children);
  if (!label) {
    throw new Error("IdsCheckbox: project `IdsCheckboxLabel` (required for accessibility).");
  }
  if (helper && errorMessage) {
    throw new Error("IdsCheckbox: project either `IdsHelper` or `IdsError`, not both.");
  }

  const hasError = Boolean(errorMessage);
  const message = errorMessage ?? helper;

  useEffect(() => {
    const el = inputRef.current;
    if (el) el.indeterminate = showPartial;
  }, [showPartial]);

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  const ctx = useMemo<IdsCheckboxContextValue>(() => ({ inputId }), [inputId]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    const next = showPartial ? true : event.target.checked;
    if (!isControlled) setUncontrolledChecked(next);
    onChange?.(next);
  };

  const ariaChecked: boolean | "mixed" = showPartial ? "mixed" : checked;

  const projectedMessage =
    message != null
      ? React.cloneElement(message as ReactElement<{ id?: string; disabled?: boolean }>, {
          id: messageId,
          disabled: isDisabled,
        })
      : null;

  return (
    <IdsCheckboxContext.Provider value={ctx}>
      <div
        className={cx(styles["ids-checkbox"], className)}
        data-ids="ids-checkbox"
        data-checked={showChecked ? "true" : "false"}
        data-indeterminate={showPartial ? "true" : "false"}
        data-disabled={isDisabled ? "true" : "false"}
        data-error={hasError ? "true" : "false"}
        data-state={dataState && dataState !== "default" ? dataState : undefined}
      >
        <label
          className={styles["ids-checkbox-row"]}
          data-ids="ids-checkbox-row"
          data-disabled={isDisabled ? "true" : "false"}
          htmlFor={inputId}
        >
          <input
            {...rest}
            ref={setRefs}
            id={inputId}
            type="checkbox"
            className={styles["ids-checkbox-input"]}
            name={name}
            value={value}
            checked={isControlled ? checked : undefined}
            defaultChecked={isControlled ? undefined : defaultChecked}
            disabled={isDisabled}
            aria-checked={ariaChecked}
            aria-invalid={hasError || undefined}
            aria-describedby={projectedMessage ? messageId : undefined}
            onChange={handleChange}
          />
          <span
            className={styles["ids-checkbox-control"]}
            data-ids="ids-checkbox-control"
            aria-hidden="true"
          >
            <span
              className={cx(
                styles["ids-checkbox-indicator"],
                showPartial
                  ? styles["ids-checkbox-indicator--partial"]
                  : styles["ids-checkbox-indicator--check"],
              )}
              data-ids="ids-checkbox-indicator"
            />
          </span>
          {label}
        </label>
        {projectedMessage}
      </div>
    </IdsCheckboxContext.Provider>
  );
});

IdsCheckbox.displayName = "IdsCheckbox";

export const IdsCheckboxCompound = Object.assign(IdsCheckbox, {
  Label: IdsCheckboxLabel,
});

export default IdsCheckboxCompound;
