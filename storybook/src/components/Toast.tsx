import { Toast as BaseToast } from "@base-ui-components/react/toast";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./Toast.module.css";

export type ToastVariant =
  | "info"
  | "critical"
  | "major-warning"
  | "minor-warning"
  | "success";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ToastData {
  variant?: ToastVariant;
  showLink?: boolean;
  closable?: boolean;
  onLinkClick?: () => void;
  linkLabel?: string;
  duration?: number;
}

interface ToastSetupProps {
  children: ReactNode;
  position?: ToastPosition;
  duration?: number;
}

/**
 * Wrap your app root with <ToastSetup> to enable toasts.
 * Use the `useToast()` hook from Base UI to trigger toasts inside.
 */
export function ToastSetup({
  children,
  position = "top-right",
  duration = 8000,
}: ToastSetupProps) {
  return (
    <BaseToast.Provider timeout={duration}>
      {children}
      <ToastViewport position={position} />
    </BaseToast.Provider>
  );
}

export const useToast = BaseToast.useToastManager;

function ToastViewport({ position }: { position: ToastPosition }) {
  const toastManager = useToast();
  return (
    <BaseToast.Viewport className={styles.viewport} data-position={position}>
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
            <div className={styles.contentGroup}>
              <div className={styles.iconWrap}>
                <VariantIcon variant={variant} />
              </div>
              <div className={styles.content}>
                <BaseToast.Description className={styles.description}>
                  {toast.description ?? toast.title}
                </BaseToast.Description>
              </div>
            </div>
            <div className={styles.actionsGroup}>
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
            </div>
          </BaseToast.Root>
        );
      })}
    </BaseToast.Viewport>
  );
}

function VariantIcon({ variant }: { variant: ToastVariant }) {
  const iconByVariant: Record<ToastVariant, string> = {
    info: "info-circ-solid",
    critical: "status-critical-square-solid",
    "major-warning": "status-error-diamond-solid",
    "minor-warning": "status-warn-tri-solid",
    success: "status-ok-circ-solid",
  };

  return <Icon shapeName={iconByVariant[variant]} variant="img" className={styles.variantIcon} />;
}

function CloseIcon() {
  return <Icon shapeName="shape-x" variant="img" className={styles.closeIcon} />;
}

