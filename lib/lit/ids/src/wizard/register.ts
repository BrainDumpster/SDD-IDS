import { registerElementSafely } from "../internal/registration.js";
import { IdsWizard } from "./wizard.element.js";
import {
  IdsWizardBody,
  IdsWizardCancelButton,
  IdsWizardCloseAction,
  IdsWizardContentPane,
  IdsWizardFooter,
  IdsWizardFooterActions,
  IdsWizardHeader,
  IdsWizardHeaderTitle,
  IdsWizardPageContent,
  IdsWizardPageTitle,
  IdsWizardPreviousButton,
  IdsWizardPrimaryButton,
  IdsWizardProgressLabel,
  IdsWizardStepItem,
  IdsWizardStepLabel,
  IdsWizardStepStatusIndicator,
  IdsWizardStepsPane,
  IdsWizardSubstepItem,
  IdsWizardSubstepList,
} from "./wizard-parts.element.js";
import "../icon/register.js";

registerElementSafely("ids-wizard-header", IdsWizardHeader);
registerElementSafely("ids-wizard-header-title", IdsWizardHeaderTitle);
registerElementSafely("ids-wizard-close-action", IdsWizardCloseAction);
registerElementSafely("ids-wizard-body", IdsWizardBody);
registerElementSafely("ids-wizard-steps-pane", IdsWizardStepsPane);
registerElementSafely("ids-wizard-step-item", IdsWizardStepItem);
registerElementSafely("ids-wizard-step-label", IdsWizardStepLabel);
registerElementSafely(
  "ids-wizard-step-status-indicator",
  IdsWizardStepStatusIndicator,
);
registerElementSafely("ids-wizard-substep-list", IdsWizardSubstepList);
registerElementSafely("ids-wizard-substep-item", IdsWizardSubstepItem);
registerElementSafely("ids-wizard-content-pane", IdsWizardContentPane);
registerElementSafely("ids-wizard-page-title", IdsWizardPageTitle);
registerElementSafely("ids-wizard-page-content", IdsWizardPageContent);
registerElementSafely("ids-wizard-footer", IdsWizardFooter);
registerElementSafely("ids-wizard-progress-label", IdsWizardProgressLabel);
registerElementSafely("ids-wizard-footer-actions", IdsWizardFooterActions);
registerElementSafely("ids-wizard-cancel-button", IdsWizardCancelButton);
registerElementSafely("ids-wizard-previous-button", IdsWizardPreviousButton);
registerElementSafely("ids-wizard-primary-button", IdsWizardPrimaryButton);
registerElementSafely("ids-wizard", IdsWizard);

export {
  IdsWizard,
  IdsWizardHeader,
  IdsWizardHeaderTitle,
  IdsWizardCloseAction,
  IdsWizardBody,
  IdsWizardStepsPane,
  IdsWizardStepItem,
  IdsWizardStepLabel,
  IdsWizardStepStatusIndicator,
  IdsWizardSubstepList,
  IdsWizardSubstepItem,
  IdsWizardContentPane,
  IdsWizardPageTitle,
  IdsWizardPageContent,
  IdsWizardFooter,
  IdsWizardProgressLabel,
  IdsWizardFooterActions,
  IdsWizardCancelButton,
  IdsWizardPreviousButton,
  IdsWizardPrimaryButton,
};
