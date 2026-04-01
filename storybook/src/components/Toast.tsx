import { Toast as BaseToast } from "@base-ui-components/react/toast";
import type { ReactNode } from "react";
import infoIcon from "../../../assets/icons/info-circ-solid.svg";
import successIcon from "../../../assets/icons/status-ok-circ-solid.svg";
import minorIcon from "../../../assets/icons/status-warn-tri-solid.svg";
import majorIcon from "../../../assets/icons/status-error-diamond-solid.svg";
import criticalIcon from "../../../assets/icons/status-critical-square-solid.svg";
import styles from "./Toast.module.css";

export type ToastVariant = "info" | "success" | "minor" | "major" | "critical";

interface ToastData {
  variant?: ToastVariant;
  showLink?: boolean;
  closable?: boolean;
  onLinkClick?: () => void;
  linkLabel?: string;
}

interface ToastSetupProps {
  children: ReactNode;
}

/**
 * Wrap your app root with <ToastSetup> to enable toasts.
 * Use the `useToast()` hook from Base UI to trigger toasts inside.
 */
export function ToastSetup({ children }: ToastSetupProps) {
  return (
    <BaseToast.Provider timeout={5000}>
      {children}
      <ToastViewport />
    </BaseToast.Provider>
  );
}

export const useToast = BaseToast.useToastManager;

function ToastViewport() {
  const toastManager = useToast();
  return (
    <BaseToast.Viewport className={styles.viewport}>
      {toastManager.toasts.map((toast) => {
        const variant = (toast.data as ToastData | undefined)?.variant ?? "info";
        const showLink = Boolean((toast.data as ToastData | undefined)?.showLink);
        const closable = (toast.data as ToastData | undefined)?.closable ?? true;
        const onLinkClick = (toast.data as ToastData | undefined)?.onLinkClick;
        const linkLabel = (toast.data as ToastData | undefined)?.linkLabel ?? "View Details";
        return (
          <BaseToast.Root
            key={toast.id}
            toast={toast}
            className={`${styles.root} ${styles[variant]}`}
          >
            <div className={styles.iconWrap}>
              <VariantIcon variant={variant} />
            </div>
            <div className={styles.content}>
              <BaseToast.Description className={styles.description}>
                {toast.description ?? toast.title}
              </BaseToast.Description>
            </div>
            {showLink ? (
              <BaseToast.Action
                className={styles.link}
                onClick={() => {
                  onLinkClick?.();
                }}
              >
                <span>{linkLabel}</span>
              </BaseToast.Action>
            ) : null}
            {closable ? (
              <BaseToast.Close className={styles.close} aria-label="Close">
                <CloseIcon />
              </BaseToast.Close>
            ) : (
              <span className={styles.closePlaceholder} aria-hidden="true" />
            )}
          </BaseToast.Root>
        );
      })}
    </BaseToast.Viewport>
  );
}

function VariantIcon({ variant }: { variant: ToastVariant }) {
  const iconByVariant: Record<ToastVariant, string> = {
    info: infoIcon,
    success: successIcon,
    minor: minorIcon,
    major: majorIcon,
    critical: criticalIcon,
  };

  switch (variant) {
    case "info":
    case "success":
    case "minor":
    case "major":
    case "critical":
      return <img src={iconByVariant[variant]} alt="" className={styles.variantIcon} />;
  }
}

function CloseIcon() {
  return (
    <svg
      className={styles.closeIcon}
      width="12"
      height="12"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <polygon
        points="2.94,32 16,18.94 29.06,32 32,29.06 18.94,16 32,2.94 29.06,0 16,13.06 2.94,0 0,2.94 13.06,16 0,29.06"
        fill="currentColor"
      />
    </svg>
  );
}

