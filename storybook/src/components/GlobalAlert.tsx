import type { AlertCarouselProps, AlertGlobalSeverity } from "./Alert";
import { Alert } from "./Alert";

export type GlobalAlertSeverity = AlertGlobalSeverity;
export type GlobalAlertCarouselProps = AlertCarouselProps;

export interface GlobalAlertProps {
  severity?: GlobalAlertSeverity;
  message: string;
  linkLabel?: string;
  linkHref?: string;
  onLinkClick?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
  carousel?: GlobalAlertCarouselProps;
}

export function GlobalAlert(props: GlobalAlertProps) {
  return <Alert display="global" {...props} />;
}
