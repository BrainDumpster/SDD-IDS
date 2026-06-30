import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { NgClass } from "@angular/common";
import type {
  MainMenuLeftPrimaryItem,
  MainMenuLeftSelectionDetail,
} from "@component-contracts/ids/main-menu-left.contract";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import {
  buildNavigateTarget,
  buildSelectionDetail,
  primaryDisplayName,
  resolvePrimaryId,
  resolveSecondaryId,
  secondaryDisplayName,
  toStateClass,
} from "./ids-main-menu-left.utils";

@Component({
  selector: "ids-main-menu-left-items-adapter",
  standalone: true,
  imports: [NgClass, IdsIconComponent],
  templateUrl: "./ids-main-menu-left-items-adapter.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class IdsMainMenuLeftItemsAdapterComponent {
  @Input({ required: true }) items!: MainMenuLeftPrimaryItem[];
  @Input() railExpanded = true;
  @Input() forceStates = false;
  @Input() selectedKey: string | null = null;
  @Input() expandedChildrenKey: string | null = null;
  @Input() selectedSecondaryParentKey: string | null = null;
  @Input() selectedSecondaryKey: string | null = null;

  @Output() readonly selectedKeyChange = new EventEmitter<string>();
  @Output() readonly expandedChildrenKeyChange = new EventEmitter<string | null>();
  @Output() readonly selectedSecondaryParentKeyChange = new EventEmitter<string | null>();
  @Output() readonly selectedSecondaryKeyChange = new EventEmitter<string | null>();
  @Output() readonly navigate = new EventEmitter<ReturnType<typeof buildNavigateTarget>>();
  @Output() readonly selectedChange = new EventEmitter<MainMenuLeftSelectionDetail>();

  resolveItemId(item: MainMenuLeftPrimaryItem, index: number): string {
    return resolvePrimaryId(item, index);
  }

  resolveChildId(
    child: NonNullable<MainMenuLeftPrimaryItem["children"]>[number],
    parentId: string,
    index: number,
  ): string {
    return resolveSecondaryId(child, parentId, index);
  }

  primaryLabel(item: MainMenuLeftPrimaryItem): string {
    return primaryDisplayName(item);
  }

  secondaryLabel(
    child: NonNullable<MainMenuLeftPrimaryItem["children"]>[number],
  ): string {
    return secondaryDisplayName(child);
  }

  trackSecondary(
    child: NonNullable<MainMenuLeftPrimaryItem["children"]>[number],
    index: number,
  ): string {
    return child.id ?? `child-${index}`;
  }

  stateClass(item: MainMenuLeftPrimaryItem, itemId: string): string {
    const hasForcedState = this.forceStates && Boolean(item.state);
    const state = hasForcedState
      ? item.state!
      : this.selectedKey === itemId
        ? "selected"
        : "default";
    return `ids-main-menu-left__primary-row--state-${toStateClass(state)}`;
  }

  onPrimaryClick(item: MainMenuLeftPrimaryItem, itemId: string): void {
    if (this.forceStates && item.state) return;
    const label = primaryDisplayName(item);
    const legacy = { href: item.href, routeRef: item.routeRef };
    const hasChildren = (item.children?.length ?? 0) > 0;

    this.selectedKeyChange.emit(itemId);
    this.navigate.emit(
      buildNavigateTarget(itemId, label, undefined, item.link, legacy),
    );
    this.selectedChange.emit(
      buildSelectionDetail("primary", itemId, undefined, label, item.link, legacy),
    );

    if (!hasChildren) {
      this.selectedSecondaryParentKeyChange.emit(null);
      this.selectedSecondaryKeyChange.emit(null);
      return;
    }
    if (!this.railExpanded) return;

    if (this.expandedChildrenKey === itemId) {
      this.expandedChildrenKeyChange.emit(null);
      this.selectedSecondaryParentKeyChange.emit(null);
      this.selectedSecondaryKeyChange.emit(null);
    } else {
      this.expandedChildrenKeyChange.emit(itemId);
    }
  }

  onSecondaryClick(
    itemId: string,
    child: NonNullable<MainMenuLeftPrimaryItem["children"]>[number],
    childId: string,
  ): void {
    const label = secondaryDisplayName(child);
    const legacy = { href: child.href, routeRef: child.routeRef };
    this.selectedSecondaryParentKeyChange.emit(itemId);
    this.selectedSecondaryKeyChange.emit(childId);
    this.navigate.emit(buildNavigateTarget(childId, label, itemId, child.link, legacy));
    this.selectedChange.emit(
      buildSelectionDetail("secondary", childId, itemId, label, child.link, legacy),
    );
  }
}
