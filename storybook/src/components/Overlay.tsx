import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { ReactNode } from "react";
import styles from "./Overlay.module.css";

interface OverlayProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  width?: string;
}

export function Overlay({
  trigger,
  title,
  children,
  width = "400px",
}: OverlayProps) {
  return (
    <BaseDialog.Root>
      <BaseDialog.Trigger className={styles.triggerReset}>
        {trigger}
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup
          className={styles.panel}
          style={{ width }}
        >
          <div className={styles.header}>
            <BaseDialog.Title className={styles.title}>
              {title}
            </BaseDialog.Title>
            <BaseDialog.Close className={styles.close} aria-label="Close">
              <CloseIcon />
            </BaseDialog.Close>
          </div>
          <div className={styles.body}>{children}</div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
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
