import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import {
  MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS,
  type MainMenuLeftPrimaryItem,
  type MainMenuLeftPrimaryState,
  type MainMenuLeftSelectionDetail,
} from "@component-contracts/ids/main-menu-left.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";
import {
  IDS_MAIN_MENU_LEFT_CONTEXT,
  type IdsMainMenuLeftContext,
  type IdsMainMenuLeftGroupRegistration,
} from "./ids-main-menu-left-context";
import { IdsMainMenuLeftItemsAdapterComponent } from "./ids-main-menu-left-items-adapter.component";
import {
  buildNavigateTarget,
  buildSelectionDetail,
  resolveInitialSelectedKey,
  toStateClass,
} from "./ids-main-menu-left.utils";

@Component({
  selector: "ids-main-menu-left",
  standalone: true,
  imports: [IdsIconComponent, IdsMainMenuLeftItemsAdapterComponent],
  templateUrl: "./ids-main-menu-left.component.html",
  styleUrl: "./ids-main-menu-left.component.scss",
  encapsulation: ViewEncapsulation.None,
  host: { class: "ids-main-menu-left-host" },
  providers: [{ provide: IDS_MAIN_MENU_LEFT_CONTEXT, useExisting: IdsMainMenuLeftComponent }],
})
export class IdsMainMenuLeftComponent implements OnInit, OnChanges, IdsMainMenuLeftContext {
  @Input() items: MainMenuLeftPrimaryItem[] | null = null;
  @Input() expanded: boolean = MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS.expanded;
  @Input() defaultSelectedItemId: string | null =
    MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS.defaultSelectedItemId;
  @Input() forceStates = false;
  @Input() ariaLabel = MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS.ariaLabel;
  /** When true, projected composition children render instead of `items[]`. */
  @Input() compositionMode = false;

  @Output() readonly expandedChange = new EventEmitter<boolean>();
  @Output() readonly selectedChange = new EventEmitter<MainMenuLeftSelectionDetail>();
  @Output() readonly navigate = new EventEmitter<ReturnType<typeof buildNavigateTarget>>();

  private internalExpanded = true;
  private groups = new Map<string, IdsMainMenuLeftGroupRegistration>();

  selectedKey: string | null = null;
  expandedGroupId: string | null = null;
  selectedSecondaryParentKey: string | null = null;
  selectedSecondaryKey: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["expanded"]) {
      this.internalExpanded = this.expanded;
    }
    if (changes["items"] || changes["defaultSelectedItemId"]) {
      this.selectedKey = resolveInitialSelectedKey(
        this.items ?? [],
        this.defaultSelectedItemId ?? undefined,
      );
    }
  }

  ngOnInit(): void {
    this.internalExpanded = this.expanded;
    this.selectedKey = resolveInitialSelectedKey(
      this.items ?? [],
      this.defaultSelectedItemId ?? undefined,
    );
  }

  get railExpanded(): boolean {
    return this.internalExpanded;
  }

  get useComposition(): boolean {
    return this.compositionMode || this.items == null;
  }

  get legacyItems(): MainMenuLeftPrimaryItem[] {
    return this.items ?? [...MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS.items];
  }

  registerGroup(registration: IdsMainMenuLeftGroupRegistration): void {
    this.groups.set(registration.groupId, registration);
  }

  unregisterGroup(groupId: string): void {
    this.groups.delete(groupId);
  }

  isGroupExpanded(groupId: string): boolean {
    const meta = this.groups.get(groupId);
    if (!meta) return false;
    if (meta.childrenMenuPinned) return meta.defaultExpanded;
    return this.expandedGroupId === groupId;
  }

  groupHasChildren(_groupId: string): boolean {
    return true;
  }

  toggleGroup(groupId: string): void {
    if (!this.railExpanded) return;
    if (this.expandedGroupId === groupId) {
      this.expandedGroupId = null;
      this.selectedSecondaryParentKey = null;
      this.selectedSecondaryKey = null;
    } else {
      this.expandedGroupId = groupId;
    }
  }

  getPrimaryState(itemId: string, forced?: MainMenuLeftPrimaryState): MainMenuLeftPrimaryState {
    if (this.forceStates && forced) return forced;
    return this.selectedKey === itemId ? "selected" : "default";
  }

  isPrimarySelected(itemId: string, forced?: MainMenuLeftPrimaryState): boolean {
    const state = this.getPrimaryState(itemId, forced);
    return state === "selected" || state === "selected-focus";
  }

  isPrimaryFocused(itemId: string, forced?: MainMenuLeftPrimaryState): boolean {
    const state = this.getPrimaryState(itemId, forced);
    return state === "default-focus" || state === "selected-focus";
  }

  showPrimaryInset(
    itemId: string,
    groupId?: string,
    forced?: MainMenuLeftPrimaryState,
  ): boolean {
    const state = this.getPrimaryState(itemId, forced);
    const hasForced = this.forceStates && Boolean(forced);
    const hasSelectedSecondary = groupId
      ? this.selectedSecondaryParentKey === groupId
      : false;
    if (hasForced) return state === "selected" || state === "selected-focus";
    if (groupId) return hasSelectedSecondary;
    return this.selectedKey === itemId;
  }

  hasSelectedSecondaryInGroup(groupId: string): boolean {
    return this.selectedSecondaryParentKey === groupId;
  }

  primaryAriaCurrent(
    itemId: string,
    groupId?: string,
    forced?: MainMenuLeftPrimaryState,
  ): string | null {
    const isSelected = this.isPrimarySelected(itemId, forced);
    const hasSelectedSecondary = groupId ? this.hasSelectedSecondaryInGroup(groupId) : false;
    return isSelected && !(groupId && hasSelectedSecondary) ? "page" : null;
  }

  isSecondarySelected(itemId: string, parentGroupId: string): boolean {
    return (
      this.selectedSecondaryParentKey === parentGroupId &&
      this.selectedSecondaryKey === itemId
    );
  }

  onPrimaryActivate(itemId: string, label: string, groupId?: string): void {
    if (this.forceStates) return;
    this.selectedKey = itemId;
    this.navigate.emit(buildNavigateTarget(itemId, label, undefined, undefined, {}));
    this.selectedChange.emit(
      buildSelectionDetail("primary", itemId, undefined, label, undefined, {}),
    );
    if (!groupId) {
      this.selectedSecondaryParentKey = null;
      this.selectedSecondaryKey = null;
    }
  }

  onSecondaryActivate(itemId: string, parentGroupId: string, label: string): void {
    this.selectedSecondaryParentKey = parentGroupId;
    this.selectedSecondaryKey = itemId;
    this.navigate.emit(buildNavigateTarget(itemId, label, parentGroupId, undefined, {}));
    this.selectedChange.emit(
      buildSelectionDetail("secondary", itemId, parentGroupId, label, undefined, {}),
    );
  }

  showChevronForGroup(groupId: string): boolean {
    return this.groups.has(groupId) && this.railExpanded;
  }

  isGroupChildrenVisible(groupId: string): boolean {
    return this.railExpanded && this.isGroupExpanded(groupId);
  }

  primaryAriaExpanded(groupId: string): boolean | null {
    return this.groups.has(groupId) && this.railExpanded
      ? this.isGroupExpanded(groupId)
      : null;
  }

  stateClass(itemId: string, forced?: MainMenuLeftPrimaryState): string {
    return `ids-main-menu-left__primary-row--state-${toStateClass(
      this.getPrimaryState(itemId, forced),
    )}`;
  }

  onToggleExpanded(): void {
    this.internalExpanded = !this.internalExpanded;
    this.expandedChange.emit(this.internalExpanded);
    this.expandedGroupId = null;
  }
}
