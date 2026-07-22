import React, { useState, useRef, useEffect } from "react";
import "./DropdownComboBox.css";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownComboBoxProps {
  options: DropdownOption[];
  value?: string;
  inputValue?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  allowCustomInput?: boolean;
  onChange?: (value: string) => void;
  onInputChange?: (input: string) => void;
}

const DropdownComboBox: React.FC<DropdownComboBoxProps> = ({
  options,
  value,
  inputValue: propInputValue,
  placeholder = "Search or type...",
  label,
  helperText,
  error,
  disabled = false,
  required = false,
  allowCustomInput = false,
  onChange,
  onInputChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(propInputValue || "");
  const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>(options);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    if (propInputValue !== undefined) {
      setInputValue(propInputValue);
    }
  }, [propInputValue]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange?.(newValue);

    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleSelect = (option: DropdownOption) => {
    if (!option.disabled) {
      setInputValue(option.label);
      onChange?.(option.value);
      onInputChange?.(option.label);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setInputValue("");
    onInputChange?.("");
    onChange?.("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
          handleSelect(filteredOptions[selectedIndex]);
        } else if (allowCustomInput && inputValue) {
          setIsOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
          handleSelect(filteredOptions[selectedIndex]);
        }
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      className={`dropdown-combobox ${error ? "dropdown-combobox--error" : ""}`}
      ref={containerRef}
    >
      {label && (
        <label className="dropdown-combobox__label">
          {label}
          {required && <span className="dropdown-combobox__required">*</span>}
        </label>
      )}

      <div className="dropdown-combobox__input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="dropdown-combobox__input"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          autoComplete="off"
        />

        {inputValue && (
          <button
            className="dropdown-combobox__clear-button"
            onClick={handleClear}
            type="button"
            aria-label="Clear"
          >
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </button>
        )}

        <button
          className={`dropdown-combobox__toggle-button ${isOpen ? "dropdown-combobox__toggle-button--open" : ""}`}
          onClick={handleToggle}
          type="button"
          aria-label="Toggle dropdown"
          aria-expanded={isOpen}
        >
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <ul className="dropdown-combobox__list">
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              className={`dropdown-combobox__option ${
                option.disabled ? "dropdown-combobox__option--disabled" : ""
              } ${index === selectedIndex ? "dropdown-combobox__option--selected" : ""}`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {isOpen && filteredOptions.length === 0 && inputValue && !allowCustomInput && (
        <div className="dropdown-combobox__no-results">
          No results found
        </div>
      )}

      {(helperText || error) && (
        <p className={`dropdown-combobox__helper ${error ? "dropdown-combobox__helper--error" : ""}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default DropdownComboBox;
