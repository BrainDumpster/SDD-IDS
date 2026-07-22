import React from "react";
import "./ToggleSwitch.css";

export interface ToggleSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
  name?: string;
  value?: string;
  ariaLabel?: string;
  ariaDescribedby?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  label,
  id,
  name,
  value,
  ariaLabel,
  ariaDescribedby,
}) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
  };

  const uniqueId = id || `toggle-switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        id={uniqueId}
        className="toggle-switch__input"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        name={name}
        value={value}
        aria-label={ariaLabel || label}
        aria-describedby={ariaDescribedby}
      />
      <label htmlFor={uniqueId} className="toggle-switch__label">
        <span className="toggle-switch__switch">
          <span className="toggle-switch__track" />
          <span className="toggle-switch__thumb" />
        </span>
        {label && <span className="toggle-switch__label-text">{label}</span>}
      </label>
    </div>
  );
};

export default ToggleSwitch;
