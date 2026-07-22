import React, { useState, useRef, useEffect } from "react";
import "./TimePicker.css";

export interface TimePickerProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  size?: "large" | "small";
  placeholder?: string;
  label?: string;
  formatHint?: string;
  clockType?: "12h" | "24h";
  showSeconds?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  size = "large",
  placeholder = "HH:MM AM/PM",
  label,
  formatHint = "HH:MM AM/PM",
  clockType = "12h",
  showSeconds = false,
  disabled = false,
  error = false,
  errorMessage,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || "");
  const [mouseActivated, setMouseActivated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const displayValue = (value !== undefined ? value : internalValue) || "";

  const togglePopup = () => {
    if (disabled) return;
    const newState = !isOpen;
    if (!isControlled) {
      setInternalOpen(newState);
    }
    onOpenChange?.(newState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleInputFocus = () => {
    if (mouseActivated) {
      setMouseActivated(false);
    }
  };

  const handleMouseDown = () => {
    setMouseActivated(true);
  };

  const handleMouseUp = () => {
    setMouseActivated(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      if (isOpen) {
        if (!isControlled) {
          setInternalOpen(false);
        }
        onOpenChange?.(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (!isControlled) {
          setInternalOpen(false);
        }
        onOpenChange?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isControlled, onOpenChange]);

  const renderClockIcon = () => (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth={1.5} />
      <path d="M8 4V8L11 11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const renderErrorIcon = () => (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="16" height="16" rx="2" fill="currentColor" />
      <path d="M8 4V9M8 12H8.01" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );

  const renderTimeColumn = (title: string, values: string[]) => (
    <div className="time-picker__column">
      <button className="time-picker__increment" type="button" disabled={disabled}>
        <svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 1L9 9H1L5 1Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="time-picker__value-list">
        {values.map((v) => (
          <div key={v} className="time-picker__value-cell">{v}</div>
        ))}
      </div>
      <button className="time-picker__decrement" type="button" disabled={disabled}>
        <svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 9L1 1H9L5 9Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );

  const getColumns = () => {
    const hours = clockType === "12h" 
      ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
      : ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
    const seconds = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
    const periods = ["AM", "PM"];

    const columns = [
      { title: "Hour", values: hours },
      { title: "Minute", values: minutes },
    ];

    if (showSeconds) {
      columns.push({ title: "Second", values: seconds });
    }

    if (clockType === "12h") {
      columns.push({ title: "Period", values: periods });
    }

    return columns;
  };

  return (
    <div className="time-picker" ref={containerRef}>
      {label && <label className="time-picker__label">{label}</label>}
      <div className="time-picker__field-group">
        <div
          className={`time-picker__field-container time-picker__field-container--${size} ${disabled ? "time-picker__field-container--disabled" : ""} ${error ? "time-picker__field-container--error" : ""} ${isOpen ? "time-picker__field-container--open" : ""} ${mouseActivated ? "time-picker__field-container--mouse-activated" : ""}`}
        >
          <input
            ref={inputRef}
            type="text"
            className="time-picker__input"
            value={displayValue}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
          <button
            className="time-picker__clock-icon"
            onClick={togglePopup}
            type="button"
            disabled={disabled}
            aria-label="Open time picker"
            aria-expanded={isOpen}
          >
            {renderClockIcon()}
          </button>
        </div>
        <span className="time-picker__format-hint">{formatHint}</span>
        {error && errorMessage && (
          <div className="time-picker__validation-error">
            {renderErrorIcon()}
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="time-picker__popup" role="dialog" aria-modal="true" aria-label="Choose time">
          <div className="time-picker__columns">
            {getColumns().map((col) => renderTimeColumn(col.title, col.values))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
