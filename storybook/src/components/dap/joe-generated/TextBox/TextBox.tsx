import React from "react";
import "./TextBox.css";

export interface TextBoxProps {
  componentType?: "text-input" | "text-area";
  size?: "large" | "small";
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  helperText?: string;
  errorText?: string;
  showHelperText?: boolean;
  showIcon?: boolean;
  iconName?: string;
  rows?: number;
  inputType?: string;
  id?: string;
  name?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  onValueChange?: (value: string) => void;
}

const TextBox: React.FC<TextBoxProps> = ({
  componentType = "text-input",
  size = "large",
  value: controlledValue,
  defaultValue,
  placeholder,
  disabled = false,
  invalid = false,
  helperText,
  errorText,
  showHelperText = true,
  showIcon = true,
  iconName = "mail",
  rows = 4,
  inputType = "text",
  id,
  name,
  ariaLabel,
  ariaDescribedBy,
  onValueChange,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const [isFocused, setIsFocused] = React.useState(false);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const hasError = invalid || !!errorText;
  const displayHelperText = hasError ? errorText : helperText;
  const shouldShowHelper = showHelperText && displayHelperText;

  const renderSuffixIcon = () => {
    if (!showIcon || componentType === "text-area") return null;
    return (
      <div className="text-box__suffix-icon">
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth={1.5} />
          <path d="M4 6H12" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      </div>
    );
  };

  const renderErrorIcon = () => {
    if (!hasError || !shouldShowHelper) return null;
    return (
      <svg className="text-box__error-icon" width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="16" height="16" rx="2" fill="currentColor" />
        <path d="M8 4V9M8 12H8.01" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    );
  };

  const helperId = `${id || name}-helper`;
  const describedBy = [ariaDescribedBy, shouldShowHelper ? helperId : null].filter(Boolean).join(" ");

  return (
    <div className="text-box">
      <div
        className={`text-box__control text-box__control--${componentType} text-box__control--${size} ${disabled ? "text-box__control--disabled" : ""} ${hasError ? "text-box__control--error" : ""} ${isFocused ? "text-box__control--focused" : ""}`}
      >
        {componentType === "text-input" ? (
          <input
            type={inputType}
            className="text-box__input"
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            id={id}
            name={name}
            aria-label={ariaLabel}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : (
          <textarea
            className="text-box__textarea"
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            id={id}
            name={name}
            aria-label={ariaLabel}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )}
        {renderSuffixIcon()}
      </div>
      {shouldShowHelper && (
        <div className={`text-box__helper-row ${hasError ? "text-box__helper-row--error" : ""}`} id={helperId}>
          {renderErrorIcon()}
          <span className="text-box__helper-text">{displayHelperText}</span>
        </div>
      )}
    </div>
  );
};

export default TextBox;
