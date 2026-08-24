/**
 * IDS Text Box — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/text-box`
 * Source: `components/ids/text-box/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Hierarchy (content projection):
 *   IdsTextBox
 *     control (input | textarea) + optional suffix icon
 *     IdsHelper? | IdsError? — optional message (shared IDS primitives)
 *
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  isValidElement,
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { IdsError } from "../error";
import { IdsHelper } from "../helper";
import { IdsIcon } from "../icon";
import styles from "./IdsTextBox.module.css";

export type IdsTextBoxComponentType = "text-input" | "text-area";
export type IdsTextBoxSize = "large" | "small";
export type IdsTextBoxState =
  | "default"
  | "hover"
  | "selected"
  | "focus"
  | "disabled"
  | "error";

const DEFAULT_ICON_NAME = "mail";
const SHAPE_PATTERN = /^[a-z0-9-]+$/;

const iconUrlByShape: Record<string, string> = (() => {
  const modules = import.meta.glob<string>("../../../../assets/icons/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
  });
  const out: Record<string, string> = {};
  for (const path of Object.keys(modules)) {
    const file = path.replace(/^.*\/([^/]+)\.svg$/, "$1");
    if (file && modules[path] != null) {
      out[file] = modules[path] as string;
    }
  }
  return out;
})();

function hasIconAsset(shape: string): boolean {
  return SHAPE_PATTERN.test(shape) && Boolean(iconUrlByShape[shape]);
}

export interface IdsTextBoxProps {
  children?: ReactNode;
  componentType?: IdsTextBoxComponentType;
  size?: IdsTextBoxSize;
  /** Demo/testing visual override only — must not block runtime interaction. */
  state?: IdsTextBoxState;
  label?: string;
  showLabel?: boolean;
  required?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  invalid?: boolean;
  showIcon?: boolean;
  iconName?: string;
  id?: string;
  name?: string;
  rows?: number;
  inputType?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveComponentType(value: unknown): IdsTextBoxComponentType {
  return value === "text-area" ? "text-area" : "text-input";
}

function resolveSize(value: unknown): IdsTextBoxSize {
  return value === "small" ? "small" : "large";
}

function resolveState(value: unknown): IdsTextBoxState {
  if (
    value === "hover" ||
    value === "selected" ||
    value === "focus" ||
    value === "disabled" ||
    value === "error"
  ) {
    return value;
  }
  return "default";
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
  helper: ReactElement | null;
  error: ReactElement | null;
} {
  let helper: ReactElement | null = null;
  let error: ReactElement | null = null;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (isHelperElement(child)) helper = child;
    else if (isErrorElement(child)) error = child;
  });
  return { helper, error };
}

export function IdsTextBox({
  children,
  componentType: componentTypeProp = "text-input",
  size: sizeProp = "large",
  state: stateProp = "default",
  label,
  showLabel = true,
  required = false,
  placeholder,
  value,
  defaultValue,
  disabled = false,
  invalid = false,
  showIcon = true,
  iconName = DEFAULT_ICON_NAME,
  id,
  name,
  rows = 4,
  inputType = "text",
  ariaLabel,
  ariaDescribedBy,
  onValueChange,
  className,
}: IdsTextBoxProps) {
  const reactId = useId();
  const inputId = id ?? `ids-text-box-${reactId}`;
  const messageId = `${inputId}-message`;

  const componentType = resolveComponentType(componentTypeProp);
  const size = resolveSize(sizeProp);
  const demoState = resolveState(stateProp);

  const { helper, error: errorMessage } = partitionChildren(children);
  if (helper && errorMessage) {
    throw new Error("IdsTextBox: project either `IdsHelper` or `IdsError`, not both.");
  }

  const isDisabled = Boolean(disabled || demoState === "disabled");
  const hasError = Boolean(errorMessage || invalid || demoState === "error");

  const visualState: IdsTextBoxState = isDisabled
    ? "disabled"
    : hasError
      ? "error"
      : demoState;

  const shouldRenderLabel = showLabel && Boolean(label);
  const message = errorMessage ?? helper;

  const describedBy =
    [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(" ") || undefined;

  const useTextArea = componentType === "text-area";
  // small valid for text-input only; text-area ignores small height constraint
  const sizeClass = useTextArea
    ? styles["ids-text-box-control--text-area"]
    : size === "small"
      ? styles["ids-text-box-control--small"]
      : styles["ids-text-box-control--large"];

  const showSuffix = showIcon && hasIconAsset(iconName);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onValueChange?.(event.target.value);
  };

  const projectedMessage =
    message != null
      ? React.cloneElement(message as ReactElement<{ id?: string; disabled?: boolean }>, {
          id: messageId,
          disabled: isDisabled,
        })
      : null;

  const sharedFieldProps = {
    id: inputId,
    name,
    placeholder,
    disabled: isDisabled,
    value,
    defaultValue,
    "aria-invalid": hasError ? true : undefined,
    "aria-required": required ? true : undefined,
    "aria-describedby": describedBy,
    // Spec: aria-label is fallback when no visible label; placeholder is never the label
    "aria-label": shouldRenderLabel ? undefined : ariaLabel,
    onChange: handleChange,
  };

  const fieldGroup = (
    <div
      className={cx(styles["ids-text-box"], !shouldRenderLabel && className)}
      data-ids="ids-text-box"
      data-error={hasError ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
    >
      <div
        className={cx(styles["ids-text-box-control"], sizeClass)}
        data-ids="ids-text-box-control"
        data-state={visualState !== "default" ? visualState : undefined}
      >
        {useTextArea ? (
          <textarea
            className={styles["ids-text-box-value"]}
            data-ids="ids-text-box-textarea"
            rows={rows}
            {...(sharedFieldProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={styles["ids-text-box-value"]}
            data-ids="ids-text-box-input"
            type={inputType}
            {...(sharedFieldProps as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {showSuffix ? (
          <span
            className={styles["ids-text-box-suffix-icon"]}
            data-ids="ids-text-box-suffix-icon"
            aria-hidden="true"
          >
            <IdsIcon shape={iconName} size={16} color="currentColor" />
          </span>
        ) : null}
      </div>

      {projectedMessage}
    </div>
  );

  if (!shouldRenderLabel) {
    return fieldGroup;
  }

  return (
    <div
      className={cx(styles["ids-text-box-field"], className)}
      data-ids="ids-text-box-field"
    >
      <label
        className={styles["ids-text-box-label"]}
        data-ids="ids-text-box-label"
        htmlFor={inputId}
      >
        {label}
        {required ? (
          <span
            className={styles["ids-text-box-required-mark"]}
            data-ids="ids-text-box-required-mark"
            aria-hidden="true"
          >
            *
          </span>
        ) : null}
      </label>
      {fieldGroup}
    </div>
  );
}

IdsTextBox.displayName = "IdsTextBox";

export default IdsTextBox;
