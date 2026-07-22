import React from "react";
import "./Footer.css";

export interface FooterProps {
  hostname?: string;
  swid?: string;
  currentDateTime?: string;
  timeZoneLabel?: string;
  showHostname?: boolean;
  showCurrentDateAndTime?: boolean;
  showTimeZone?: boolean;
  copyDisabled?: boolean;
  timeZoneDisabled?: boolean;
  onCopySwid?: (swid: string) => void;
  onTimeZoneClick?: () => void;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({
  hostname,
  swid,
  currentDateTime,
  timeZoneLabel,
  showHostname = true,
  showCurrentDateAndTime = true,
  showTimeZone = true,
  copyDisabled = false,
  timeZoneDisabled = false,
  onCopySwid,
  onTimeZoneClick,
  className = "",
}) => {
  const handleCopy = () => {
    if (!copyDisabled && swid && onCopySwid) {
      navigator.clipboard.writeText(swid);
      onCopySwid(swid);
    }
  };

  return (
    <footer className={`footer ${className}`} aria-label="Application status">
      <div className="footer__left-region">
        {showHostname && hostname && (
          <div className="footer__hostname">
            <span className="footer__label">Host Name:</span>
            <span className="footer__value">{hostname}</span>
          </div>
        )}
        {showHostname && swid && hostname && <div className="footer__separator" />}
        {swid && (
          <div className="footer__swid-group">
            <span className="footer__label">SWID:</span>
            <span className="footer__value">{swid}</span>
            <button
              className="footer__copy-control"
              onClick={handleCopy}
              disabled={copyDisabled}
              type="button"
              aria-label="Copy SWID"
              aria-disabled={copyDisabled}
            >
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth={1.5} />
                <path d="M5 5V9C5 10.1046 5.89543 11 7 11H11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {showCurrentDateAndTime && (
        <div className="footer__time-group">
          <svg
            className="footer__time-icon"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth={1.5} />
            <path d="M8 5V8L10 10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
          <span className="footer__datetime-label">{currentDateTime}</span>
        </div>
      )}

      {showTimeZone && (
        <div className="footer__timezone-group">
          <svg
            className="footer__timezone-icon"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth={1.5} />
            <path d="M8 1V3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            <path d="M8 13V15" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            <path d="M15 8H13" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            <path d="M3 8H1" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            <path d="M12.95 12.95L11.536 11.536" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            <path d="M4.464 4.464L3.05 3.05" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            <path d="M12.95 3.05L11.536 4.464" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            <path d="M4.464 11.536L3.05 12.95" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
          <button
            className="footer__timezone-action"
            onClick={onTimeZoneClick}
            disabled={timeZoneDisabled}
            type="button"
          >
            {timeZoneLabel || "Time zone"}
          </button>
        </div>
      )}
    </footer>
  );
};

export default Footer;
