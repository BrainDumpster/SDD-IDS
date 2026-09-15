/**
 * React implementations of design-spec components.
 *
 * Path convention: `lib/react/<design-system>/<component>/`
 * Other frameworks use sibling folders (e.g. `lib/angular/...`).
 *
 * Synapse: import from `./synapse` (façade over `./ids` + synapse-theme.css).
 * Do not clone IDS implementations for ids-fork components.
 */
export { IdsIcon, type IdsIconProps } from "./ids/icon";
export { IdsHelper, IdsHelperText } from "./ids/helper";
export { IdsError, IdsErrorText } from "./ids/error";
export {
  IdsAlert,
  IdsAlertGroup,
  type IdsAlertProps,
  type IdsAlertItem,
  type IdsAlertGroupProps,
} from "./ids/alert";
export {
  IdsDetailPanel,
  IdsDetailPanelContent,
  IdsDetailPanelHeader,
  IdsDetailPanelTitle,
  IdsDetailPanelBody,
  IdsDetailPanelFooter,
  IdsDetailPanelCollapsedRail,
  IdsDetailPanelToggleButton,
  type IdsDetailPanelProps,
  type IdsDetailPanelAttachMode,
} from "./ids/detail-panel";
export {
  IdsModal,
  IdsModalClose,
  IdsModalHeader,
  IdsModalTitle,
  IdsModalDescription,
  IdsModalContent,
  IdsModalFooter,
  type IdsModalProps,
  type IdsModalPage,
} from "./ids/modal";
export {
  IdsProgressBar,
  type IdsProgressBarProps,
  type IdsProgressBarType,
  type IdsProgressBarThickness,
  type IdsProgressBarState,
} from "./ids/progress-bar";
export { IdsFooter, type IdsFooterProps } from "./ids/footer";
