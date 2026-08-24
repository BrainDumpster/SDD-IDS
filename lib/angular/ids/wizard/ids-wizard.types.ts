import type { TemplateRef } from "@angular/core";
import {
  WIZARD_MODE_OPTIONS,
  WIZARD_SIZE_OPTIONS,
} from "@component-contracts/ids/wizard.contract";

export type IdsWizardMode = (typeof WIZARD_MODE_OPTIONS)[number];
export type IdsWizardSize = (typeof WIZARD_SIZE_OPTIONS)[number];
export type IdsWizardStepStatus = "none" | "success" | "warning" | "error";

export interface IdsWizardContext {
  currentStepId?: string;
}

export interface IdsWizardFooterButtons {
  showCancel?: boolean;
  showPrevious?: boolean;
  primaryLabel?: "Next" | "Finish" | string;
}

export type IdsWizardStepContent = string | TemplateRef<unknown>;

export interface IdsWizardStepInput {
  id: string;
  label: string;
  pageTitle?: string;
  content?: IdsWizardStepContent;
  status?: IdsWizardStepStatus;
  statusIconSlug?: string | null;
  isVisible?: boolean | ((ctx: IdsWizardContext) => boolean);
  children?: IdsWizardStepInput[];
  footerButtons?: IdsWizardFooterButtons;
}

export interface IdsWizardEventPayload {
  stepId: string;
  parentStepId?: string;
  stepIndex: number;
  substepIndex?: number;
  stepCode: string;
}

export interface IdsWizardVisibleNode {
  node: IdsWizardStepInput;
  parentId?: string;
  topLevelIndex: number;
  childIndex?: number;
}

export interface IdsWizardDisplayStep {
  top: IdsWizardVisibleNode;
  children: IdsWizardVisibleNode[];
}
