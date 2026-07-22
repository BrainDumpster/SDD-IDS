import React, {
  forwardRef,
  createContext,
  useContext,
  useId,
  useCallback,
  InputHTMLAttributes,
} from "react";
import "./RadioButton.css";

/* ---- Radio Group context ----------------------------------- */
interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/* ---- RadioGroup ---------------------------------------- */
export interface RadioGroupProps {
  /** Shared form name for the radio group */
  name: string;
  /** Currently selected value */
  value?: string;
  /** Called when the selection changes */
  onChange?: (value: string) => void;
  /** Disable all radios in the group */
  disabled?: boolean;
  /** Accessible label for the group */
  "aria-label"?: string;
  /** ID of an element labelling this group */
  "aria-labelledby"?: string;
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  disabled,
  children,
  className,
  ...rest
}: RadioGroupProps) {
  const handleChange = useCallback(
    (v: string) => onChange?.(v),
    [onChange]
  );

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange: handleChange, disabled }}>
      <div
        role="radiogroup"
        className={["radio-group", className].filter(Boolean).join(" ")}
        {...rest}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

/* ---- RadioButton --------------------------------------- */
export interface RadioButtonProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  /** Value for this radio option */
  value: string;
  /** Visible label text */
  label?: string;
  /** Override change handler (uses group context by default) */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Optional validation styling mode */
  error?: boolean;
  /** Secondary descriptive text */
  helperText?: string;
}

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ value, label, disabled: disabledProp, error = false, helperText, className, id, onChange, ...rest }, ref) => {
    const group = useContext(RadioGroupContext);
    const autoId = useId();
    const inputId = id || autoId;
    const labelId = `${inputId}-label`;
    const helperTextId = `${inputId}-helper`;
    const isDisabled = disabledProp ?? group?.disabled ?? false;
    const isChecked = group ? group.value === value : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      } else if (group) {
        group.onChange(value);
      }
    };

    return (
      <div
        className={[
          "radio",
          isDisabled && "radio--disabled",
          error && "radio--error",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <label className="radio__wrapper" htmlFor={inputId}>
          <input
            ref={ref}
            id={inputId}
            type="radio"
            role="radio"
            className="radio__input"
            name={group?.name}
            value={value}
            checked={isChecked}
            disabled={isDisabled}
            aria-checked={isChecked}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={helperText ? helperTextId : undefined}
            onChange={handleChange}
            {...rest}
          />
          <span className="radio__control-outer" aria-hidden="true">
            <span className="radio__control-inner-dot" />
          </span>
          {label && (
            <span id={labelId} className="radio__label">
              {label}
            </span>
          )}
        </label>
        {helperText && (
          <div id={helperTextId} className="radio__helper-text">
            {error && <span className="radio__error-icon" aria-hidden="true" />}
            <span>{helperText}</span>
          </div>
        )}
      </div>
    );
  }
);

RadioButton.displayName = "RadioButton";
export { RadioButton };
export default RadioButton;
