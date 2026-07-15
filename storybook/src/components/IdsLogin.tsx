import { FormEvent, useId, useState } from "react";
import { Checkbox } from "./Checkbox";
import { IdsButton } from "./IdsButton";
import { IdsTextBox } from "./IdsTextBox";
import { Icon } from "./Icon";
import { InlineAlert, InlineAlertSeverity } from "./InlineAlert";
import { Link } from "./Link";
import styles from "./IdsLogin.module.css";

export type IdsLoginVariant =
  | "default"
  | "with social"
  | "with registration"
  | "minimal"
  | "branded"
  | "two-factor"
  | "with captcha"
  | "inline";

export interface IdsLoginProps {
  variant?: IdsLoginVariant;
  title?: string;
  showLogo?: boolean;
  username?: string;
  password?: string;
  remember?: boolean;
  message?: string;
  messageType?: InlineAlertSeverity;
  onLogin?: (username: string, password: string) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export function IdsLogin({
  variant = "default",
  title = "Login",
  showLogo,
  username: usernameProp = "",
  password: passwordProp = "",
  remember: rememberProp = false,
  message = "",
  messageType = "informational",
  onLogin,
  onForgotPassword,
  onRegister,
}: IdsLoginProps) {
  const [username, setUsername] = useState(usernameProp);
  const [password, setPassword] = useState(passwordProp);
  const [remember, setRemember] = useState(rememberProp);
  const [code, setCode] = useState("");

  const usernameId = useId();
  const passwordId = useId();
  const codeId = useId();

  const computedShowLogo = showLogo ?? (variant === "branded");
  const showHeader = variant !== "minimal";
  const cardClass =
    variant === "inline"
      ? styles.inline
      : variant === "minimal"
        ? styles.minimal
        : styles.card;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin?.(username, password);
  };

  return (
    <div className={styles.login} data-variant={variant}>
      <div className={cardClass}>
        {showHeader && (
          <div className={styles.header}>
            {computedShowLogo && (
              <Icon
                shapeName="logo-dell-circle-color"
                variant="img"
                style={{ width: 64, height: 64 }}
                title="Application brand"
              />
            )}
            <h1 className={styles.title}>{title}</h1>
          </div>
        )}

        {message && (
          <div className={styles.alert}>
            <InlineAlert severity={messageType} message={message} density="compact" />
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} aria-label={title}>
          <div className={styles.field}>
            <label htmlFor={usernameId} className={styles.label}>
              Username or email
            </label>
            <IdsTextBox
              id={usernameId}
              value={username}
              onValueChange={setUsername}
              ariaLabel="Username or email"
              placeholder="Username or email"
              showHelperText={false}
              showIcon={false}
              size="large"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={passwordId} className={styles.label}>
              Password
            </label>
            <IdsTextBox
              id={passwordId}
              value={password}
              onValueChange={setPassword}
              ariaLabel="Password"
              placeholder="Password"
              inputType="password"
              showHelperText={false}
              showIcon={false}
              size="large"
            />
          </div>

          {variant === "two-factor" && (
            <div className={styles.field}>
              <label htmlFor={codeId} className={styles.label}>
                Authentication code
              </label>
              <IdsTextBox
                id={codeId}
                value={code}
                onValueChange={setCode}
                ariaLabel="Authentication code"
                placeholder="Authentication code"
                showHelperText={false}
                showIcon={false}
                size="large"
              />
            </div>
          )}

          {variant === "with captcha" && (
            <div className={styles.captcha} aria-label="CAPTCHA verification">
              CAPTCHA verification
            </div>
          )}

          <div className={styles.actions}>
            <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
            <Link
              href="#"
              onClick={(event) => {
                event.preventDefault();
                onForgotPassword?.();
              }}
            >
              Forgot password?
            </Link>
          </div>

          <IdsButton type="submit" variant="primary" size="lg" className={styles.submit}>
            Log in
          </IdsButton>

          {variant === "with social" && (
            <div className={styles.social}>
              <IdsButton type="button" variant="secondary" size="lg" className={styles.socialButton}>
                Continue with Google
              </IdsButton>
              <IdsButton type="button" variant="secondary" size="lg" className={styles.socialButton}>
                Continue with Microsoft
              </IdsButton>
            </div>
          )}

          {variant === "with registration" && (
            <div className={styles.register}>
              <span>Don’t have an account? </span>
              <Link
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  onRegister?.();
                }}
              >
                Register now
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
