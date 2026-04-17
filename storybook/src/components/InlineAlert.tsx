import type { AlertInlineSeverity } from "./Alert";
import { Alert } from "./Alert";

export type InlineAlertSeverity = AlertInlineSeverity;

export interface InlineAlertProps {
  severity?: InlineAlertSeverity;
  message: string;
  title?: string;
  density?: "compact" | "detailed";
  linkLabel?: string;
  linkHref?: string;
  onLinkClick?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function InlineAlert(props: InlineAlertProps) {
  return <Alert display="inline" {...props} />;
}
