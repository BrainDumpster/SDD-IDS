import React from "react";
import "./SplashScreen.css";

export interface SplashScreenProps {
  appName: string;
  logo?: React.ReactNode;
  version?: string;
  loadingText?: string;
  progress?: number;
  showProgress?: boolean;
  showSkip?: boolean;
  onSkip?: () => void;
  variant?: "default" | "dark" | "minimal" | "with-animation";
  fixed?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  appName,
  logo,
  version,
  loadingText = "Loading...",
  progress,
  showProgress = false,
  showSkip = false,
  onSkip,
  variant = "default",
  fixed = true,
}) => {
  return (
    <div className={`splash-screen splash-screen--${variant} ${fixed ? "splash-screen--fixed" : ""}`}>
      <div className="splash-screen__content">
        {logo && <div className="splash-screen__logo">{logo}</div>}
        {!logo && (
          <div className="splash-screen__logo">
            <svg width={120} height={120} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="60" fill="var(--color-text-white, #ffffff)" />
              <circle cx="60" cy="60" r="50" stroke="var(--color-background-brand-base, #0076ce)" strokeWidth={8} />
              <path d="M60 30V60L80 80" stroke="var(--color-background-brand-base, #0076ce)" strokeWidth={8} strokeLinecap="round" />
            </svg>
          </div>
        )}
        
        <h1 className="splash-screen__app-name">{appName}</h1>
        
        <div className="splash-screen__loading">
          <div className="splash-screen__spinner">
            <div className="splash-screen__spinner-ring" />
          </div>
          <span className="splash-screen__loading-text">{loadingText}</span>
        </div>

        {showProgress && progress !== undefined && (
          <div className="splash-screen__progress">
            <div className="splash-screen__progress-bar">
              <div
                className="splash-screen__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="splash-screen__progress-text">{progress}%</span>
          </div>
        )}

        {version && <p className="splash-screen__version">Version {version}</p>}

        {showSkip && (
          <button
            className="splash-screen__skip-button"
            onClick={onSkip}
            type="button"
          >
            Skip to content
          </button>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
