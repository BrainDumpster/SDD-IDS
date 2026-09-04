import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DUAL_LIST_BOX_DEFAULTS,
  type DualListBoxDragDropDetail,
  type DualListBoxItem,
  type DualListBoxItemsChangeDetail,
  type DualListBoxMetricsFormat,
  type DualListBoxPane,
  type DualListBoxTooltipArrowAlign,
  type DualListBoxTooltipSide,
  type DualListBoxTransferAction,
  type DualListBoxTransferDetail,
} from "@component-contracts/ids/dual-list-box.contract";
import {
  IdsDualListBoxAvailableListGroupComponent,
  IdsDualListBoxAvailableMetricsComponent,
  IdsDualListBoxAvailablePaneComponent,
  IdsDualListBoxAvailablePaneHeaderComponent,
  IdsDualListBoxListItemComponent,
  IdsDualListBoxListsParentComponent,
  IdsDualListBoxSelectedListGroupComponent,
  IdsDualListBoxSelectedMetricsComponent,
  IdsDualListBoxSelectedPaneComponent,
  IdsDualListBoxSelectedPaneHeaderComponent,
  IdsDualListBoxTransferButtonComponent,
  IdsDualListBoxTransferButtonGroupComponent,
} from "./ids-dual-list-box-slots.component";

type TransferVisualState = "default" | "disabled";

type DragSession = {
  itemId: string;
  sourcePane: DualListBoxPane;
  hadSelection: boolean;
};

type DropIndicator = {
  pane: DualListBoxPane;
  targetItemId: string;
  position: "before" | "after";
};

@Component({
  selector: "ids-dual-list-box",
  standalone: true,
  imports: [
    CommonModule,
    IdsDualListBoxListsParentComponent,
    IdsDualListBoxAvailablePaneComponent,
    IdsDualListBoxAvailablePaneHeaderComponent,
    IdsDualListBoxAvailableMetricsComponent,
    IdsDualListBoxAvailableListGroupComponent,
    IdsDualListBoxTransferButtonGroupComponent,
    IdsDualListBoxTransferButtonComponent,
    IdsDualListBoxSelectedPaneComponent,
    IdsDualListBoxSelectedPaneHeaderComponent,
    IdsDualListBoxSelectedMetricsComponent,
    IdsDualListBoxSelectedListGroupComponent,
    IdsDualListBoxListItemComponent,
  ],
  templateUrl: "./ids-dual-list-box.component.html",
  styleUrl: "./ids-dual-list-box.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDualListBoxComponent implements OnChanges {
  @Input() availableItems: DualListBoxItem[] = [];
  @Input() selectedItems: DualListBoxItem[] = [];
  @Input() availableTitle = DUAL_LIST_BOX_DEFAULTS.availableTitle;
  @Input() selectedTitle = DUAL_LIST_BOX_DEFAULTS.selectedTitle;
  @Input() availablePlaceholder = DUAL_LIST_BOX_DEFAULTS.availablePlaceholder;
  @Input() selectedPlaceholder = DUAL_LIST_BOX_DEFAULTS.selectedPlaceholder;
  @Input() moveSelectedRightTitle = DUAL_LIST_BOX_DEFAULTS.moveSelectedRightTitle;
  @Input() moveSelectedLeftTitle = DUAL_LIST_BOX_DEFAULTS.moveSelectedLeftTitle;
  @Input() moveAllRightTitle?: string;
  @Input() moveAllLeftTitle?: string;
  @Input() availableSelection: string[] = [];
  @Input() selectedSelection: string[] = [];
  @Input() showMetrics = DUAL_LIST_BOX_DEFAULTS.showMetrics;
  @Input() metricsFormat: DualListBoxMetricsFormat = DUAL_LIST_BOX_DEFAULTS.metricsFormat;
  @Input() enableDragDrop = DUAL_LIST_BOX_DEFAULTS.enableDragDrop;
  @Input() itemTooltipSide: DualListBoxTooltipSide = DUAL_LIST_BOX_DEFAULTS.itemTooltipSide;
  @Input() itemTooltipArrowAlign: DualListBoxTooltipArrowAlign =
    DUAL_LIST_BOX_DEFAULTS.itemTooltipArrowAlign;
  @Input() ariaLabel = DUAL_LIST_BOX_DEFAULTS.ariaLabel;

  @Output() readonly availableSelectionChange = new EventEmitter<string[]>();
  @Output() readonly selectedSelectionChange = new EventEmitter<string[]>();
  @Output() readonly itemsChange = new EventEmitter<DualListBoxItemsChangeDetail>();
  @Output() readonly transfer = new EventEmitter<DualListBoxTransferDetail>();
  @Output() readonly dragDrop = new EventEmitter<DualListBoxDragDropDetail>();

  internalAvailableItems: DualListBoxItem[] = [];
  internalSelectedItems: DualListBoxItem[] = [];
  internalAvailableSelection: string[] = [];
  internalSelectedSelection: string[] = [];
  dragSession: DragSession | null = null;
  dropIndicator: DropIndicator | null = null;
  focusedItemKey: string | null = null;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["availableItems"]) {
      this.internalAvailableItems = [...this.availableItems];
      this.internalAvailableSelection = this.internalAvailableSelection.filter((id) =>
        this.internalAvailableItems.some((item) => item.id === id),
      );
    }
    if (changes["selectedItems"]) {
      this.internalSelectedItems = [...this.selectedItems];
      this.internalSelectedSelection = this.internalSelectedSelection.filter((id) =>
        this.internalSelectedItems.some((item) => item.id === id),
      );
    }
    if (changes["availableSelection"]) {
      this.internalAvailableSelection = [...(this.availableSelection ?? [])];
    }
    if (changes["selectedSelection"]) {
      this.internalSelectedSelection = [...(this.selectedSelection ?? [])];
    }
    this.cdr.markForCheck();
  }

  get availableIsEmpty(): boolean {
    return this.internalAvailableItems.length === 0;
  }

  get selectedIsEmpty(): boolean {
    return this.internalSelectedItems.length === 0;
  }

  get transferLabels(): Record<DualListBoxTransferAction, string> {
    return {
      moveAllRight: this.moveAllRightTitle ?? `Add all from ${this.availableTitle}`,
      moveSelectedRight: this.moveSelectedRightTitle,
      moveSelectedLeft: this.moveSelectedLeftTitle,
      moveAllLeft: this.moveAllLeftTitle ?? `Remove all from ${this.selectedTitle}`,
    };
  }

  transferState(action: DualListBoxTransferAction): TransferVisualState {
    return this.resolveTransferStates()[action];
  }

  toggleAvailable(id: string): void {
    this.internalAvailableSelection = this.toggleSelection(this.internalAvailableSelection, id);
    this.availableSelectionChange.emit([...this.internalAvailableSelection]);
    this.cdr.markForCheck();
  }

  toggleSelected(id: string): void {
    this.internalSelectedSelection = this.toggleSelection(this.internalSelectedSelection, id);
    this.selectedSelectionChange.emit([...this.internalSelectedSelection]);
    this.cdr.markForCheck();
  }

  runTransfer(action: DualListBoxTransferAction): void {
    if (this.transferState(action) !== "default") {
      return;
    }

    let movedIds: string[] = [];
    let nextAvailable = [...this.internalAvailableItems];
    let nextSelected = [...this.internalSelectedItems];

    const moveByIds = (ids: string[], from: DualListBoxItem[], to: DualListBoxItem[]) => {
      const idSet = new Set(ids);
      const moving = from.filter((item) => idSet.has(item.id));
      return {
        from: from.filter((item) => !idSet.has(item.id)),
        to: [...to, ...moving],
        moved: moving.map((item) => item.id),
      };
    };

    switch (action) {
      case "moveAllRight":
        movedIds = nextAvailable.map((item) => item.id);
        nextSelected = [...nextSelected, ...nextAvailable];
        nextAvailable = [];
        break;
      case "moveSelectedRight": {
        const result = moveByIds(
          this.internalAvailableSelection,
          nextAvailable,
          nextSelected,
        );
        nextAvailable = result.from;
        nextSelected = result.to;
        movedIds = result.moved;
        this.internalAvailableSelection = [];
        this.availableSelectionChange.emit([]);
        break;
      }
      case "moveSelectedLeft": {
        const result = moveByIds(this.internalSelectedSelection, nextSelected, nextAvailable);
        nextSelected = result.from;
        nextAvailable = result.to;
        movedIds = result.moved;
        this.internalSelectedSelection = [];
        this.selectedSelectionChange.emit([]);
        break;
      }
      case "moveAllLeft":
        movedIds = nextSelected.map((item) => item.id);
        nextAvailable = [...nextAvailable, ...nextSelected];
        nextSelected = [];
        break;
    }

    this.applyItemsChange(nextAvailable, nextSelected);
    this.transfer.emit({ action, movedIds });
  }

  focusItem(pane: DualListBoxPane, id: string): void {
    this.focusedItemKey = this.itemFocusKey(pane, id);
    requestAnimationFrame(() => {
      document.getElementById(this.domItemId(pane, id))?.focus();
    });
  }

  onListKeydown(event: KeyboardEvent, pane: DualListBoxPane): void {
    const items = pane === "available" ? this.internalAvailableItems : this.internalSelectedItems;
    if (!items.length) {
      return;
    }

    const currentIndex = items.findIndex(
      (item) => this.focusedItemKey === this.itemFocusKey(pane, item.id),
    );
    const index = currentIndex >= 0 ? currentIndex : 0;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.focusItem(pane, items[Math.min(index + 1, items.length - 1)].id);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.focusItem(pane, items[Math.max(index - 1, 0)].id);
        break;
      case "Home":
        event.preventDefault();
        this.focusItem(pane, items[0].id);
        break;
      case "End":
        event.preventDefault();
        this.focusItem(pane, items[items.length - 1].id);
        break;
      case "Escape":
        event.preventDefault();
        if (pane === "available") {
          this.internalAvailableSelection = [];
          this.availableSelectionChange.emit([]);
        } else {
          this.internalSelectedSelection = [];
          this.selectedSelectionChange.emit([]);
        }
        this.cdr.markForCheck();
        break;
      default:
        break;
    }
  }

  onListFocus(event: FocusEvent, pane: DualListBoxPane): void {
    if (event.target !== event.currentTarget) {
      return;
    }
    const items = pane === "available" ? this.internalAvailableItems : this.internalSelectedItems;
    if (!items[0]) {
      return;
    }
    if (!this.focusedItemKey?.startsWith(`${pane}:`)) {
      this.focusItem(pane, items[0].id);
    }
  }

  onHandleDragStart(event: DragEvent, pane: DualListBoxPane, itemId: string, selected: boolean): void {
    if (!this.enableDragDrop || !event.dataTransfer) {
      return;
    }
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", itemId);
    this.dragSession = { itemId, sourcePane: pane, hadSelection: selected };
    this.cdr.markForCheck();
  }

  onHandleDragEnd(): void {
    this.clearDrag();
  }

  onPaneDragOver(event: DragEvent): void {
    if (!this.enableDragDrop || !this.dragSession) {
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }

  onPaneDragLeave(event: DragEvent, pane: DualListBoxPane): void {
    const relatedTarget = event.relatedTarget as Node | null;
    if ((event.currentTarget as HTMLElement | null)?.contains(relatedTarget)) {
      return;
    }
    if (this.dropIndicator?.pane === pane) {
      this.dropIndicator = null;
      this.cdr.markForCheck();
    }
  }

  onPaneDrop(event: DragEvent, pane: DualListBoxPane): void {
    event.preventDefault();
    if (!this.enableDragDrop || !this.dragSession) {
      return;
    }
    if (this.dropIndicator?.pane === pane && this.dropIndicator.targetItemId) {
      this.applyDragDrop(
        this.dragSession,
        pane,
        this.dropIndicator.targetItemId,
        this.dropIndicator.position,
      );
    } else {
      this.applyDragDrop(this.dragSession, pane, null, "after");
    }
    this.clearDrag();
  }

  onItemDragOver(event: DragEvent, pane: DualListBoxPane, itemId: string): void {
    if (!this.enableDragDrop || !this.dragSession) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
    this.dropIndicator = {
      pane,
      targetItemId: itemId,
      position: this.resolveDropPosition(event),
    };
    this.cdr.markForCheck();
  }

  onItemDrop(event: DragEvent, pane: DualListBoxPane, itemId: string): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.enableDragDrop || !this.dragSession) {
      return;
    }
    this.applyDragDrop(this.dragSession, pane, itemId, this.resolveDropPosition(event));
    this.clearDrag();
  }

  isItemSelected(pane: DualListBoxPane, id: string): boolean {
    return pane === "available"
      ? this.internalAvailableSelection.includes(id)
      : this.internalSelectedSelection.includes(id);
  }

  isItemFocused(pane: DualListBoxPane, id: string): boolean {
    return this.focusedItemKey === this.itemFocusKey(pane, id);
  }

  isItemDragging(id: string): boolean {
    return this.dragSession?.itemId === id;
  }

  isDragWithSelection(id: string): boolean {
    return this.dragSession?.itemId === id && this.dragSession.hadSelection;
  }

  showDropBefore(pane: DualListBoxPane, itemId: string): boolean {
    return this.dropIndicator?.pane === pane
      && this.dropIndicator.targetItemId === itemId
      && this.dropIndicator.position === "before";
  }

  showDropAfter(pane: DualListBoxPane, itemId: string): boolean {
    return this.dropIndicator?.pane === pane
      && this.dropIndicator.targetItemId === itemId
      && this.dropIndicator.position === "after";
  }

  paneDragOver(pane: DualListBoxPane): boolean {
    return this.enableDragDrop
      && this.dragSession !== null
      && (
        (pane === "available" ? this.availableIsEmpty : this.selectedIsEmpty)
        || this.dropIndicator?.pane === pane
      );
  }

  itemDomId(pane: DualListBoxPane, id: string): string {
    return this.domItemId(pane, id);
  }

  private applyItemsChange(available: DualListBoxItem[], selected: DualListBoxItem[]): void {
    this.internalAvailableItems = available;
    this.internalSelectedItems = selected;
    this.itemsChange.emit({ available, selected });
    this.cdr.markForCheck();
  }

  private applyDragDrop(
    session: DragSession,
    targetPane: DualListBoxPane,
    targetItemId: string | null,
    position: "before" | "after",
  ): void {
    const sourceItems =
      session.sourcePane === "available" ? this.internalAvailableItems : this.internalSelectedItems;
    const draggedItem = sourceItems.find((item) => item.id === session.itemId);
    if (!draggedItem) {
      return;
    }

    let nextAvailable = [...this.internalAvailableItems];
    let nextSelected = [...this.internalSelectedItems];

    const resolveInsertIndex = (list: DualListBoxItem[]): number => {
      if (!targetItemId) {
        return list.length;
      }
      const targetIndex = list.findIndex((item) => item.id === targetItemId);
      if (targetIndex < 0) {
        return list.length;
      }
      return position === "after" ? targetIndex + 1 : targetIndex;
    };

    if (session.sourcePane === targetPane) {
      const list = targetPane === "available" ? [...nextAvailable] : [...nextSelected];
      const fromIndex = list.findIndex((item) => item.id === session.itemId);
      if (fromIndex < 0) {
        return;
      }
      let insertIndex = resolveInsertIndex(list);
      const [moved] = list.splice(fromIndex, 1);
      if (fromIndex < insertIndex) {
        insertIndex -= 1;
      }
      list.splice(insertIndex, 0, moved);
      if (targetPane === "available") {
        nextAvailable = list;
      } else {
        nextSelected = list;
      }
    } else {
      nextAvailable = nextAvailable.filter((item) => item.id !== session.itemId);
      nextSelected = nextSelected.filter((item) => item.id !== session.itemId);
      const targetList = targetPane === "available" ? nextAvailable : nextSelected;
      const insertIndex = resolveInsertIndex(targetList);
      targetList.splice(insertIndex, 0, draggedItem);
      if (targetPane === "available") {
        this.internalSelectedSelection = this.internalSelectedSelection.filter(
          (id) => id !== session.itemId,
        );
        this.selectedSelectionChange.emit([...this.internalSelectedSelection]);
      } else {
        this.internalAvailableSelection = this.internalAvailableSelection.filter(
          (id) => id !== session.itemId,
        );
        this.availableSelectionChange.emit([...this.internalAvailableSelection]);
      }
    }

    this.applyItemsChange(nextAvailable, nextSelected);

    const targetItems = targetPane === "available" ? nextAvailable : nextSelected;
    const toIndex = targetItems.findIndex((item) => item.id === session.itemId);
    this.dragDrop.emit({
      itemId: session.itemId,
      from: session.sourcePane,
      to: targetPane,
      toIndex: Math.max(0, toIndex),
    });
  }

  private resolveTransferStates(): Record<DualListBoxTransferAction, TransferVisualState> {
    const hasAvailable = this.internalAvailableItems.length > 0;
    const hasSelected = this.internalSelectedItems.length > 0;
    const hasAvailableSelection = this.internalAvailableSelection.length > 0;
    const hasSelectedSelection = this.internalSelectedSelection.length > 0;

    if (hasAvailableSelection || hasSelectedSelection) {
      return {
        moveAllRight: "disabled",
        moveSelectedRight: hasAvailableSelection ? "default" : "disabled",
        moveSelectedLeft: hasSelectedSelection ? "default" : "disabled",
        moveAllLeft: "disabled",
      };
    }
    if (!hasSelected) {
      return {
        moveAllRight: hasAvailable ? "default" : "disabled",
        moveSelectedRight: "disabled",
        moveSelectedLeft: "disabled",
        moveAllLeft: "disabled",
      };
    }
    if (!hasAvailable) {
      return {
        moveAllRight: "disabled",
        moveSelectedRight: "disabled",
        moveSelectedLeft: "disabled",
        moveAllLeft: hasSelected ? "default" : "disabled",
      };
    }
    return {
      moveAllRight: "default",
      moveSelectedRight: "disabled",
      moveSelectedLeft: "disabled",
      moveAllLeft: "default",
    };
  }

  private resolveDropPosition(event: DragEvent): "before" | "after" {
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    return event.clientY < rect.top + rect.height / 2 ? "before" : "after";
  }

  private toggleSelection(selection: string[], id: string): string[] {
    return selection.includes(id)
      ? selection.filter((entry) => entry !== id)
      : [...selection, id];
  }

  private clearDrag(): void {
    this.dragSession = null;
    this.dropIndicator = null;
    this.cdr.markForCheck();
  }

  private itemFocusKey(pane: DualListBoxPane, id: string): string {
    return `${pane}:${id}`;
  }

  private domItemId(pane: DualListBoxPane, id: string): string {
    return `ids-dual-list-box-item-${pane}-${id}`;
  }
}
