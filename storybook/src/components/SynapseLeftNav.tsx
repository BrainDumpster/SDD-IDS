import {
  MainMenuLeft,
  type MainMenuLeftProps,
} from "./MainMenuLeft";

export interface SynapseLeftNavNewChat {
  label?: string;
  onAction?: () => void;
}

export interface SynapseLeftNavProps extends MainMenuLeftProps {
  newChat?: SynapseLeftNavNewChat;
}

/**
 * Synapse Left Nav — `MainMenuLeft` with `programme="synapse"` and optional New Chat in `MainMenuList`.
 */
export function SynapseLeftNav({
  newChat,
  expanded = true,
  ariaLabel = "Left navigation",
  ...rest
}: SynapseLeftNavProps) {
  return (
    <MainMenuLeft
      expanded={expanded}
      ariaLabel={ariaLabel}
      programme="synapse"
      menuLead={newChat}
      {...rest}
    />
  );
}

export type {
  MainMenuLeftContextMenuOption as SynapseLeftNavContextMenuOption,
  MainMenuLeftLink as SynapseLeftNavLink,
  MainMenuLeftLogo as SynapseLeftNavLogo,
  MainMenuLeftNavigationTarget as SynapseLeftNavNavigationTarget,
  MainMenuLeftPrimaryItem as SynapseLeftNavPrimaryItem,
  MainMenuLeftSecondaryContextMenuDetail as SynapseLeftNavSecondaryContextMenuDetail,
  MainMenuLeftSecondaryItem as SynapseLeftNavSecondaryItem,
  MainMenuLeftSelectionDetail as SynapseLeftNavSelectionDetail,
} from "./MainMenuLeft";
