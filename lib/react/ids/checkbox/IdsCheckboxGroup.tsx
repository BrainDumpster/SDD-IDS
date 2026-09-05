/**
 * IDS Checkbox Group — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/checkbox`
 * Source: `components/ids/checkbox/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Selectors: IdsCheckboxGroup, IdsCheckboxGroupLabel, IdsCheckboxGroupItems
 * No @base-ui-components dependency.
 */

import React, {
  createContext,
  useContext,
  useId,
  useMemo,
  type ReactNode,
} from "react";
import { IdsError, IdsErrorText } from "../error";
import styles from "./IdsCheckboxGroup.module.css";

export interface IdsCheckboxGroupContextValue {
  name?: string;
  disabled?: boolean;
  error?: boolean;
  orientation?: "vertical" | "horizontal";
}

const IdsCheckboxGroupContext = createContext<IdsCheckboxGroupContextValue | null>(null);

export function useIdsCheckboxGroup(): IdsCheckboxGroupContextValue | null {
  return useContext(IdsCheckboxGroupContext);
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export interface IdsCheckboxGroupProps {
  children?: ReactNode;
  /** Shared form `name` for child checkboxes. */
  name?: string;
  /** When `true`, disables every child checkbox (merged with per-item `disabled`). */
  disabled?: boolean;
  /** Group-wide error state; also renders the `errorText` message. */
  error?: boolean;
  /** Layout of child checkboxes. */
  orientation?: "vertical" | "horizontal";
  /** Form label text for the group. */
  label?: string;
  /** Toggle form label visibility. */
  showLabel?: boolean;
  /** Optional 16x16 icon rendered after the label text (and `*`, if `required`). */
  labelIcon?: ReactNode;
  /** Position of the form label relative to the options. */
  labelPosition?: "left" | "top";
  /** Renders a required `*` inside the label and sets `aria-required` on the group. */
  required?: boolean;
  /** Accessible name when no visible label is rendered. */
  ariaLabel?: string;
  /** Validation error message rendered below the options when `error` is true. */
  errorText?: ReactNode;
  className?: string;
}

export function IdsCheckboxGroup({
  children,
  name,
  disabled = false,
  error = false,
  orientation = "vertical",
  label,
  showLabel = true,
  labelIcon,
  labelPosition = "left",
  required = false,
  ariaLabel,
  errorText,
  className,
}: IdsCheckboxGroupProps) {
  const reactId = useId();
  const labelId = `${reactId}-label`;
  const errorId = `${reactId}-error`;

  const shouldRenderLabel = showLabel && Boolean(label);
  const hasErrorMessage = Boolean(error && errorText);

  const ctx = useMemo<IdsCheckboxGroupContextValue>(
    () => ({ name, disabled, error, orientation }),
    [name, disabled, error, orientation],
  );

  return (
    <IdsCheckboxGroupContext.Provider value={ctx}>
      <div
        className={cx(styles["IdsCheckboxGroup"], className)}
        data-ids="IdsCheckboxGroup"
        data-orientation={orientation}
        data-label-position={labelPosition}
        data-error={error ? "true" : undefined}
        data-has-error-message={hasErrorMessage ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        role="group"
        aria-labelledby={shouldRenderLabel ? labelId : undefined}
        aria-label={!shouldRenderLabel ? ariaLabel : undefined}
        aria-invalid={error ? true : undefined}
        aria-errormessage={error && errorText ? errorId : undefined}
        aria-required={required ? true : undefined}
      >
        {shouldRenderLabel ? (
          <span
            id={labelId}
            className={styles["IdsCheckboxGroupLabel"]}
            data-ids="IdsCheckboxGroupLabel"
          >
            {label}
            {required ? (
              <span
                className={styles["IdsCheckboxGroupLabelRequired"]}
                data-ids="IdsCheckboxGroupLabelRequired"
                aria-hidden="true"
              >
                *
              </span>
            ) : null}
            {labelIcon ? (
              <span className={styles["IdsCheckboxGroupLabelIcon"]}>{labelIcon}</span>
            ) : null}
          </span>
        ) : null}
        <div
          className={styles["IdsCheckboxGroupBody"]}
          data-ids="IdsCheckboxGroupBody"
        >
          <div
            className={styles["IdsCheckboxGroupItems"]}
            data-ids="IdsCheckboxGroupItems"
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
    </IdsCheckboxGroupContext.Provider>
  );
}

IdsCheckboxGroup.displayName = "IdsCheckboxGroup";
