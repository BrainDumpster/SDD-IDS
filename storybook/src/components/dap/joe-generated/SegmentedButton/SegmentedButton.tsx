import React from "react";
import "./SegmentedButton.css";

export interface SegmentedButtonSegmentBase {
  value: string;
  disabled?: boolean;
}

export interface SegmentedButtonSegmentText extends SegmentedButtonSegmentBase {
  label: string;
}

export interface SegmentedButtonSegmentIcon extends SegmentedButtonSegmentBase {
  icon: string | React.ReactNode;
  ariaLabel: string;
}

export type SegmentedButtonSegment = SegmentedButtonSegmentText | SegmentedButtonSegmentIcon;

export interface SegmentedButtonProps {
  type: "text" | "icon";
  items: SegmentedButtonSegment[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, meta: { type: "text"; label: string } | { type: "icon"; ariaLabel: string }) => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  iconsBasePath?: string;
}

const SegmentedButton: React.FC<SegmentedButtonProps> = ({
  type,
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  ariaLabel,
  ariaLabelledby,
  iconsBasePath = "assets/icons",
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : internalValue;

  const handleSegmentClick = (segment: SegmentedButtonSegment) => {
    if (disabled || segment.disabled) return;

    const newValue = segment.value;
    const meta = type === "text"
      ? { type: "text" as const, label: (segment as SegmentedButtonSegmentText).label }
      : { type: "icon" as const, ariaLabel: (segment as SegmentedButtonSegmentIcon).ariaLabel };

    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue, meta);
  };

  const handleKeyDown = (e: React.KeyboardEvent, segment: SegmentedButtonSegment) => {
    if (disabled || segment.disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSegmentClick(segment);
    }
  };

  const renderIcon = (icon: string | React.ReactNode) => {
    if (typeof icon === "string") {
      return <img src={`${iconsBasePath}/${icon}.svg`} alt="" width={16} height={16} />;
    }
    return icon;
  };

  const renderSegment = (segment: SegmentedButtonSegment, index: number) => {
    const isSelected = segment.value === selectedValue;
    const isText = type === "text";

    return (
      <button
        key={segment.value}
        className={`segmented-button__segment ${isSelected ? "segmented-button__segment--selected" : ""} ${segment.disabled || disabled ? "segmented-button__segment--disabled" : ""}`}
        onClick={() => handleSegmentClick(segment)}
        onKeyDown={(e) => handleKeyDown(e, segment)}
        disabled={segment.disabled || disabled}
        type="button"
        aria-pressed={isSelected}
        aria-label={isText ? (segment as SegmentedButtonSegmentText).label : (segment as SegmentedButtonSegmentIcon).ariaLabel}
      >
        {isText ? (
          <span className="segmented-button__label">{(segment as SegmentedButtonSegmentText).label}</span>
        ) : (
          <div className="segmented-button__icon">
            {renderIcon((segment as SegmentedButtonSegmentIcon).icon)}
          </div>
        )}
      </button>
    );
  };

  return (
    <div
      className={`segmented-button segmented-button--${type}`}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      {items.map((segment, index) => renderSegment(segment, index))}
    </div>
  );
};

export default SegmentedButton;
