import React from "react";
import "./DetailPanel.css";

export interface DetailsPanelProps {
  attachMode: "datagrid" | "page";
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  body: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  ariaLabelExpand?: string;
  ariaLabelCollapse?: string;
  collapsedWidth?: number;
  expandedWidth?: number;
  id?: string;
  className?: string;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  attachMode,
  isExpanded,
  onExpandedChange,
  body,
  title = "Details",
  showHeader = true,
  showFooter = true,
  ariaLabelExpand = "Expand details panel",
  ariaLabelCollapse = "Collapse details panel",
  collapsedWidth = 40,
  expandedWidth = 398,
  id,
  className,
}) => {
  const handleToggle = () => {
    onExpandedChange(!isExpanded);
  };

  const renderCloseIcon = () => (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <aside
      id={id}
      className={`detail-panel detail-panel--${attachMode} ${isExpanded ? "detail-panel--expanded" : "detail-panel--collapsed"} ${className || ""}`}
      role="complementary"
      aria-label={title}
      style={{
        width: isExpanded ? `${expandedWidth}px` : `${collapsedWidth}px`,
      }}
    >
      {isExpanded ? (
        <>
          {attachMode === "datagrid" && showHeader && (
            <div className="detail-panel__header">
              <span className="detail-panel__title">{title}</span>
              <button
                type="button"
                className="detail-panel__toggle"
                onClick={handleToggle}
                aria-expanded={isExpanded}
                aria-controls={id ? `${id}-body` : undefined}
                aria-label={ariaLabelCollapse}
              >
                {renderCloseIcon()}
              </button>
            </div>
          )}
          <div id={id ? `${id}-body` : undefined} className="detail-panel__body">
            {body}
          </div>
          {attachMode === "page" && showFooter && (
            <div className="detail-panel__footer">
              <button
                type="button"
                className="detail-panel__toggle"
                onClick={handleToggle}
                aria-expanded={isExpanded}
                aria-label={ariaLabelCollapse}
              >
                {renderCloseIcon()}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="detail-panel__collapsed-rail">
          <button
            type="button"
            className="detail-panel__toggle detail-panel__toggle--collapsed"
            onClick={handleToggle}
            aria-expanded={isExpanded}
            aria-label={ariaLabelExpand}
          >
            {renderCloseIcon()}
          </button>
        </div>
      )}
    </aside>
  );
};

export default DetailsPanel;
