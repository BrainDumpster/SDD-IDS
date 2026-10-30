import { InjectionToken } from "@angular/core";
import type { IdsWizardEventPayload, IdsWizardMode } from "./ids-wizard.types";

export interface IdsWizardRuntimeContext {
  readonly mode: IdsWizardMode;
  readonly titleId: string;
  readonly currentPayload: IdsWizardEventPayload | null;
  readonly isFirstLeaf: boolean;
  readonly isLastLeaf: boolean;
  readonly primaryEnabled: boolean;
  readonly progressLabel: string;
  readonly primaryLabel: string;
  readonly showCancel: boolean;
  readonly showPrevious: boolean;
  cancel(): void;
  goPrevious(): void;
  goNextOrFinish(): void;
}

export const IDS_WIZARD_CONTEXT = new InjectionToken<IdsWizardRuntimeContext>(
  "IDS_WIZARD_CONTEXT",
);
