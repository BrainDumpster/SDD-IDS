import type { ChangeEvent } from "react";
import { useId } from "react";
import styles from "./TextInput.module.css";
import mailIcon from "../../../assets/icons/mail.svg";
import errorIcon from "../../../assets/icons/status-critical-square-solid.svg";

type TextInputType = "text-input" | "text-area";
type TextInputSize = "large" | "small";
type TextInputState =
  | "default"
  | "hover"
  | "selected"
  | "focus"
  | "disabled"
  | "error";

interface TextInputProps {
  componentType?: TextInputType;
  size?: TextInputSize;
  state?: TextInputState;
  label?: string;
  showLabel?: boolean;
  required?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  invalid?: boolean;
  helperText?: string;
  showHelperText?: boolean;
  errorText?: string;
  showIcon?: boolean;
  iconName?: string;
  id?: string;
  name?: string;
  rows?: number;
  inputType?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  onValueChange?: (value: string) => void;
}

export function TextInput({
  componentType = "text-input",
  size = "large",
  state = "default",
  label,
  showLabel = false,
  required = false,
  placeholder,
  value,
  defaultValue,
  disabled = false,
  invalid = false,
  helperText,
  showHelperText = true,
  errorText,
  showIcon = false,
  iconName = "mail",
  id,
  name,
  rows = 4,
  inputType = "text",
  ariaLabel,
  ariaDescribedBy,
  onValueChange,
}: TextInputProps) {
  const generatedId = useId();
  const helperId = `${id ?? generatedId}-help`;
  const computedInvalid = invalid || Boolean(errorText);
  const visualState: TextInputState = disabled
    ? "disabled"
    : computedInvalid
      ? "error"
      : state;
  const suffixIcon = iconName === "mail" ? mailIcon : mailIcon;
  const shouldRenderHelper =
    showHelperText && (Boolean(helperText) || Boolean(errorText));

  const commonProps = {
    id,
    name,
    placeholder,
    disabled,
    value,
    defaultValue,
    "aria-label": ariaLabel,
    "aria-invalid": computedInvalid ? "true" : "false",
    "aria-describedby": shouldRenderHelper
      ? ariaDescribedBy ?? helperId
      : ariaDescribedBy,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onValueChange?.(event.target.value),
  };

  return (
    <div className={styles.root}>
      <div className={styles.field}>
        {showLabel && label ? (
          <label className={styles.label} htmlFor={id}>
            {label}
            {required ? <span className={styles.required}>*</span> : null}
          </label>
        ) : null}

        <div
          className={[
            styles.control,
            styles[size],
            componentType === "text-area" ? styles.textAreaControl : "",
          ]
            .filter(Boolean)
            .join(" ")}
          data-state={visualState}
        >
          {componentType === "text-area" ? (
            <textarea
              className={styles.value}
              rows={rows}
              {...commonProps}
            />
          ) : (
            <input
              className={styles.value}
              type={inputType}
              {...commonProps}
            />
          )}
          {showIcon && !computedInvalid ? (
            <img src={suffixIcon} alt="" aria-hidden="true" className={styles.suffixIcon} />
          ) : null}
        </div>

        {shouldRenderHelper ? (
          <div className={styles.helperRow} id={helperId}>
            {computedInvalid && errorText ? (
              <img src={errorIcon} alt="" aria-hidden="true" className={styles.errorIcon} />
            ) : null}
            <p className={computedInvalid && errorText ? styles.errorText : styles.helperText}>
              {computedInvalid && errorText ? errorText : helperText}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
