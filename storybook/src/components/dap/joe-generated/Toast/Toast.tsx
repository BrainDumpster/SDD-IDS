import React, { useEffect, useState } from "react";
import "./Toast.css";

export interface ToastLink {
  label: string;
  href?: string;
  routerLink?: string | string[];
  target?: "_self" | "_blank" | "_parent" | "_top";
  onClick?: (event: React.MouseEvent) => void;
}

export interface ToastProps {
  type?: "info" | "critical" | "major-warning" | "minor-warning" | "success";
  message: string;
  duration?: number;
  closable?: boolean;
  link?: ToastLink;
  onClose?: (reason: "close-click" | "timeout" | "programmatic") => void;
  onTimeout?: () => void;
  id?: string;
}

const Toast: React.FC<ToastProps> = ({
  type = "info",
  message,
  duration = 8000,
  closable = true,
  link,
  onClose,
  onTimeout,
  id,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setInterval(() => {
      if (!isPaused) {
        setTimeLeft((prev) => {
          if (prev <= 100) {
            clearInterval(timer);
            handleClose("timeout");
            return 0;
          }
          return prev - 100;
        });
      }
    }, 100);

    return () => clearInterval(timer);
  }, [duration, isPaused]);

  const handleClose = (reason: "close-click" | "timeout" | "programmatic") => {
    setIsVisible(false);
    onClose?.(reason);
    if (reason === "timeout") {
      onTimeout?.();
    }
  };

  const getStatusIcon = () => {
    const icons: Record<string, JSX.Element> = {
      info: (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth={1.5} />
          <circle cx="8" cy="5" r="1.5" fill="currentColor" />
          <path d="M8 8V12" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      ),
      critical: (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="16" height="16" rx="2" fill="currentColor" />
          <path d="M8 4V9M8 12H8.01" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      ),
      "major-warning": (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1L1 14H15L8 1Z" stroke="currentColor" strokeWidth={1.5} />
          <path d="M8 5V9M8 12H8.01" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      ),
      "minor-warning": (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1L1 14H15L8 1Z" stroke="currentColor" strokeWidth={1.5} />
          <circle cx="8" cy="11" r="1" fill="currentColor" />
        </svg>
      ),
      success: (
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth={1.5} />
          <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
    return icons[type] || icons.info;
  };

  const renderLink = () => {
    if (!link) return null;

    if (link.routerLink) {
      return (
        <button type="button" className="toast__link" onClick={link.onClick}>
          {link.label}
        </button>
      );
    }

    if (link.href) {
      return (
        <a href={link.href} target={link.target} className="toast__link" onClick={link.onClick}>
          {link.label}
        </a>
      );
    }

    return (
      <button type="button" className="toast__link" onClick={link.onClick}>
        {link.label}
      </button>
    );
  };

  const renderCloseButton = () => {
    if (!closable) return null;

    return (
      <button
        type="button"
        className="toast__close"
        onClick={() => handleClose("close-click")}
        aria-label="Dismiss notification"
      >
        <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      </button>
    );
  };

  if (!isVisible) return null;

  return (
    <div
      className={`toast toast--${type}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="status"
      aria-live="polite"
    >
      <div className="toast__content">
        <div className="toast__status-icon">{getStatusIcon()}</div>
        <span className="toast__message">{message}</span>
      </div>
      <div className="toast__actions">
        {renderLink()}
        {renderCloseButton()}
      </div>
    </div>
  );
};

export default Toast;
