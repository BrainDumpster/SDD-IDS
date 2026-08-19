import { InjectionToken } from "@angular/core";
import type {
  MainMenuLeftPrimaryState,
  MainMenuLeftSelectionDetail,
} from "@component-contracts/ids/main-menu-left.contract";

export interface IdsMainMenuLeftGroupRegistration {
  groupId: string;
  defaultExpanded: boolean;
  childrenMenuPinned: boolean;
}

export interface IdsMainMenuLeftContext {
  readonly railExpanded: boolean;
  readonly forceStates: boolean;
  readonly defaultSelectedItemId: string | null;

  isGroupExpanded(groupId: string): boolean;
  registerGroup(registration: IdsMainMenuLeftGroupRegistration): void;
  unregisterGroup(groupId: string): void;
  toggleGroup(groupId: string): void;
  groupHasChildren(groupId: string): boolean;

  getPrimaryState(
    itemId: string,
    forced?: MainMenuLeftPrimaryState,
  ): MainMenuLeftPrimaryState;
  isPrimarySelected(itemId: string, forced?: MainMenuLeftPrimaryState): boolean;
  isPrimaryFocused(itemId: string, forced?: MainMenuLeftPrimaryState): boolean;
  showPrimaryInset(itemId: string, groupId?: string, forced?: MainMenuLeftPrimaryState): boolean;
  hasSelectedSecondaryInGroup(groupId: string): boolean;
  primaryAriaCurrent(itemId: string, groupId?: string, forced?: MainMenuLeftPrimaryState): string | null;

  isSecondarySelected(itemId: string, parentGroupId: string): boolean;

  onPrimaryActivate(itemId: string, label: string, groupId?: string): void;
  onSecondaryActivate(itemId: string, parentGroupId: string, label: string): void;

  showChevronForGroup(groupId: string): boolean;
  isGroupChildrenVisible(groupId: string): boolean;
  primaryAriaExpanded(groupId: string): boolean | null;
  stateClass(itemId: string, forced?: MainMenuLeftPrimaryState): string;
}

export const IDS_MAIN_MENU_LEFT_CONTEXT = new InjectionToken<IdsMainMenuLeftContext>(
  "IDS_MAIN_MENU_LEFT_CONTEXT",
);

export const IDS_MAIN_MENU_LEFT_GROUP_CONTEXT = new InjectionToken<{
  groupId: string;
}>("IDS_MAIN_MENU_LEFT_GROUP_CONTEXT");

export type MainMenuLeftSelectionEmitter = (detail: MainMenuLeftSelectionDetail) => void;
