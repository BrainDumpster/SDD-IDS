import { registerElementSafely } from "../internal/registration.js";
import { IdsDetailPanel } from "./detail-panel.element.js";
import {
  IdsDetailPanelBody,
  IdsDetailPanelCollapsedRail,
  IdsDetailPanelContent,
  IdsDetailPanelDetachButton,
  IdsDetailPanelFooter,
  IdsDetailPanelHeader,
  IdsDetailPanelTitle,
  IdsDetailPanelToggleButton,
} from "./detail-panel-parts.element.js";
import {
  IdsDetailPanelBlock,
  IdsDetailPanelField,
  IdsDetailPanelSection,
} from "./detail-panel-blocks.element.js";
import "../icon/register.js";

registerElementSafely("ids-detail-panel", IdsDetailPanel);
registerElementSafely("ids-detail-panel-content", IdsDetailPanelContent);
registerElementSafely("ids-detail-panel-header", IdsDetailPanelHeader);
registerElementSafely("ids-detail-panel-title", IdsDetailPanelTitle);
registerElementSafely("ids-detail-panel-body", IdsDetailPanelBody);
registerElementSafely("ids-detail-panel-footer", IdsDetailPanelFooter);
registerElementSafely(
  "ids-detail-panel-collapsed-rail",
  IdsDetailPanelCollapsedRail,
);
registerElementSafely(
  "ids-detail-panel-toggle-button",
  IdsDetailPanelToggleButton,
);
registerElementSafely(
  "ids-detail-panel-detach-button",
  IdsDetailPanelDetachButton,
);
registerElementSafely("ids-detail-panel-section", IdsDetailPanelSection);
registerElementSafely("ids-detail-panel-field", IdsDetailPanelField);
registerElementSafely("ids-detail-panel-block", IdsDetailPanelBlock);

export {
  IdsDetailPanel,
  IdsDetailPanelContent,
  IdsDetailPanelHeader,
  IdsDetailPanelTitle,
  IdsDetailPanelBody,
  IdsDetailPanelFooter,
  IdsDetailPanelCollapsedRail,
  IdsDetailPanelToggleButton,
  IdsDetailPanelDetachButton,
  IdsDetailPanelSection,
  IdsDetailPanelField,
  IdsDetailPanelBlock,
};
