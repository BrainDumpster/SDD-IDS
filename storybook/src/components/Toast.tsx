import { Toast as BaseToast } from "@base-ui-components/react/toast";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";
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
  /** Maximum number of toasts displayed at once. Default is unlimited so all toast buttons remain interactive. */
  limit?: number;
}

/**
 * Wrap your app root with <ToastSetup> to enable toasts.
 * Use the `useToast()` hook from Base UI to trigger toasts inside.
 */
export function ToastSetup({
  children,
  position = "top-right",
  duration = 8000,
  limit = Number.MAX_SAFE_INTEGER,
}: ToastSetupProps) {
  return (
    <BaseToast.Provider timeout={duration} limit={limit}>
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
            tabIndex={-1}
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
                <Button
                  variant="tertiary"
                  size="sm"
                  className={styles.linkButton}
                  onClick={() => {
                    onLinkClick?.();
                  }}
                >
                  {linkLabel}
                </Button>
              ) : null}
              {closable ? (
                <Button
                  variant="tertiary"
                  size="sm"
                  iconOnly
                  icon={<Icon shapeName="shape-x" variant="mask" color="var(--color-icon-gray-white)" style={{ width: "100%", height: "100%" }} />}
                  aria-label="Close"
                  type="button"
                  className={styles.closeButton}
                  onClick={() => toastManager.close(toast.id)}
                />
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


