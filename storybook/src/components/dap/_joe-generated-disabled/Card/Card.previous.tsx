import React from "react";
import "./Card.css";

export interface CardProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  media?: React.ReactNode;
  variant?: "default" | "interactive" | "selected" | "disabled" | "elevated" | "bordered" | "compact";
  onClick?: () => void;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  header,
  children,
  footer,
  media,
  variant = "default",
  onClick,
  disabled = false,
}) => {
  const isInteractive = variant === "interactive" || !!onClick;
  const isDisabled = variant === "disabled" || disabled;

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  const Component = isInteractive ? "button" : "article";

  return (
    <Component
      className={`card card--${variant} ${isDisabled ? "card--disabled" : ""}`}
      onClick={handleClick}
      disabled={isDisabled}
      type={isInteractive ? "button" : undefined}
    >
      {media && <div className="card__media">{media}</div>}
      {header && <div className="card__header">{header}</div>}
      {children && <div className="card__content">{children}</div>}
      {footer && <div className="card__footer">{footer}</div>}
    </Component>
  );
};

export default Card;
