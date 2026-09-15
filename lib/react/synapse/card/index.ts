/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/card`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsCard as SynapseCard,
  IdsCardSecondaryTitle as SynapseCardSecondaryTitle,
  IdsCardTextContent as SynapseCardTextContent,
  IdsCardKeyValueContent as SynapseCardKeyValueContent,
  isIdsCardElement as isSynapseCardElement,
  collectIdsCardChildren as collectSynapseCardChildren,
  IdsCardCompound as SynapseCardCompound,
  type IdsCardProps as SynapseCardProps,
  type IdsCardAction as SynapseCardAction,
  type IdsCardKeyValueItem as SynapseCardKeyValueItem,
  type IdsCardSize as SynapseCardSize,
  type IdsCardMenuOption as SynapseCardMenuOption,
} from "../../ids/card";
export {
  IdsCardHeaderOverflowMenu as SynapseCardHeaderOverflowMenu,
  type IdsCardHeaderOverflowMenuProps as SynapseCardHeaderOverflowMenuProps,
} from "../../ids/card";
