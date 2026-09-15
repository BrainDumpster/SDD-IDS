/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/modal`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsModal as SynapseModal,
  IdsModalClose as SynapseModalClose,
  IdsModalHeader as SynapseModalHeader,
  IdsModalTitle as SynapseModalTitle,
  IdsModalDescription as SynapseModalDescription,
  IdsModalTabs as SynapseModalTabs,
  IdsModalContent as SynapseModalContent,
  IdsModalFooter as SynapseModalFooter,
  type IdsModalProps as SynapseModalProps,
  type IdsModalCloseProps as SynapseModalCloseProps,
  type IdsModalHeaderProps as SynapseModalHeaderProps,
  type IdsModalTitleProps as SynapseModalTitleProps,
  type IdsModalDescriptionProps as SynapseModalDescriptionProps,
  type IdsModalTabsProps as SynapseModalTabsProps,
  type IdsModalContentProps as SynapseModalContentProps,
  type IdsModalFooterProps as SynapseModalFooterProps,
  type IdsModalScenario as SynapseModalScenario,
  type IdsModalType as SynapseModalType,
  type IdsModalSize as SynapseModalSize,
  type IdsModalLayer as SynapseModalLayer,
  type IdsModalPage as SynapseModalPage,
} from "../../ids/modal";
