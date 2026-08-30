var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DUAL_LIST_BOX_DEFAULTS, } from "@component-contracts/ids/dual-list-box.contract";
import { IdsDualListBoxAvailableListGroupComponent, IdsDualListBoxAvailableMetricsComponent, IdsDualListBoxAvailablePaneComponent, IdsDualListBoxAvailablePaneHeaderComponent, IdsDualListBoxListItemComponent, IdsDualListBoxListsParentComponent, IdsDualListBoxSelectedListGroupComponent, IdsDualListBoxSelectedMetricsComponent, IdsDualListBoxSelectedPaneComponent, IdsDualListBoxSelectedPaneHeaderComponent, IdsDualListBoxTransferButtonComponent, IdsDualListBoxTransferButtonGroupComponent, } from "./ids-dual-list-box-slots.component";
let IdsDualListBoxComponent = class IdsDualListBoxComponent {
    cdr;
    availableItems = [];
    selectedItems = [];
    availableTitle = DUAL_LIST_BOX_DEFAULTS.availableTitle;
    selectedTitle = DUAL_LIST_BOX_DEFAULTS.selectedTitle;
    availablePlaceholder = DUAL_LIST_BOX_DEFAULTS.availablePlaceholder;
    selectedPlaceholder = DUAL_LIST_BOX_DEFAULTS.selectedPlaceholder;
    moveSelectedRightTitle = DUAL_LIST_BOX_DEFAULTS.moveSelectedRightTitle;
    moveSelectedLeftTitle = DUAL_LIST_BOX_DEFAULTS.moveSelectedLeftTitle;
    moveAllRightTitle;
    moveAllLeftTitle;
    availableSelection = [];
    selectedSelection = [];
    showMetrics = DUAL_LIST_BOX_DEFAULTS.showMetrics;
    metricsFormat = DUAL_LIST_BOX_DEFAULTS.metricsFormat;
    enableDragDrop = DUAL_LIST_BOX_DEFAULTS.enableDragDrop;
    itemTooltipSide = DUAL_LIST_BOX_DEFAULTS.itemTooltipSide;
    itemTooltipArrowAlign = DUAL_LIST_BOX_DEFAULTS.itemTooltipArrowAlign;
    ariaLabel = DUAL_LIST_BOX_DEFAULTS.ariaLabel;
    availableSelectionChange = new EventEmitter();
    selectedSelectionChange = new EventEmitter();
    itemsChange = new EventEmitter();
    transfer = new EventEmitter();
    dragDrop = new EventEmitter();
    internalAvailableItems = [];
    internalSelectedItems = [];
    internalAvailableSelection = [];
    internalSelectedSelection = [];
    dragSession = null;
    dropIndicator = null;
    focusedItemKey = null;
    constructor(cdr) {
        this.cdr = cdr;
    }
    ngOnChanges(changes) {
        if (changes["availableItems"]) {
            this.internalAvailableItems = [...this.availableItems];
            this.internalAvailableSelection = this.internalAvailableSelection.filter((id) => this.internalAvailableItems.some((item) => item.id === id));
        }
        if (changes["selectedItems"]) {
            this.internalSelectedItems = [...this.selectedItems];
            this.internalSelectedSelection = this.internalSelectedSelection.filter((id) => this.internalSelectedItems.some((item) => item.id === id));
        }
        if (changes["availableSelection"]) {
            this.internalAvailableSelection = [...(this.availableSelection ?? [])];
        }
        if (changes["selectedSelection"]) {
            this.internalSelectedSelection = [...(this.selectedSelection ?? [])];
        }
        this.cdr.markForCheck();
    }
    get availableIsEmpty() {
        return this.internalAvailableItems.length === 0;
    }
    get selectedIsEmpty() {
        return this.internalSelectedItems.length === 0;
    }
    get transferLabels() {
        return {
            moveAllRight: this.moveAllRightTitle ?? `Add all from ${this.availableTitle}`,
            moveSelectedRight: this.moveSelectedRightTitle,
            moveSelectedLeft: this.moveSelectedLeftTitle,
            moveAllLeft: this.moveAllLeftTitle ?? `Remove all from ${this.selectedTitle}`,
        };
    }
    transferState(action) {
        return this.resolveTransferStates()[action];
    }
    toggleAvailable(id) {
        this.internalAvailableSelection = this.toggleSelection(this.internalAvailableSelection, id);
        this.availableSelectionChange.emit([...this.internalAvailableSelection]);
        this.cdr.markForCheck();
    }
    toggleSelected(id) {
        this.internalSelectedSelection = this.toggleSelection(this.internalSelectedSelection, id);
        this.selectedSelectionChange.emit([...this.internalSelectedSelection]);
        this.cdr.markForCheck();
    }
    runTransfer(action) {
        if (this.transferState(action) !== "default") {
            return;
        }
        let movedIds = [];
        let nextAvailable = [...this.internalAvailableItems];
        let nextSelected = [...this.internalSelectedItems];
        const moveByIds = (ids, from, to) => {
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
                const result = moveByIds(this.internalAvailableSelection, nextAvailable, nextSelected);
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
    focusItem(pane, id) {
        this.focusedItemKey = this.itemFocusKey(pane, id);
        requestAnimationFrame(() => {
            document.getElementById(this.domItemId(pane, id))?.focus();
        });
    }
    onListKeydown(event, pane) {
        const items = pane === "available" ? this.internalAvailableItems : this.internalSelectedItems;
        if (!items.length) {
            return;
        }
        const currentIndex = items.findIndex((item) => this.focusedItemKey === this.itemFocusKey(pane, item.id));
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
                }
                else {
                    this.internalSelectedSelection = [];
                    this.selectedSelectionChange.emit([]);
                }
                this.cdr.markForCheck();
                break;
            default:
                break;
        }
    }
    onListFocus(event, pane) {
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
    onHandleDragStart(event, pane, itemId, selected) {
        if (!this.enableDragDrop || !event.dataTransfer) {
            return;
        }
        event.stopPropagation();
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", itemId);
        this.dragSession = { itemId, sourcePane: pane, hadSelection: selected };
        this.cdr.markForCheck();
    }
    onHandleDragEnd() {
        this.clearDrag();
    }
    onPaneDragOver(event) {
        if (!this.enableDragDrop || !this.dragSession) {
            return;
        }
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "move";
        }
    }
    onPaneDragLeave(event, pane) {
        const relatedTarget = event.relatedTarget;
        if (event.currentTarget?.contains(relatedTarget)) {
            return;
        }
        if (this.dropIndicator?.pane === pane) {
            this.dropIndicator = null;
            this.cdr.markForCheck();
        }
    }
    onPaneDrop(event, pane) {
        event.preventDefault();
        if (!this.enableDragDrop || !this.dragSession) {
            return;
        }
        if (this.dropIndicator?.pane === pane && this.dropIndicator.targetItemId) {
            this.applyDragDrop(this.dragSession, pane, this.dropIndicator.targetItemId, this.dropIndicator.position);
        }
        else {
            this.applyDragDrop(this.dragSession, pane, null, "after");
        }
        this.clearDrag();
    }
    onItemDragOver(event, pane, itemId) {
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
    onItemDrop(event, pane, itemId) {
        event.preventDefault();
        event.stopPropagation();
        if (!this.enableDragDrop || !this.dragSession) {
            return;
        }
        this.applyDragDrop(this.dragSession, pane, itemId, this.resolveDropPosition(event));
        this.clearDrag();
    }
    isItemSelected(pane, id) {
        return pane === "available"
            ? this.internalAvailableSelection.includes(id)
            : this.internalSelectedSelection.includes(id);
    }
    isItemFocused(pane, id) {
        return this.focusedItemKey === this.itemFocusKey(pane, id);
    }
    isItemDragging(id) {
        return this.dragSession?.itemId === id;
    }
    isDragWithSelection(id) {
        return this.dragSession?.itemId === id && this.dragSession.hadSelection;
    }
    showDropBefore(pane, itemId) {
        return this.dropIndicator?.pane === pane
            && this.dropIndicator.targetItemId === itemId
            && this.dropIndicator.position === "before";
    }
    showDropAfter(pane, itemId) {
        return this.dropIndicator?.pane === pane
            && this.dropIndicator.targetItemId === itemId
            && this.dropIndicator.position === "after";
    }
    paneDragOver(pane) {
        return this.enableDragDrop
            && this.dragSession !== null
            && ((pane === "available" ? this.availableIsEmpty : this.selectedIsEmpty)
                || this.dropIndicator?.pane === pane);
    }
    itemDomId(pane, id) {
        return this.domItemId(pane, id);
    }
    applyItemsChange(available, selected) {
        this.internalAvailableItems = available;
        this.internalSelectedItems = selected;
        this.itemsChange.emit({ available, selected });
        this.cdr.markForCheck();
    }
    applyDragDrop(session, targetPane, targetItemId, position) {
        const sourceItems = session.sourcePane === "available" ? this.internalAvailableItems : this.internalSelectedItems;
        const draggedItem = sourceItems.find((item) => item.id === session.itemId);
        if (!draggedItem) {
            return;
        }
        let nextAvailable = [...this.internalAvailableItems];
        let nextSelected = [...this.internalSelectedItems];
        const resolveInsertIndex = (list) => {
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
            }
            else {
                nextSelected = list;
            }
        }
        else {
            nextAvailable = nextAvailable.filter((item) => item.id !== session.itemId);
            nextSelected = nextSelected.filter((item) => item.id !== session.itemId);
            const targetList = targetPane === "available" ? nextAvailable : nextSelected;
            const insertIndex = resolveInsertIndex(targetList);
            targetList.splice(insertIndex, 0, draggedItem);
            if (targetPane === "available") {
                this.internalSelectedSelection = this.internalSelectedSelection.filter((id) => id !== session.itemId);
                this.selectedSelectionChange.emit([...this.internalSelectedSelection]);
            }
            else {
                this.internalAvailableSelection = this.internalAvailableSelection.filter((id) => id !== session.itemId);
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
    resolveTransferStates() {
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
    resolveDropPosition(event) {
        const element = event.currentTarget;
        const rect = element.getBoundingClientRect();
        return event.clientY < rect.top + rect.height / 2 ? "before" : "after";
    }
    toggleSelection(selection, id) {
        return selection.includes(id)
            ? selection.filter((entry) => entry !== id)
            : [...selection, id];
    }
    clearDrag() {
        this.dragSession = null;
        this.dropIndicator = null;
        this.cdr.markForCheck();
    }
    itemFocusKey(pane, id) {
        return `${pane}:${id}`;
    }
    domItemId(pane, id) {
        return `ids-dual-list-box-item-${pane}-${id}`;
    }
};
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "availableItems", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "selectedItems", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "availableTitle", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "selectedTitle", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "availablePlaceholder", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "selectedPlaceholder", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "moveSelectedRightTitle", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "moveSelectedLeftTitle", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "moveAllRightTitle", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "moveAllLeftTitle", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "availableSelection", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "selectedSelection", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "showMetrics", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "metricsFormat", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "enableDragDrop", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "itemTooltipSide", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "itemTooltipArrowAlign", void 0);
__decorate([
    Input()
], IdsDualListBoxComponent.prototype, "ariaLabel", void 0);
__decorate([
    Output()
], IdsDualListBoxComponent.prototype, "availableSelectionChange", void 0);
__decorate([
    Output()
], IdsDualListBoxComponent.prototype, "selectedSelectionChange", void 0);
__decorate([
    Output()
], IdsDualListBoxComponent.prototype, "itemsChange", void 0);
__decorate([
    Output()
], IdsDualListBoxComponent.prototype, "transfer", void 0);
__decorate([
    Output()
], IdsDualListBoxComponent.prototype, "dragDrop", void 0);
IdsDualListBoxComponent = __decorate([
    Component({
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
], IdsDualListBoxComponent);
export { IdsDualListBoxComponent };
