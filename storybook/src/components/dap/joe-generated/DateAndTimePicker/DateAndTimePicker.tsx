import React, { useState, useEffect, useRef } from "react";
import "./DateAndTimePicker.css";

export interface DateAndTimePickerProps {
  variant?: "date" | "time" | "datetime" | "daterange";
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  showClearButton?: boolean;
  placeholder?: string;
}

const DateAndTimePicker: React.FC<DateAndTimePickerProps> = ({
  variant = "datetime",
  value,
  onChange,
  disabled = false,
  error = false,
  showClearButton = true,
  placeholder = "Select date and time",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");
  const isSyncingRef = useRef(false);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleClear = () => {
    if (!disabled && onChange) {
      onChange("");
    }
  };

  const handleTodayNow = () => {
    if (!disabled && onChange) {
      if (variant === "time") {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 || 12;
        const minutesStr = minutes.toString().padStart(2, "0");
        const timeStr = `${hours12}:${minutesStr} ${ampm}`;
        setHour(hours12.toString());
        setMinute(minutesStr);
        setAmpm(ampm);
        onChange(timeStr);
      } else {
        const today = new Date().toISOString().split('T')[0];
        onChange(today);
      }
    }
  };

  const handleTimeChange = () => {
    if (onChange) {
      const timeStr = `${hour}:${minute} ${ampm}`;
      if (variant === "datetime" && value) {
        // Preserve the date portion if it exists
        const dateMatch = value.match(/^(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          onChange(`${dateMatch[1]} ${timeStr}`);
        } else {
          onChange(timeStr);
        }
      } else {
        onChange(timeStr);
      }
    }
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/\D/.test(value)) {
      return; // Do nothing if contains non-digits
    }
    // Limit to 2 digits
    const trimmed = value.slice(0, 2);
    // Validate hour range (1-12 for 12h format)
    if (trimmed) {
      const num = parseInt(trimmed, 10);
      if (num >= 1 && num <= 12) {
        setHour(trimmed);
      }
    } else {
      setHour('');
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/\D/.test(value)) {
      return; // Do nothing if contains non-digits
    }
    // Limit to 2 digits
    const trimmed = value.slice(0, 2);
    // Validate minute range (00-59)
    if (trimmed) {
      const num = parseInt(trimmed, 10);
      if (num <= 59) {
        setMinute(trimmed);
      }
    } else {
      setMinute('');
    }
  };

  const handleMinuteBlur = () => {
    // Prepend 0 if single digit on blur
    if (minute.length === 1) {
      setMinute('0' + minute);
    }
  };

  const handleAmpmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAmpm(e.target.value);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (value && (variant === "time" || variant === "datetime")) {
      isSyncingRef.current = true;
      const timeMatch = value.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        setHour(timeMatch[1]);
        setMinute(timeMatch[2]);
        setAmpm(timeMatch[3].toUpperCase());
      }
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 0);
    }
  }, [value, variant]);

  useEffect(() => {
    if (onChange && (variant === "time" || variant === "datetime") && !isSyncingRef.current) {
      const timeStr = `${hour}:${minute} ${ampm}`;
      if (variant === "datetime" && value) {
        const dateMatch = value.match(/^(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          onChange(`${dateMatch[1]} ${timeStr}`);
        } else {
          onChange(timeStr);
        }
      } else {
        onChange(timeStr);
      }
    }
  }, [hour, minute, ampm, variant, value, onChange]);

  const renderIcon = () => {
    if (variant === "time") {
      return (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth={1.5} />
          <path d="M8 4V8L11 11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (variant === "datetime") {
      return (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="2" width="11" height="10" rx="1" stroke="currentColor" strokeWidth={1.5} />
          <path d="M4 1V2M9 1V2" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          <path d="M1 5H12" stroke="currentColor" strokeWidth={1.5} />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1.5} />
          <path d="M12 10.5V12L13 13" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return (
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth={1.5} />
        <path d="M5 1V3M11 1V3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <path d="M2 6H14" stroke="currentColor" strokeWidth={1.5} />
      </svg>
    );
  };

  return (
    <div className={`date-time-picker date-time-picker--${variant} ${error ? "date-time-picker--error" : ""}`}>
      <div className="date-time-picker__input-wrapper">
        <input
          type="text"
          className="date-time-picker__input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          onFocus={() => setIsOpen(true)}
        />
        <button
          className="date-time-picker__icon-button"
          onClick={handleToggle}
          disabled={disabled}
          type="button"
          aria-label={variant === "time" ? "Open time picker" : "Open calendar"}
        >
          {renderIcon()}
        </button>
        {showClearButton && value && !disabled && (
          <button
            className="date-time-picker__clear-button"
            onClick={handleClear}
            type="button"
            aria-label="Clear"
          >
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && !disabled && (
        <div className="date-time-picker__popup">
          {variant !== "time" && (
            <div className="date-time-picker__header">
              <button className="date-time-picker__nav-button" type="button">
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L6 8L10 13" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="date-time-picker__month-year">June 2026</div>
              <button className="date-time-picker__nav-button" type="button">
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 3L10 8L6 13" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          {variant !== "time" && (
            <div className="date-time-picker__calendar-grid">
              <div className="date-time-picker__weekdays">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>
              <div className="date-time-picker__dates">
                {Array.from({ length: 30 }, (_, i) => (
                  <button
                    key={i}
                    className={`date-time-picker__date ${i === 1 ? "date-time-picker__date--selected" : ""} ${i === 2 ? "date-time-picker__date--today" : ""}`}
                    type="button"
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {variant === "datetime" || variant === "time" ? (
            <div className="date-time-picker__time-section">
              <div className="date-time-picker__time-inputs">
                <input type="text" className="date-time-picker__time-input" placeholder="12" value={hour} onChange={handleHourChange} />
                <span className="date-time-picker__time-separator">:</span>
                <input type="text" className="date-time-picker__time-input" placeholder="00" value={minute} onChange={handleMinuteChange} onBlur={handleMinuteBlur} />
                <select className="date-time-picker__ampm" value={ampm} onChange={handleAmpmChange}>
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>
          ) : null}

          <button className="date-time-picker__today-button" type="button" onClick={handleTodayNow}>
            {variant === "time" ? "Now" : "Today"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DateAndTimePicker;
