import React from "react";
import "./SkeletonLoader.css";

export interface SkeletonLoaderProps {
  variant?: "text" | "avatar" | "image" | "card" | "button" | "list" | "table" | "form";
  width?: string | number;
  height?: string | number;
  lines?: number;
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = "text",
  width,
  height,
  lines = 1,
  count = 1,
  className = "",
}) => {
  const renderSkeleton = (index: number) => {
    const baseClassName = `skeleton skeleton--${variant} ${className}`;
    const style: React.CSSProperties = {};

    if (width) {
      style.width = typeof width === "number" ? `${width}px` : width;
    }
    if (height) {
      style.height = typeof height === "number" ? `${height}px` : height;
    }

    switch (variant) {
      case "text":
        return (
          <div key={index} className={baseClassName} style={style}>
            {Array.from({ length: lines }).map((_, lineIndex) => (
              <div key={lineIndex} className="skeleton__line" />
            ))}
          </div>
        );

      case "avatar":
        return (
          <div key={index} className={baseClassName} style={{ ...style, width: width || "40px", height: height || "40px" }} />
        );

      case "image":
        return (
          <div key={index} className={baseClassName} style={{ ...style, width: width || "100%", height: height || "120px" }} />
        );

      case "button":
        return (
          <div key={index} className={baseClassName} style={{ ...style, width: width || "80px", height: height || "32px" }} />
        );

      case "card":
        return (
          <div key={index} className={baseClassName} style={style}>
            <div className="skeleton__card-header" />
            <div className="skeleton__card-body">
              <div className="skeleton__line" />
              <div className="skeleton__line" />
              <div className="skeleton__line" style={{ width: "60%" }} />
            </div>
          </div>
        );

      case "list":
        return (
          <div key={index} className={baseClassName} style={style}>
            {Array.from({ length: count }).map((_, itemIndex) => (
              <div key={itemIndex} className="skeleton__list-item">
                <div className="skeleton__list-avatar" />
                <div className="skeleton__list-content">
                  <div className="skeleton__line" />
                  <div className="skeleton__line" style={{ width: "70%" }} />
                </div>
              </div>
            ))}
          </div>
        );

      case "table":
        return (
          <div key={index} className={baseClassName} style={style}>
            <div className="skeleton__table-header">
              <div className="skeleton__line" />
              <div className="skeleton__line" />
              <div className="skeleton__line" />
              <div className="skeleton__line" />
            </div>
            <div className="skeleton__table-body">
              {Array.from({ length: count }).map((_, rowIndex) => (
                <div key={rowIndex} className="skeleton__table-row">
                  <div className="skeleton__line" />
                  <div className="skeleton__line" />
                  <div className="skeleton__line" />
                  <div className="skeleton__line" />
                </div>
              ))}
            </div>
          </div>
        );

      case "form":
        return (
          <div key={index} className={baseClassName} style={style}>
            <div className="skeleton__form-field">
              <div className="skeleton__line skeleton__line--label" />
              <div className="skeleton__line skeleton__line--input" />
            </div>
            <div className="skeleton__form-field">
              <div className="skeleton__line skeleton__line--label" />
              <div className="skeleton__line skeleton__line--input" />
            </div>
            <div className="skeleton__form-field">
              <div className="skeleton__line skeleton__line--label" />
              <div className="skeleton__line skeleton__line--input" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="skeleton-wrapper">{renderSkeleton(0)}</div>;
};

export default SkeletonLoader;
