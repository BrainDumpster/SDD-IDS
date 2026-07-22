import React from "react";
import "./ProgressBar.css";

export interface ProgressBarProps {
  value?: number;
  label?: string;
  helperText?: string;
  showHelperText?: boolean;
  type?: "inline" | "with-label" | "indeterminate";
  thickness?: "thin" | "medium" | "thick";
  state?: "in-progress" | "completed-success" | "completed-warning" | "failed-error";
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  label,
  helperText,
  showHelperText = false,
  type = "inline",
  thickness = "medium",
  state = "in-progress",
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const isIndeterminate = type === "indeterminate";
  const displayValue = isIndeterminate ? null : clampedValue;
  const isFull = displayValue === 100;

  const getIconSlug = () => {
    switch (state) {
      case "completed-success":
        return "status-ok-circ-solid";
      case "completed-warning":
        return "status-warn-tri-solid";
      case "failed-error":
        return "status-critical-square-solid";
      default:
        return null;
    }
  };

  const iconSlug = getIconSlug();
  const showIcon = showHelperText && helperText && iconSlug && state !== "in-progress";

  return (
    <div className={`progress-bar progress-bar--${type} progress-bar--${thickness} progress-bar--${state}`}>
      {type === "with-label" && label && (
        <div className="progress-bar__meta-row">
          <span className="progress-bar__label">{label}</span>
          {!isIndeterminate && (
            <span className="progress-bar__percentage">{clampedValue}%</span>
          )}
        </div>
      )}

      <div className="progress-bar__track-row">
        <div className="progress-bar__track">
          <div
            className="progress-bar__indicator"
            style={{
              width: isIndeterminate ? undefined : `${clampedValue}%`,
            }}
            data-value-full={isFull}
          />
        </div>

        {type === "inline" && !isIndeterminate && (
          <span className="progress-bar__inline-percentage">{clampedValue}%</span>
        )}
      </div>

      {showHelperText && helperText && (
        <div className="progress-bar__helper-row">
          {showIcon && (
            <svg
              className="progress-bar__helper-icon"
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {iconSlug === "status-ok-circ-solid" && (
                <circle cx="8" cy="8" r="8" fill="currentColor" />
              )}
              {iconSlug === "status-warn-tri-solid" && (
                <path d="M8 1L1 14H15L8 1Z" fill="currentColor" />
              )}
              {iconSlug === "status-critical-square-solid" && (
                <rect width="16" height="16" rx="2" fill="currentColor" />
              )}
            </svg>
          )}
          <span className="progress-bar__helper-text">{helperText}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
