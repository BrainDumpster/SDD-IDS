import React, { useState } from "react";
import "./Login.css";

export interface LoginProps {
  onSubmit?: (credentials: { username: string; password: string }) => void;
  onForgotPassword?: () => void;
  showSocialLogin?: boolean;
  showRegistration?: boolean;
  variant?: "default" | "with-social" | "with-registration" | "minimal" | "branded";
}

const Login: React.FC<LoginProps> = ({
  onSubmit,
  onForgotPassword,
  showSocialLogin = false,
  showRegistration = false,
  variant = "default",
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    onSubmit?.({ username, password });
  };

  return (
    <div className="login__container">
        <div className="login__logo-section">
          <svg width={64} height={64} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="var(--color-icon-brand-base, #0076ce)" />
            <path d="M32 20V32M32 44" stroke="white" strokeWidth={4} strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="login__title">Sign In</h1>

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__form-group">
            <label htmlFor="username" className="login__label">
              Username or Email
            </label>
            <input
              id="username"
              type="text"
              className="login__input"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="login__form-group">
            <label htmlFor="password" className="login__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="login__input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login__form-options">
            <label className="login__checkbox">
              <input type="checkbox" className="login__checkbox-input" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="login__forgot-password"
              onClick={onForgotPassword}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="login__submit-button">
            Sign In
          </button>

          {showRegistration && (
            <p className="login__registration">
              Don't have an account?{" "}
              <button type="button" className="login__register-link">
                Create account
              </button>
            </p>
          )}

          {showSocialLogin && (
            <div className="login__social-login">
              <div className="login__divider">
                <span>or continue with</span>
              </div>
              <div className="login__social-buttons">
                <button type="button" className="login__social-button login__social-button--google">
                  Google
                </button>
                <button type="button" className="login__social-button login__social-button--microsoft">
                  Microsoft
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="login__message login__message--error">
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="8" fill="var(--color-icon-alerting-critical, #af0000)" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="login__message login__message--success">
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="8" fill="var(--color-icon-alerting-success, #1b8500)" />
              </svg>
              {success}
            </div>
          )}
        </form>
      </div>
  );
};

export default Login;
