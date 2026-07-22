import React from "react";
import "./Badge.css";

export interface BadgeProps {
  value: string | number;
  type?: "default" | "critical" | "warning" | "disabled" | "success";
  as?: string;
  ariaLabel?: string;
}

const Badge: React.FC<BadgeProps> = ({
  value,
  type = "default",
  as = "span",
  ariaLabel,
}) => {
  const Component = as as keyof JSX.IntrinsicElements;
  
  return (
    <Component
      className={`badge badge--${type}`}
      aria-label={ariaLabel}
    >
      {value}
    </Component>
  );
};

export default Badge;
