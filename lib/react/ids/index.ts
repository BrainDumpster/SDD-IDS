/**
 * IDS React components generated from design-spec.
 *
 * Path convention: `lib/react/ids/<component>/`
 * Shared primitives (e.g. Icon, Helper, Error) live alongside feature components.
 */
export { IdsIcon, type IdsIconProps } from "./icon";
export {
  IdsButton,
  IdsButtonLeadingIcon,
  IdsButtonLabel,
  type IdsButtonProps,
  type IdsButtonVariant,
  type IdsButtonSize,
} from "./button";
export {
  IdsCheckbox,
  IdsCheckboxLabel,
  type IdsCheckboxProps,
} from "./checkbox";
export {
  IdsRadioGroup,
  IdsRadioButton,
  IdsRadioLabel,
  type IdsRadioGroupProps,
  type IdsRadioButtonProps,
} from "./radio-button";
export {
  IdsTextBox,
  type IdsTextBoxProps,
  type IdsTextBoxComponentType,
  type IdsTextBoxSize,
  type IdsTextBoxState,
} from "./text-box";
export { IdsHelper, IdsHelperText, type IdsHelperProps } from "./helper";
export { IdsError, IdsErrorText, type IdsErrorProps } from "./error";
export {
  IdsAlert,
  IdsAlertGroup,
  type IdsAlertProps,
  type IdsAlertDisplay,
  type IdsAlertGlobalSeverity,
  type IdsAlertInlineSeverity,
  type IdsAlertCarouselProps,
  type IdsAlertLink,
  type IdsAlertGroupProps,
  type IdsAlertItem,
} from "./alert";
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
} from "./detail-panel";
export {
  IdsModal,
  IdsModalClose,
  IdsModalHeader,
  IdsModalTitle,
  IdsModalDescription,
  IdsModalTabs,
  IdsModalContent,
  IdsModalFooter,
  type IdsModalProps,
  type IdsModalScenario,
  type IdsModalType,
  type IdsModalSize,
  type IdsModalLayer,
  type IdsModalPage,
} from "./modal";
export {
  Tooltip,
  IdsTooltip,
  TooltipTrigger,
  TooltipPanel,
  TooltipHeader,
  TooltipBody,
  TooltipClose,
  type TooltipProps,
  type TooltipSide,
  type TooltipArrowAlign,
  type TooltipCloseReason,
} from "./tooltip";
export {
  IdsBadge,
  type IdsBadgeProps,
  type IdsBadgeType,
} from "./badge";
export {
  IdsTag,
  type IdsTagProps,
  type IdsTagType,
  type IdsTagSize,
  type IdsTagTone,
} from "./tag";
export {
  IdsProgressBar,
  type IdsProgressBarProps,
  type IdsProgressBarType,
  type IdsProgressBarThickness,
  type IdsProgressBarState,
} from "./progress-bar";
export {
  IdsSlider,
  type IdsSliderProps,
  type IdsSliderMode,
  type IdsSliderValue,
} from "./slider";
export { IdsFooter, type IdsFooterProps } from "./footer";
export {
  IdsLink,
  type IdsLinkProps,
  type IdsLinkType,
  type IdsLinkDataState,
  type IdsLinkTarget,
} from "./link";
export {
  IdsCard,
  IdsCardSecondaryTitle,
  IdsCardTextContent,
  IdsCardKeyValueContent,
  IdsCardHeaderOverflowMenu,
  isIdsCardElement,
  collectIdsCardChildren,
  type IdsCardProps,
  type IdsCardAction,
  type IdsCardKeyValueItem,
  type IdsCardSize,
  type IdsCardMenuOption,
  type IdsCardHeaderOverflowMenuProps,
} from "./card";
