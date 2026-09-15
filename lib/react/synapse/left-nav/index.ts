/**
 * Synapse façade — strategy: wrapper + overlay-css.
 * IDS implementation: `lib/react/ids/main-menu-left`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  SynapseLeftNav,
  type SynapseLeftNavProps,
} from "./SynapseLeftNav";
export type {
  MainMenuLeftLink as SynapseLeftNavLink,
  MainMenuLeftLogo as SynapseLeftNavLogo,
  MainMenuLeftPrimaryItem as SynapseLeftNavPrimaryItem,
  MainMenuLeftPrimaryState as SynapseLeftNavPrimaryState,
  MainMenuLeftSecondaryItem as SynapseLeftNavSecondaryItem,
  MainMenuLeftNavigationTarget as SynapseLeftNavNavigationTarget,
  MainMenuLeftSelectionDetail as SynapseLeftNavSelectionDetail,
} from "../../ids/main-menu-left";
