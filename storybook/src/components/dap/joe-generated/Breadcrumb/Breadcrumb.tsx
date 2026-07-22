import React from "react";
import "./Breadcrumb.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  disabled?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: "default" | "compact";
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, variant = "default" }) => {
  const breadcrumbItems = items.slice(0, -1);
  const lastItem = items[items.length - 1];

  return (
    <nav className={`breadcrumb breadcrumb--${variant}`} aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="breadcrumb__item">
            <a
              href={item.href}
              className={`breadcrumb__link ${item.disabled ? "breadcrumb__link--disabled" : ""}`}
              aria-disabled={item.disabled}
            >
              {item.label}
            </a>
            <span className="breadcrumb__separator" aria-hidden="true">
              /
            </span>
          </li>
        ))}
      </ol>
      {lastItem && (
        <div className="breadcrumb__title">
          {lastItem.label}
        </div>
      )}
    </nav>
  );
};

export default Breadcrumb;
