import React, { useState, useRef } from "react";
import "./Tooltip.css";

export interface TooltipProps {
  content: React.ReactNode;
  title?: string;
  closable?: boolean;
  showArrow?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  arrowAlign?: "start" | "center" | "end";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: (reason: "close-click" | "escape" | "programmatic") => void;
  children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  title,
  closable = false,
  showArrow = true,
  side = "top",
  arrowAlign = "center",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onClose,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [isHovering, setIsHovering] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpen = () => {
    if (controlledOpen === undefined) {
      setInternalOpen(true);
    }
    onOpenChange?.(true);
  };

  const handleClose = (reason: "close-click" | "escape" | "programmatic") => {
    if (controlledOpen === undefined) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
    onClose?.(reason);
  };

  const handleTriggerEnter = () => {
    if (!closable) {
      handleOpen();
    }
    setIsHovering(true);
  };

  const handleTriggerLeave = () => {
    if (!closable) {
      handleClose("programmatic");
    }
    setIsHovering(false);
  };

  const handleTooltipEnter = () => {
    setIsHovering(true);
  };

  const handleTooltipLeave = () => {
    if (!closable) {
      handleClose("programmatic");
    }
    setIsHovering(false);
  };

  const renderArrow = () => {
    if (!showArrow) return null;

    const arrowClass = `tooltip__arrow tooltip__arrow--${side} tooltip__arrow--${arrowAlign}`;

    return <div className={arrowClass} />;
  };

  const renderCloseIcon = () => (
    <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: handleTriggerEnter,
        onMouseLeave: handleTriggerLeave,
        onFocus: handleOpen,
        onBlur: () => {
          if (!closable) {
            handleClose("programmatic");
          }
        },
        "aria-describedby": isOpen ? "tooltip-content" : undefined,
      })}

      {isOpen && (
        <div
          ref={tooltipRef}
          className={`tooltip tooltip--${side}`}
          onMouseEnter={ handleTooltipEnter }
          onMouseLeave={ handleTooltipLeave }
          role="tooltip"
          id="tooltip-content"
        >
          {renderArrow()}
          <div className="tooltip__panel">
            {title && (
              <div className="tooltip__header">
                <span className="tooltip__title">{title}</span>
                {closable && (
                  <button
                    type="button"
                    className="tooltip__close"
                    onClick={() => handleClose("close-click")}
                    aria-label="Close tooltip"
                  >
                    {renderCloseIcon()}
                  </button>
                )}
              </div>
            )}
            {!title && closable && (
              <button
                type="button"
                className="tooltip__close tooltip__close--standalone"
                onClick={() => handleClose("close-click")}
                aria-label="Close tooltip"
              >
                {renderCloseIcon()}
              </button>
            )}
            <div className="tooltip__body">{content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
