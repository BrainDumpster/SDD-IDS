import React, { useState, useRef, useEffect } from "react";
import "./Slider.css";

export interface SliderProps {
  mode?: "single" | "range";
  min: number;
  max: number;
  step?: number;
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  disabled?: boolean;
  showStepper?: boolean;
  showTicks?: boolean;
  stepperFrequency?: number;
  showValueLabel?: boolean;
  showValueInput?: boolean;
  minLabel?: string;
  maxLabel?: string;
  onValueChange?: (value: number | [number, number]) => void;
  onValueCommit?: (value: number | [number, number]) => void;
}

const Slider: React.FC<SliderProps> = ({
  mode = "single",
  min,
  max,
  step = 1,
  value: controlledValue,
  defaultValue,
  disabled = false,
  showStepper = false,
  showTicks = false,
  stepperFrequency,
  showValueLabel = true,
  showValueInput = false,
  minLabel,
  maxLabel,
  onValueChange,
  onValueCommit,
}) => {
  const [internalValue, setInternalValue] = useState<number | [number, number]>(
    mode === "single" ? defaultValue ?? min : (defaultValue ?? [min, min])
  );
  const [isDragging, setIsDragging] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const effectiveStep = stepperFrequency ?? step;
  const showTicksProp = showStepper || showTicks;

  const normalizeValue = (val: number): number => {
    const stepped = Math.round((val - min) / effectiveStep) * effectiveStep + min;
    return Math.max(min, Math.min(max, stepped));
  };

  const getSingleValue = (): number => {
    return Array.isArray(value) ? value[0] : value;
  };

  const getRangeValues = (): [number, number] => {
    return Array.isArray(value) ? value : [value, value];
  };

  const handleRailClick = (e: React.MouseEvent) => {
    if (disabled || !railRef.current) return;
    
    const rect = railRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newValue = normalizeValue(min + percent * (max - min));

    if (mode === "single") {
      if (!isControlled) setInternalValue(newValue);
      onValueChange?.(newValue);
      onValueCommit?.(newValue);
    } else {
      const [minVal, maxVal] = getRangeValues();
      const midPoint = (minVal + maxVal) / 2;
      const newRange: [number, number] = newValue <= midPoint ? [newValue, maxVal] : [minVal, newValue];
      if (!isControlled) setInternalValue(newRange);
      onValueChange?.(newRange);
      onValueCommit?.(newRange);
    }
  };

  const handleThumbDrag = (thumbIndex: 0 | 1, e: React.MouseEvent) => {
    if (disabled || !railRef.current) return;

    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const rect = railRef.current!.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
      const newValue = normalizeValue(min + percent * (max - min));

      if (mode === "single") {
        if (!isControlled) setInternalValue(newValue);
        onValueChange?.(newValue);
      } else {
        const rangeValues = getRangeValues();
        const newRange: [number, number] = thumbIndex === 0
          ? [Math.min(newValue, rangeValues[1]), rangeValues[1]]
          : [rangeValues[0], Math.max(newValue, rangeValues[0])];
        if (!isControlled) setInternalValue(newRange);
        onValueChange?.(newRange);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      onValueCommit?.(value);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleInputChange = (thumbIndex: 0 | 1, e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value);
    if (isNaN(numValue)) return;

    const newValue = normalizeValue(numValue);

    if (mode === "single") {
      if (!isControlled) setInternalValue(newValue);
      onValueChange?.(newValue);
    } else {
      const rangeValues = getRangeValues();
      const newRange: [number, number] = thumbIndex === 0
        ? [Math.min(newValue, rangeValues[1]), rangeValues[1]]
        : [rangeValues[0], Math.max(newValue, rangeValues[0])];
      if (!isControlled) setInternalValue(newRange);
      onValueChange?.(newRange);
    }
  };

  const renderTicks = () => {
    if (!showTicksProp) return null;

    const tickCount = Math.floor((max - min) / effectiveStep) + 1;
    const ticks = Array.from({ length: tickCount }, (_, i) => min + i * effectiveStep);

    return (
      <div className="slider__ticks">
        {ticks.map((tick) => {
          const isSelected = mode === "single"
            ? tick <= getSingleValue()
            : tick >= getRangeValues()[0] && tick <= getRangeValues()[1];
          return (
            <div
              key={tick}
              className={`slider__tick ${isSelected ? "slider__tick--selected" : ""}`}
              style={{ left: `${((tick - min) / (max - min)) * 100}%` }}
            />
          );
        })}
      </div>
    );
  };

  const renderProgress = () => {
    if (mode === "single") {
      const val = getSingleValue();
      const percent = ((val - min) / (max - min)) * 100;
      return <div className="slider__progress" style={{ width: `${percent}%` }} />;
    } else {
      const [minVal, maxVal] = getRangeValues();
      const minPercent = ((minVal - min) / (max - min)) * 100;
      const maxPercent = ((maxVal - min) / (max - min)) * 100;
      return (
        <div
          className="slider__range"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
      );
    }
  };

  const renderThumb = (thumbIndex: 0 | 1, val: number) => {
    const percent = ((val - min) / (max - min)) * 100;
    return (
      <div
        key={thumbIndex}
        className={`slider__thumb ${disabled ? "slider__thumb--disabled" : ""}`}
        style={{ left: `${percent}%` }}
        onMouseDown={(e) => handleThumbDrag(thumbIndex, e)}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={val}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        {showValueLabel && <span className="slider__value-label">{val}</span>}
      </div>
    );
  };

  const renderValueInput = (thumbIndex: 0 | 1, val: number) => {
    if (!showValueInput) return null;
    return (
      <input
        type="number"
        className="slider__value-input"
        value={val}
        min={min}
        max={max}
        step={effectiveStep}
        disabled={disabled}
        onChange={(e) => handleInputChange(thumbIndex, e)}
      />
    );
  };

  const singleValue = getSingleValue();
  const [rangeMin, rangeMax] = getRangeValues();

  return (
    <div className={`slider slider--${mode} ${disabled ? "slider--disabled" : ""}`}>
      {(minLabel || maxLabel) && (
        <div className="slider__labels">
          {minLabel && (
            <span
              className={`slider__label slider__label--min ${singleValue === min ? "slider__label--active" : ""}`}
            >
              {minLabel}
            </span>
          )}
          {maxLabel && (
            <span
              className={`slider__label slider__label--max ${singleValue === max ? "slider__label--active" : ""}`}
            >
              {maxLabel}
            </span>
          )}
        </div>
      )}
      <div className="slider__rail-container">
        <div
          ref={railRef}
          className="slider__rail"
          onClick={handleRailClick}
        >
          {renderProgress()}
          {renderTicks()}
          {mode === "single"
            ? renderThumb(0, singleValue)
            : (
              <>
                {renderThumb(0, rangeMin)}
                {renderThumb(1, rangeMax)}
              </>
            )}
        </div>
      </div>
      {showValueInput && (
        <div className="slider__inputs">
          {mode === "single" ? (
            renderValueInput(0, singleValue)
          ) : (
            <>
              {renderValueInput(0, rangeMin)}
              <span className="slider__input-separator">-</span>
              {renderValueInput(1, rangeMax)}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Slider;
