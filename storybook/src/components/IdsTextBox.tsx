import type { ChangeEvent } from "react";
import { useId, useState } from "react";
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

export interface IdsTextBoxProps {
  componentType?: IdsTextBoxType;
  size?: IdsTextBoxSize;
  state?: IdsTextBoxState;
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
  id,
  name,
  rows = 4,
  inputType = "text",
  ariaLabel,
  ariaDescribedBy,
  onValueChange,
}: IdsTextBoxProps) {
  const [focusModality, setFocusModality] = useState<"keyboard" | "pointer">("pointer");
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-help`;
  const computedInvalid = invalid || state === "error";
  const visualState: IdsTextBoxState = disabled
    ? "disabled"
    : computedInvalid
      ? "error"
      : state;
  const shouldRenderHelper = showHelperText && (computedInvalid || Boolean(helperText));
  const helperCopy = computedInvalid ? errorText : helperText;
  const suffixIconUrl = showIcon ? resolveIconUrl(iconName) : undefined;
  const errorIconUrl = resolveIconUrl("status-critical-square-solid");

  const commonProps = {
    id: inputId,
    name,
    placeholder,
    disabled,
    value,
    defaultValue,
    "aria-label": ariaLabel,
    "aria-invalid": computedInvalid ? "true" : "false",
    "aria-describedby": shouldRenderHelper ? ariaDescribedBy ?? helperId : ariaDescribedBy,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onValueChange?.(event.target.value);
    },
  };

  return (
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
            onKeyDownCapture={(event) => handleKeyboardModality(event, setFocusModality)}
            {...commonProps}
          />
        ) : (
          <input
            className={styles.value}
            type={inputType}
            onKeyDownCapture={(event) => handleKeyboardModality(event, setFocusModality)}
            {...commonProps}
          />
        )}
        {suffixIconUrl ? <img src={suffixIconUrl} alt="" aria-hidden="true" className={styles.suffixIcon} /> : null}
      </div>

      {shouldRenderHelper ? (
        <div className={styles.helperRow} id={helperId}>
          {computedInvalid && errorIconUrl ? (
            <img src={errorIconUrl} alt="" aria-hidden="true" className={styles.errorIcon} />
          ) : null}
          <p className={computedInvalid ? styles.errorText : styles.helperText}>{helperCopy}</p>
        </div>
      ) : null}
    </div>
  );
}
