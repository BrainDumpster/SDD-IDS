import React, { useState, useCallback } from "react";
import "./Accordion.css";

export interface AccordionItemInput {
  value: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  meta?: React.ReactNode;
  formSlot?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemInput[];
  multiple?: boolean;
  defaultValue?: string[];
  chevronPosition?: "left" | "right";
  variant?: "default" | "form";
  onValueChange?: (openValues: string[]) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  multiple = false,
  defaultValue = [],
  chevronPosition = "left",
  variant = "default",
  onValueChange,
}) => {
  const [openValues, setOpenValues] = useState<string[]>(defaultValue);

  const toggleItem = useCallback(
    (value: string) => {
      setOpenValues((prev) => {
        let newValues: string[];
        if (multiple) {
          if (prev.includes(value)) {
            newValues = prev.filter((v) => v !== value);
          } else {
            newValues = [...prev, value];
          }
        } else {
          if (prev.includes(value)) {
            newValues = [];
          } else {
            newValues = [value];
          }
        }
        onValueChange?.(newValues);
        return newValues;
      });
    },
    [multiple, onValueChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, value: string, index: number) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          toggleItem(value);
          break;
        case "ArrowUp":
          e.preventDefault();
          // Focus previous trigger
          const prevIndex = index > 0 ? index - 1 : items.length - 1;
          const prevTrigger = document.getElementById(`accordion-trigger-${items[prevIndex].value}`);
          prevTrigger?.focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          // Focus next trigger
          const nextIndex = index < items.length - 1 ? index + 1 : 0;
          const nextTrigger = document.getElementById(`accordion-trigger-${items[nextIndex].value}`);
          nextTrigger?.focus();
          break;
        case "Home":
          e.preventDefault();
          // Focus first trigger
          const firstTrigger = document.getElementById(`accordion-trigger-${items[0].value}`);
          firstTrigger?.focus();
          break;
        case "End":
          e.preventDefault();
          // Focus last trigger
          const lastTrigger = document.getElementById(`accordion-trigger-${items[items.length - 1].value}`);
          lastTrigger?.focus();
          break;
      }
    },
    [items, toggleItem]
  );

  return (
    <div className={`accordion accordion--${variant}`} role="presentation">
      {items.map((item, index) => {
        const isOpen = openValues.includes(item.value);
        return (
          <div
            key={item.value}
            className={`accordion__item ${isOpen ? "accordion__item--expanded" : ""} ${item.disabled ? "accordion__item--disabled" : ""}`}
          >
            <button
              id={`accordion-trigger-${item.value}`}
              className="accordion__header"
              type="button"
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.value}`}
              disabled={item.disabled}
              onClick={() => !item.disabled && toggleItem(item.value)}
              onKeyDown={(e) => !item.disabled && handleKeyDown(e, item.value, index)}
            >
              {chevronPosition === "left" && (
                <span className={`accordion__chevron accordion__chevron--left ${isOpen ? "accordion__chevron--expanded" : ""}`} aria-hidden="true">
                  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              <span className="accordion__title">{item.title}</span>
              {chevronPosition === "right" && (
                <span className={`accordion__chevron accordion__chevron--right ${isOpen ? "accordion__chevron--expanded" : ""}`} aria-hidden="true">
                  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
            {isOpen && (
              <div
                id={`accordion-panel-${item.value}`}
                className="accordion__body"
                role="region"
                aria-labelledby={`accordion-trigger-${item.value}`}
              >
                <div className="accordion__content">
                  {item.content}
                </div>
                {item.meta && <div className="accordion__meta">{item.meta}</div>}
                {item.formSlot && <div className="accordion__form-slot">{item.formSlot}</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
