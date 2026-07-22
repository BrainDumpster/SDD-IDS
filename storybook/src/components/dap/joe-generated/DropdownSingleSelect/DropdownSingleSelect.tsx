import React, { useState, useRef, useEffect } from "react";
import "./DropdownSingleSelect.css";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownSingleSelectProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
}

const DropdownSingleSelect: React.FC<DropdownSingleSelectProps> = ({
  options,
  value,
  placeholder = "Select...",
  label,
  helperText,
  error,
  disabled = false,
  required = false,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | undefined>(
    options.find((opt) => opt.value === value)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setSelectedOption(options.find((opt) => opt.value === value));
  }, [value, options]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: DropdownOption) => {
    if (!option.disabled) {
      setSelectedOption(option);
      onChange?.(option.value);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`dropdown-single-select ${error ? "dropdown-single-select--error" : ""}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label className="dropdown-single-select__label">
          {label}
          {required && <span className="dropdown-single-select__required">*</span>}
        </label>
      )}

      <div
        className={`dropdown-single-select__trigger ${isOpen ? "dropdown-single-select__trigger--open" : ""}`}
        onClick={handleToggle}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        <span className="dropdown-single-select__value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`dropdown-single-select__chevron ${isOpen ? "dropdown-single-select__chevron--open" : ""}`}
          width={10}
          height={10}
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {isOpen && (
        <ul className="dropdown-single-select__list" role="listbox">
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`dropdown-single-select__option ${
                option.disabled ? "dropdown-single-select__option--disabled" : ""
              } ${selectedOption?.value === option.value ? "dropdown-single-select__option--selected" : ""}`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={selectedOption?.value === option.value}
              aria-disabled={option.disabled}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {(helperText || error) && (
        <p className={`dropdown-single-select__helper ${error ? "dropdown-single-select__helper--error" : ""}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default DropdownSingleSelect;
