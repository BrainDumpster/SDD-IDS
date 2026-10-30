import { InjectionToken, EventEmitter } from "@angular/core";
import type {
  AlertDensity,
  AlertDisplay,
  AlertGlobalSeverity,
  AlertInlineSeverity,
} from "@component-contracts/ids/alert.contract";

export interface IdsAlertContext {
  readonly display: AlertDisplay;
  readonly severity: AlertGlobalSeverity | AlertInlineSeverity;
  readonly density: AlertDensity;
  readonly isGlobal: boolean;
  readonly showTitle: boolean;
  readonly action: EventEmitter<void>;
  onLinkActivate(event: MouseEvent): void;
  linkClass(): string;
  linkButtonClass(): string;
}

export const IDS_ALERT_CONTEXT = new InjectionToken<IdsAlertContext>("IDS_ALERT_CONTEXT");
