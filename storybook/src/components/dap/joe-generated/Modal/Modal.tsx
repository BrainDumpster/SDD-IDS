import React from "react";
import "./Modal.css";

export interface ModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  scenario?: "single-page" | "multi-page" | "dialog";
  type?: "non-alerting" | "informational" | "warning" | "major" | "critical" | "destructive";
  title: string;
  description?: string;
  closable?: boolean;
  size?: "x-small" | "small" | "medium" | "large";
  children?: React.ReactNode;
  primaryActionLabel: string;
  tertiaryActionLabel?: string;
  enablePrimaryAction?: boolean;
  enableTertiaryAction?: boolean;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onTertiaryAction?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  open = false,
  onOpenChange,
  scenario = "single-page",
  type = "non-alerting",
  title,
  description,
  closable = true,
  size = "medium",
  children,
  primaryActionLabel,
  tertiaryActionLabel,
  enablePrimaryAction = true,
  enableTertiaryAction = true,
  onClose,
  onPrimaryAction,
  onTertiaryAction,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(open);
  const isOpen = open !== undefined ? open : internalOpen;

  const handleClose = () => {
    if (open === undefined) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
    onClose?.();
  };

  const handlePrimaryAction = () => {
    onPrimaryAction?.();
  };

  const handleTertiaryAction = () => {
    onTertiaryAction?.();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closable) {
      handleClose();
    }
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && closable) {
      handleClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, closable]);

  if (!isOpen) return null;

  const getSeverityIcon = () => {
    switch (type) {
      case "critical":
      case "destructive":
        return (
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="2" fill="currentColor" />
          </svg>
        );
      case "warning":
        return (
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H22L12 2Z" fill="currentColor" />
          </svg>
        );
      case "major":
        return (
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="2" transform="rotate(45 12 12)" fill="currentColor" />
          </svg>
        );
      case "informational":
        return (
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
        );
      default:
        return null;
    }
  };

  const showSeverityIcon = type !== "non-alerting" && scenario === "dialog";

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal modal--${size} modal--${scenario} modal--${type}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div className="modal-header-content">
            {showSeverityIcon && <div className="modal-severity-icon">{getSeverityIcon()}</div>}
            <h2 id="modal-title" className="modal-title">{title}</h2>
          </div>
          {closable && (
            <button className="modal-close-button" onClick={handleClose} type="button" aria-label="Close">
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {description && <p className="modal-description">{description}</p>}

        {children && <div className="modal-content">{children}</div>}

        <div className="modal-footer">
          {tertiaryActionLabel && enableTertiaryAction && (
            <button className="modal-button modal-button--tertiary" onClick={handleTertiaryAction} type="button">
              {tertiaryActionLabel}
            </button>
          )}
          <button
            className={`modal-button modal-button--primary ${type === "destructive" ? "modal-button--destructive" : ""}`}
            onClick={handlePrimaryAction}
            disabled={!enablePrimaryAction}
            type="button"
          >
            {primaryActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
