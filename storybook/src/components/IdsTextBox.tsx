import type { ChangeEvent } from "react";
import { useId, useState } from "react";
import { IdsTooltip } from "./IdsTooltip";
import styles from "./IdsTextBox.module.css";

const iconUrlBySlug: Record<string, string> = (() => {
  const modules = import.meta.glob<string>("../../../assets/icons/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
  });
  const out: Record<string, string> = {};
  for (const path of Object.keys(modules)) {
    const file = path.replace(/^.*\/([^/]+)\.svg$/, "$1");
    if (file && modules[path] != null) out[file] = modules[path] as string;
  }
  return out;
})();

function resolveIconUrl(shapeName: string): string | undefined {
  if (!/^[a-z0-9-]+$/.test(shapeName)) return undefined;
  return iconUrlBySlug[shapeName];
}

function handleKeyboardModality(event: { key: string }, setFocusModality: (mode: "keyboard") => void) {
  if (event.key === "Tab") {
    setFocusModality("keyboard");
  }
}

export type IdsTextBoxType = "text-input" | "text-area";
export type IdsTextBoxSize = "large" | "small";
export type IdsTextBoxState =
  | "default"
  | "hover"
  | "selected"
  | "focus"
  | "disabled"
  | "error";

export type IdsTextBoxLabelPosition = "left" | "top";

export interface IdsTextBoxProps {
  componentType?: IdsTextBoxType;
  size?: IdsTextBoxSize;
  state?: IdsTextBoxState;
  label?: string;
  showLabel?: boolean;
  labelPosition?: IdsTextBoxLabelPosition;
  required?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  invalid?: boolean;
  helperText?: string;
  errorText?: string;
  showHelperText?: boolean;
  showIcon?: boolean;
  iconName?: string;
  showInfoIcon?: boolean;
  infoTooltip?: string;
  id?: string;
  name?: string;
  rows?: number;
  inputType?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  onValueChange?: (value: string) => void;
}

export function IdsTextBox({
  componentType = "text-input",
  size = "large",
  state = "default",
  label,
  showLabel = true,
  labelPosition = "left",
  required = false,
  placeholder = "Placeholder Text",
  value,
  defaultValue,
  disabled = false,
  invalid = false,
  helperText = "Helper text",
  errorText = "Error message",
  showHelperText = true,
  showIcon = true,
  iconName = "mail",
  showInfoIcon = false,
  infoTooltip,
  id,
  name,
  rows = 4,
  inputType = "text",
  ariaLabel,
  ariaDescribedBy,
  onValueChange,
}: IdsTextBoxProps) {
  const [focusModality, setFocusModality] = useState<"keyboard" | "pointer">("pointer");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const computedInvalid = invalid || state === "error";
  const visualState: IdsTextBoxState = disabled
    ? "disabled"
    : computedInvalid
      ? "error"
      : state;
  const shouldRenderLabel = showLabel && Boolean(label);
  const hasHelperText = showHelperText && Boolean(helperText);
  const hasErrorText = computedInvalid && Boolean(errorText);
  const shouldRenderHelperRow = hasHelperText || hasErrorText;
  const suffixIconUrl = showIcon && inputType !== "password" ? resolveIconUrl(iconName) : undefined;
  const errorIconUrl = resolveIconUrl("status-critical-square-solid");
  const infoIconUrl = resolveIconUrl("info-circ-solid");
  const eyeViewUrl = resolveIconUrl("eye-view");
  const eyeHideUrl = resolveIconUrl("eye-view-hide");
  const isPassword = inputType === "password";
  const resolvedInputType = isPassword && passwordVisible ? "text" : inputType;
  const describedBy =
    [ariaDescribedBy, hasHelperText ? helperId : undefined, hasErrorText ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  const commonProps = {
    id: inputId,
    name,
    placeholder,
    disabled,
    value,
    defaultValue,
    "aria-label": ariaLabel,
    "aria-invalid": computedInvalid || undefined,
    "aria-required": required || undefined,
    "aria-describedby": describedBy,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onValueChange?.(event.target.value);
    },
  };

  const fieldGroup = (
    <div className={styles.root}>
      <div
        className={[
          styles.control,
          componentType === "text-area" ? styles.textArea : styles[size],
        ].join(" ")}
        data-state={visualState}
        data-focus-modality={focusModality}
        onPointerDownCapture={() => setFocusModality("pointer")}
      >
        {componentType === "text-area" ? (
          <textarea
            className={styles.value}
            rows={rows}
            cols={1}
            onKeyDownCapture={(event) => handleKeyboardModality(event, setFocusModality)}
            {...commonProps}
          />
        ) : (
          <input
            className={styles.value}
            type={resolvedInputType}
            onKeyDownCapture={(event) => handleKeyboardModality(event, setFocusModality)}
            {...commonProps}
          />
        )}
        {isPassword && eyeViewUrl && eyeHideUrl ? (
          <button
            type="button"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            className={styles.passwordToggle}
            onClick={() => setPasswordVisible((v) => !v)}
            tabIndex={-1}
          >
            <span
              className={styles.suffixIcon}
              style={{
                maskImage: `url(${passwordVisible ? eyeHideUrl : eyeViewUrl})`,
                WebkitMaskImage: `url(${passwordVisible ? eyeHideUrl : eyeViewUrl})`,
              }}
            />
          </button>
        ) : suffixIconUrl ? (
          <span
            aria-hidden="true"
            className={styles.suffixIcon}
            style={{ maskImage: `url(${suffixIconUrl})`, WebkitMaskImage: `url(${suffixIconUrl})` }}
          />
        ) : null}
      </div>

      {shouldRenderHelperRow ? (
        <div className={styles.helperColumn}>
          {hasHelperText ? (
            <div className={styles.helperRow} id={helperId}>
              <p className={styles.helperText}>{helperText}</p>
            </div>
          ) : null}
          {hasErrorText ? (
            <div className={styles.helperRow} id={errorId}>
              {errorIconUrl ? (
                <img src={errorIconUrl} alt="" aria-hidden="true" className={styles.errorIcon} />
              ) : null}
              <p className={styles.errorText}>{errorText}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  if (!shouldRenderLabel) {
    return fieldGroup;
  }

  const labelEl = (
    <label className={styles.label} data-size={size} htmlFor={inputId}>
      <span className={styles.labelTextGroup}>
        {label}
        {required ? (
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        ) : null}
      </span>
      {showInfoIcon && infoIconUrl ? (
        <IdsTooltip content={infoTooltip ?? ""} side="top" arrowAlign="start" hugContent tabIndex={0}>
          <img
            src={infoIconUrl}
            alt="More information"
            className={styles.infoIcon}
          />
        </IdsTooltip>
      ) : null}
    </label>
  );

  return (
    <div className={labelPosition === "top" ? styles.fieldTop : styles.field}>
      {labelEl}
      {fieldGroup}
    </div>
  );
}
