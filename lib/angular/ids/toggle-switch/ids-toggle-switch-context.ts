import { InjectionToken } from "@angular/core";

export interface IdsToggleSwitchContext {
  readonly resolvedId: string;
  readonly resolvedName: string | undefined;
  readonly resolvedValue: string | undefined;
  readonly resolvedChecked: boolean;
  readonly resolvedDisabled: boolean;
  readonly resolvedLabel: string | undefined;
  readonly ariaLabel?: string | undefined;
  readonly describedBy: string | undefined;
  readonly assistiveId: string | undefined;
  onInputChange(event: Event): void;
}

export const IDS_TOGGLE_SWITCH_CONTEXT = new InjectionToken<IdsToggleSwitchContext>(
  "IDS_TOGGLE_SWITCH_CONTEXT",
);
