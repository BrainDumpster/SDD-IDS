import { Toast as BaseToast } from "@base-ui-components/react/toast";
import type { ReactNode } from "react";
import styles from "./Toast.module.css";

type ToastVariant = "info" | "success" | "warning" | "error";

interface ToastData {
  variant?: ToastVariant;
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
      <BaseToast.Viewport className={styles.viewport}>
        {(toast) => {
          const variant = (toast.data as ToastData | undefined)?.variant ?? "info";
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
                {toast.title && (
                  <BaseToast.Title className={styles.title}>
                    {toast.title}
                  </BaseToast.Title>
                )}
                {toast.description && (
                  <BaseToast.Description className={styles.description}>
                    {toast.description}
                  </BaseToast.Description>
                )}
              </div>
              <BaseToast.Close className={styles.close} aria-label="Close">
                <CloseIcon />
              </BaseToast.Close>
            </BaseToast.Root>
          );
        }}
      </BaseToast.Viewport>
    </BaseToast.Provider>
  );
}

export const useToast = BaseToast.useToastManager;

function VariantIcon({ variant }: { variant: ToastVariant }) {
  const size = 20;
  switch (variant) {
    case "info":
      return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M10 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="6.5" r="1" fill="currentColor" />
        </svg>
      );
    case "success":
      return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "warning":
      return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <path d="M10 2L19 18H1L10 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M10 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="15" r="1" fill="currentColor" />
        </svg>
      );
    case "error":
      return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
