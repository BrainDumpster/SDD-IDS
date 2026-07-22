import React, { forwardRef, InputHTMLAttributes, useId } from "react";
import "./Checkbox.css";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Visible label text */
  label?: string;
  /** Indeterminate (mixed) state */
  indeterminate?: boolean;
  /** Optional validation styling mode */
  error?: boolean;
  /** Secondary descriptive text */
  helperText?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, indeterminate = false, disabled = false, error = false, helperText, className, id, ...rest },
    ref
  ) => {
    const autoId = useId();
    const inputId = id || autoId;
    const labelId = `${inputId}-label`;
    const helperTextId = `${inputId}-helper`;

    const internalRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      const el = internalRef.current;
      if (el) el.indeterminate = indeterminate;
    }, [indeterminate]);

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref]
    );

    return (
      <div
        className={[
          "checkbox",
          disabled && "checkbox--disabled",
          error && "checkbox--error",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <label className="checkbox__wrapper" htmlFor={inputId}>
          <input
            ref={setRefs}
            id={inputId}
            type="checkbox"
            role="checkbox"
            className="checkbox__input"
            disabled={disabled}
            aria-checked={indeterminate ? "mixed" : undefined}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={helperText ? helperTextId : undefined}
            {...rest}
          />
          <span className="checkbox__control-box" aria-hidden="true">
            <span className={["checkbox__indicator", indeterminate ? "checkbox__indicator--indeterminate" : "checkbox__indicator--checked"].filter(Boolean).join(" ")} />
          </span>
          {label && (
            <span id={labelId} className="checkbox__label">
              {label}
            </span>
          )}
        </label>
        {helperText && (
          <div id={helperTextId} className="checkbox__helper-text">
            {error && <span className="checkbox__error-icon" aria-hidden="true" />}
            <span>{helperText}</span>
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
