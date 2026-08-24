import { createContext, useContext } from "react";
import type { MainMenuLeftPrimaryState } from "./MainMenuLeft.types";

export interface MainMenuLeftContextValue {
  railExpanded: boolean;
  forceStates: boolean;
  defaultSelectedItemId?: string;

  isGroupExpanded(groupId: string): boolean;
  registerGroup(
    groupId: string,
    options: { defaultExpanded: boolean; childrenMenuPinned: boolean },
  ): void;
  unregisterGroup(groupId: string): void;
  toggleGroup(groupId: string): void;

  getPrimaryState(itemId: string, forced?: MainMenuLeftPrimaryState): MainMenuLeftPrimaryState;
  isPrimarySelected(itemId: string, forced?: MainMenuLeftPrimaryState): boolean;
  isPrimaryFocused(itemId: string, forced?: MainMenuLeftPrimaryState): boolean;
  showPrimaryInset(
    itemId: string,
    groupId?: string,
    forced?: MainMenuLeftPrimaryState,
  ): boolean;
  hasSelectedSecondaryInGroup(groupId: string): boolean;
  primaryAriaCurrent(
    itemId: string,
    groupId?: string,
    forced?: MainMenuLeftPrimaryState,
  ): string | undefined;

  isSecondarySelected(itemId: string, parentGroupId: string): boolean;

  onPrimaryActivate(itemId: string, label: string, groupId?: string): void;
  onSecondaryActivate(itemId: string, parentGroupId: string, label: string): void;

  showChevronForGroup(groupId: string): boolean;
  isGroupChildrenVisible(groupId: string): boolean;
  primaryAriaExpanded(groupId: string): boolean | undefined;
}

export const MainMenuLeftContext = createContext<MainMenuLeftContextValue | null>(null);

export function useMainMenuLeftContext(): MainMenuLeftContextValue {
  const value = useContext(MainMenuLeftContext);
  if (!value) {
    throw new Error("Main Menu/Left composition components must be used inside <MainMenuLeft>.");
  }
  return value;
}

export const MainMenuLeftGroupContext = createContext<{ groupId: string } | null>(null);

export function useMainMenuLeftGroupContext(): { groupId: string } | null {
  return useContext(MainMenuLeftGroupContext);
}
