import React from "react";
import "./TextArea.css";

export interface TextAreaProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  rows?: number;
  cols?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
  invalid?: boolean;
  errorText?: string;
  helperText?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  name,
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  readOnly = false,
  maxLength,
  rows = 4,
  cols,
  resize = "vertical",
  invalid = false,
  errorText,
  helperText,
  label,
  onChange,
  onBlur,
  onFocus,
}) => {
  const textAreaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="text-area">
      {label && (
        <label htmlFor={textAreaId} className="text-area__label">
          {label}
          {required && <span className="text-area__required">*</span>}
        </label>
      )}
      <div className="text-area__wrapper">
        <textarea
          id={textAreaId}
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          maxLength={maxLength}
          rows={rows}
          cols={cols}
          className={`text-area__input ${invalid ? "text-area__input--invalid" : ""} ${disabled ? "text-area__input--disabled" : ""}`}
          style={{ resize }}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </div>
      {helperText && !errorText && (
        <div className="text-area__helper-text">{helperText}</div>
      )}
      {errorText && (
        <div className="text-area__error-text">{errorText}</div>
      )}
      {maxLength && (
        <div className="text-area__character-count">
          {(value || defaultValue || "").length} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default TextArea;
