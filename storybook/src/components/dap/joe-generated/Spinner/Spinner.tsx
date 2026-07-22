import React from "react";
import "./Spinner.css";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  mode?: "inline" | "overlay";
  label?: string;
  labelVisibility?: "sr-only" | "visible-below" | "visible-inline";
  ariaLive?: "polite" | "assertive" | "off";
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  mode = "inline",
  label = "Loading...",
  labelVisibility = "sr-only",
  ariaLive = "polite",
}) => {
  const getDimensions = () => {
    switch (size) {
      case "sm":
        return { outer: 20, inner: 10 };
      case "md":
        return { outer: 40, inner: 30 };
      case "lg":
        return { outer: 72, inner: 62 };
    }
  };

  const { outer, inner } = getDimensions();

  const renderLabel = () => {
    if (labelVisibility === "sr-only") {
      return <span className="spinner__label sr-only">{label}</span>;
    }
    return <span className="spinner__label">{label}</span>;
  };

  return (
    <div
      className={`spinner spinner--${size} spinner--${mode} spinner--label-${labelVisibility}`}
      role="status"
      aria-live={ariaLive}
      aria-label={label}
    >
      {mode === "overlay" && <div className="spinner__backdrop" />}
      <div className="spinner__root">
        <div
          className="spinner__visual"
          style={{
            width: `${outer}px`,
            height: `${outer}px`,
          }}
        >
          <div
            className="spinner__track"
            style={{
              width: `${outer}px`,
              height: `${outer}px`,
            }}
          />
          <div
            className="spinner__arc"
            style={{
              width: `${inner}px`,
              height: `${inner}px`,
            }}
          />
        </div>
        {labelVisibility !== "sr-only" && renderLabel()}
      </div>
    </div>
  );
};

export default Spinner;
