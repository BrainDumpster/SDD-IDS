import React from "react";
import "./Link.css";

export interface LinkProps {
  type?: "standalone" | "inline" | "dark-bg";
  label: string;
  href?: string;
  showExternalLinkIcon?: boolean;
  target?: "_self" | "_blank" | "_parent" | "_top";
  rel?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const Link: React.FC<LinkProps> = ({
  type = "standalone",
  label,
  href,
  showExternalLinkIcon = false,
  target = "_self",
  rel,
  disabled = false,
  onClick,
}) => {
  const isButton = !href;
  const relValue = target === "_blank" ? rel || "noopener noreferrer" : rel;

  if (isButton) {
    return (
      <button
        type="button"
        className={`link link--${type}`}
        disabled={disabled}
        onClick={onClick}
      >
        <span className="link__label">{label}</span>
        {showExternalLinkIcon && (
          <svg
            className="link__external-icon"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7H13"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <path
              d="M10 4L13 7L10 10"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 7V11C13 12.1046 12.1046 13 11 13H5C3.89543 13 3 12.1046 3 11V7"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    );
  }

  return (
    <a
      href={href}
      className={`link link--${type}`}
      target={target}
      rel={relValue}
      onClick={onClick}
    >
      <span className="link__label">{label}</span>
      {showExternalLinkIcon && (
        <svg
          className="link__external-icon"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 7H13"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <path
            d="M10 4L13 7L10 10"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 7V11C13 12.1046 12.1046 13 11 13H5C3.89543 13 3 12.1046 3 11V7"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </svg>
      )}
    </a>
  );
};

export default Link;
