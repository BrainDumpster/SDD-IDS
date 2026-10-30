var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { IdsIconComponent } from "../../../../storybook-angular/src/components/ids-icon/ids-icon.component";
import { IdsTooltipBodyComponent, IdsTooltipComponent, IdsTooltipTitleComponent, } from "../../../../storybook-angular/src/components/ids-tooltip/ids-tooltip.imports";
let IdsDualListBoxListsParentComponent = class IdsDualListBoxListsParentComponent {
};
IdsDualListBoxListsParentComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-lists-parent",
        standalone: true,
        template: `<div class="ids-dual-list-box__lists-parent"><ng-content /></div>`,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxListsParentComponent);
export { IdsDualListBoxListsParentComponent };
let IdsDualListBoxAvailablePaneComponent = class IdsDualListBoxAvailablePaneComponent {
};
IdsDualListBoxAvailablePaneComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-available-pane",
        standalone: true,
        template: `<div class="ids-dual-list-box__pane ids-dual-list-box__pane--available"><ng-content /></div>`,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxAvailablePaneComponent);
export { IdsDualListBoxAvailablePaneComponent };
let IdsDualListBoxSelectedPaneComponent = class IdsDualListBoxSelectedPaneComponent {
};
IdsDualListBoxSelectedPaneComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-selected-pane",
        standalone: true,
        template: `<div class="ids-dual-list-box__pane ids-dual-list-box__pane--selected"><ng-content /></div>`,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxSelectedPaneComponent);
export { IdsDualListBoxSelectedPaneComponent };
let IdsDualListBoxAvailablePaneHeaderComponent = class IdsDualListBoxAvailablePaneHeaderComponent {
    title;
};
__decorate([
    Input({ required: true })
], IdsDualListBoxAvailablePaneHeaderComponent.prototype, "title", void 0);
IdsDualListBoxAvailablePaneHeaderComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-available-pane-header",
        standalone: true,
        template: `
    <div class="ids-dual-list-box__pane-header ids-dual-list-box__pane-header--available">
      <h3 class="ids-dual-list-box__pane-title">{{ title }}</h3>
      <ng-content />
    </div>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxAvailablePaneHeaderComponent);
export { IdsDualListBoxAvailablePaneHeaderComponent };
let IdsDualListBoxSelectedPaneHeaderComponent = class IdsDualListBoxSelectedPaneHeaderComponent {
    title;
};
__decorate([
    Input({ required: true })
], IdsDualListBoxSelectedPaneHeaderComponent.prototype, "title", void 0);
IdsDualListBoxSelectedPaneHeaderComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-selected-pane-header",
        standalone: true,
        template: `
    <div class="ids-dual-list-box__pane-header ids-dual-list-box__pane-header--selected">
      <h3 class="ids-dual-list-box__pane-title">{{ title }}</h3>
      <ng-content />
    </div>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxSelectedPaneHeaderComponent);
export { IdsDualListBoxSelectedPaneHeaderComponent };
let IdsDualListBoxAvailableMetricsComponent = class IdsDualListBoxAvailableMetricsComponent {
    showMetrics = true;
    metricsFormat = "total";
    totalCount = 0;
    selectedCount = 0;
};
__decorate([
    Input()
], IdsDualListBoxAvailableMetricsComponent.prototype, "showMetrics", void 0);
__decorate([
    Input()
], IdsDualListBoxAvailableMetricsComponent.prototype, "metricsFormat", void 0);
__decorate([
    Input()
], IdsDualListBoxAvailableMetricsComponent.prototype, "totalCount", void 0);
__decorate([
    Input()
], IdsDualListBoxAvailableMetricsComponent.prototype, "selectedCount", void 0);
IdsDualListBoxAvailableMetricsComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-available-metrics",
        standalone: true,
        imports: [CommonModule],
        template: `
    @if (showMetrics) {
      <p class="ids-dual-list-box__metrics" aria-live="polite">
        @if (metricsFormat === "total-and-selected" && selectedCount > 0) {
          <span class="ids-dual-list-box__metrics-selected">Selected: {{ selectedCount }}</span>
          <span class="ids-dual-list-box__metrics-divider" aria-hidden>|</span>
        }
        <span class="ids-dual-list-box__metrics-total">
          Total: <span class="ids-dual-list-box__metrics-total-value">{{ totalCount }}</span>
        </span>
      </p>
    }
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxAvailableMetricsComponent);
export { IdsDualListBoxAvailableMetricsComponent };
let IdsDualListBoxSelectedMetricsComponent = class IdsDualListBoxSelectedMetricsComponent {
    showMetrics = true;
    metricsFormat = "total";
    totalCount = 0;
    selectedCount = 0;
};
__decorate([
    Input()
], IdsDualListBoxSelectedMetricsComponent.prototype, "showMetrics", void 0);
__decorate([
    Input()
], IdsDualListBoxSelectedMetricsComponent.prototype, "metricsFormat", void 0);
__decorate([
    Input()
], IdsDualListBoxSelectedMetricsComponent.prototype, "totalCount", void 0);
__decorate([
    Input()
], IdsDualListBoxSelectedMetricsComponent.prototype, "selectedCount", void 0);
IdsDualListBoxSelectedMetricsComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-selected-metrics",
        standalone: true,
        imports: [CommonModule],
        template: `
    @if (showMetrics) {
      <p class="ids-dual-list-box__metrics" aria-live="polite">
        @if (metricsFormat === "total-and-selected" && selectedCount > 0) {
          <span class="ids-dual-list-box__metrics-selected">Selected: {{ selectedCount }}</span>
          <span class="ids-dual-list-box__metrics-divider" aria-hidden>|</span>
        }
        <span class="ids-dual-list-box__metrics-total">
          Total: <span class="ids-dual-list-box__metrics-total-value">{{ totalCount }}</span>
        </span>
      </p>
    }
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxSelectedMetricsComponent);
export { IdsDualListBoxSelectedMetricsComponent };
let IdsDualListBoxAvailableListGroupComponent = class IdsDualListBoxAvailableListGroupComponent {
    empty = false;
    dragOver = false;
    placeholder;
    ariaLabel;
    dragOverEvent = new EventEmitter();
    dropEvent = new EventEmitter();
    dragLeaveEvent = new EventEmitter();
    listKeydown = new EventEmitter();
    listFocus = new EventEmitter();
};
__decorate([
    Input()
], IdsDualListBoxAvailableListGroupComponent.prototype, "empty", void 0);
__decorate([
    Input()
], IdsDualListBoxAvailableListGroupComponent.prototype, "dragOver", void 0);
__decorate([
    Input({ required: true })
], IdsDualListBoxAvailableListGroupComponent.prototype, "placeholder", void 0);
__decorate([
    Input({ required: true })
], IdsDualListBoxAvailableListGroupComponent.prototype, "ariaLabel", void 0);
__decorate([
    Output()
], IdsDualListBoxAvailableListGroupComponent.prototype, "dragOverEvent", void 0);
__decorate([
    Output()
], IdsDualListBoxAvailableListGroupComponent.prototype, "dropEvent", void 0);
__decorate([
    Output()
], IdsDualListBoxAvailableListGroupComponent.prototype, "dragLeaveEvent", void 0);
__decorate([
    Output()
], IdsDualListBoxAvailableListGroupComponent.prototype, "listKeydown", void 0);
__decorate([
    Output()
], IdsDualListBoxAvailableListGroupComponent.prototype, "listFocus", void 0);
IdsDualListBoxAvailableListGroupComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-available-list-group",
        standalone: true,
        imports: [CommonModule],
        template: `
    <div
      class="ids-dual-list-box__list-group ids-dual-list-box__list-group--available"
      [class.ids-dual-list-box__list-group--empty]="empty"
      [class.ids-dual-list-box__list-group--drag-over]="dragOver"
      role="listbox"
      [attr.aria-label]="ariaLabel"
      aria-multiselectable="true"
      (dragover)="dragOverEvent.emit($event)"
      (drop)="dropEvent.emit($event)"
      (dragleave)="dragLeaveEvent.emit($event)"
    >
      @if (empty) {
        <p class="ids-dual-list-box__empty-status" role="status" aria-live="polite">
          {{ placeholder }}
        </p>
      } @else {
        <div
          class="ids-dual-list-box__list-scroll"
          tabindex="0"
          (keydown)="listKeydown.emit($event)"
          (focus)="listFocus.emit($event)"
        >
          <ng-content />
        </div>
      }
    </div>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxAvailableListGroupComponent);
export { IdsDualListBoxAvailableListGroupComponent };
let IdsDualListBoxSelectedListGroupComponent = class IdsDualListBoxSelectedListGroupComponent {
    empty = false;
    dragOver = false;
    placeholder;
    ariaLabel;
    dragOverEvent = new EventEmitter();
    dropEvent = new EventEmitter();
    dragLeaveEvent = new EventEmitter();
    listKeydown = new EventEmitter();
    listFocus = new EventEmitter();
};
__decorate([
    Input()
], IdsDualListBoxSelectedListGroupComponent.prototype, "empty", void 0);
__decorate([
    Input()
], IdsDualListBoxSelectedListGroupComponent.prototype, "dragOver", void 0);
__decorate([
    Input({ required: true })
], IdsDualListBoxSelectedListGroupComponent.prototype, "placeholder", void 0);
__decorate([
    Input({ required: true })
], IdsDualListBoxSelectedListGroupComponent.prototype, "ariaLabel", void 0);
__decorate([
    Output()
], IdsDualListBoxSelectedListGroupComponent.prototype, "dragOverEvent", void 0);
__decorate([
    Output()
], IdsDualListBoxSelectedListGroupComponent.prototype, "dropEvent", void 0);
__decorate([
    Output()
], IdsDualListBoxSelectedListGroupComponent.prototype, "dragLeaveEvent", void 0);
__decorate([
    Output()
], IdsDualListBoxSelectedListGroupComponent.prototype, "listKeydown", void 0);
__decorate([
    Output()
], IdsDualListBoxSelectedListGroupComponent.prototype, "listFocus", void 0);
IdsDualListBoxSelectedListGroupComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-selected-list-group",
        standalone: true,
        imports: [CommonModule],
        template: `
    <div
      class="ids-dual-list-box__list-group ids-dual-list-box__list-group--selected"
      [class.ids-dual-list-box__list-group--empty]="empty"
      [class.ids-dual-list-box__list-group--drag-over]="dragOver"
      role="listbox"
      [attr.aria-label]="ariaLabel"
      aria-multiselectable="true"
      (dragover)="dragOverEvent.emit($event)"
      (drop)="dropEvent.emit($event)"
      (dragleave)="dragLeaveEvent.emit($event)"
    >
      @if (empty) {
        <p class="ids-dual-list-box__empty-status" role="status" aria-live="polite">
          {{ placeholder }}
        </p>
      } @else {
        <div
          class="ids-dual-list-box__list-scroll"
          tabindex="0"
          (keydown)="listKeydown.emit($event)"
          (focus)="listFocus.emit($event)"
        >
          <ng-content />
        </div>
      }
    </div>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxSelectedListGroupComponent);
export { IdsDualListBoxSelectedListGroupComponent };
let IdsDualListBoxTransferButtonGroupComponent = class IdsDualListBoxTransferButtonGroupComponent {
};
IdsDualListBoxTransferButtonGroupComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-transfer-button-group",
        standalone: true,
        template: `
    <div class="ids-dual-list-box__transfer-button-group" role="toolbar" aria-label="Transfer actions">
      <ng-content />
    </div>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxTransferButtonGroupComponent);
export { IdsDualListBoxTransferButtonGroupComponent };
let IdsDualListBoxTransferButtonComponent = class IdsDualListBoxTransferButtonComponent {
    icon;
    label;
    enabled = false;
    pressed = new EventEmitter();
    onKeydown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (this.enabled) {
                this.pressed.emit();
            }
        }
    }
};
__decorate([
    Input({ required: true })
], IdsDualListBoxTransferButtonComponent.prototype, "icon", void 0);
__decorate([
    Input({ required: true })
], IdsDualListBoxTransferButtonComponent.prototype, "label", void 0);
__decorate([
    Input()
], IdsDualListBoxTransferButtonComponent.prototype, "enabled", void 0);
__decorate([
    Output()
], IdsDualListBoxTransferButtonComponent.prototype, "pressed", void 0);
IdsDualListBoxTransferButtonComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-move-all-right, ids-dual-list-box-move-selected-right, ids-dual-list-box-move-selected-left, ids-dual-list-box-move-all-left",
        standalone: true,
        imports: [IdsIconComponent],
        template: `
    <button
      type="button"
      class="ids-dual-list-box__transfer-button"
      [class.ids-dual-list-box__transfer-button--default]="enabled"
      [class.ids-dual-list-box__transfer-button--disabled]="!enabled"
      [disabled]="!enabled"
      [title]="label"
      [attr.aria-label]="label"
      [attr.aria-disabled]="!enabled"
      (click)="pressed.emit()"
      (keydown)="onKeydown($event)"
    >
      <ids-icon
        className="ids-dual-list-box__transfer-icon"
        [shapeName]="icon"
        variant="mask"
        [size]="16"
      />
    </button>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxTransferButtonComponent);
export { IdsDualListBoxTransferButtonComponent };
let IdsDualListBoxListItemComponent = class IdsDualListBoxListItemComponent {
    item;
    pane;
    itemId;
    selected = false;
    focused = false;
    dragging = false;
    dragWithSelection = false;
    dragEnabled = true;
    showCheck = false;
    showDropBefore = false;
    showDropAfter = false;
    tooltipSide = "top";
    tooltipArrowAlign = "center";
    toggle = new EventEmitter();
    focusedChange = new EventEmitter();
    dragStart = new EventEmitter();
    dragEnd = new EventEmitter();
    dragOverItem = new EventEmitter();
    dropOnItem = new EventEmitter();
    get hasTooltip() {
        return Boolean(this.item.tooltipTitle || this.item.tooltipDescription);
    }
    get tooltipBody() {
        return this.item.tooltipDescription || this.item.tooltipTitle || this.item.name;
    }
    onRowKeydown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this.toggle.emit();
        }
    }
};
__decorate([
    Input({ required: true })
], IdsDualListBoxListItemComponent.prototype, "item", void 0);
__decorate([
    Input({ required: true })
], IdsDualListBoxListItemComponent.prototype, "pane", void 0);
__decorate([
    Input({ required: true })
], IdsDualListBoxListItemComponent.prototype, "itemId", void 0);
__decorate([
    Input()
], IdsDualListBoxListItemComponent.prototype, "selected", void 0);
__decorate([
    Input()
], IdsDualListBoxListItemComponent.prototype, "focused", void 0);
__decorate([
    Input()
], IdsDualListBoxListItemComponent.prototype, "dragging", void 0);
__decorate([
    Input()
], IdsDualListBoxListItemComponent.prototype, "dragWithSelection", void 0);
__decorate([
    Input()
], IdsDualListBoxListItemComponent.prototype, "dragEnabled", void 0);
__decorate([
    Input()
], IdsDualListBoxListItemComponent.prototype, "showCheck", void 0);
__decorate([
    Input()
], IdsDualListBoxListItemComponent.prototype, "showDropBefore", void 0);
__decorate([
    Input()
], IdsDualListBoxListItemComponent.prototype, "showDropAfter", void 0);
__decorate([
    Input()
], IdsDualListBoxListItemComponent.prototype, "tooltipSide", void 0);
__decorate([
    Input()
], IdsDualListBoxListItemComponent.prototype, "tooltipArrowAlign", void 0);
__decorate([
    Output()
], IdsDualListBoxListItemComponent.prototype, "toggle", void 0);
__decorate([
    Output()
], IdsDualListBoxListItemComponent.prototype, "focusedChange", void 0);
__decorate([
    Output()
], IdsDualListBoxListItemComponent.prototype, "dragStart", void 0);
__decorate([
    Output()
], IdsDualListBoxListItemComponent.prototype, "dragEnd", void 0);
__decorate([
    Output()
], IdsDualListBoxListItemComponent.prototype, "dragOverItem", void 0);
__decorate([
    Output()
], IdsDualListBoxListItemComponent.prototype, "dropOnItem", void 0);
IdsDualListBoxListItemComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-list-item",
        standalone: true,
        imports: [
            CommonModule,
            IdsTooltipComponent,
            IdsTooltipTitleComponent,
            IdsTooltipBodyComponent,
            IdsDualListBoxDragHandleComponent,
            IdsDualListBoxItemContentComponent,
            IdsDualListBoxSelectionCheckComponent,
        ],
        template: `
    <div class="ids-dual-list-box__list-item-wrap">
      @if (showDropBefore) {
        <div class="ids-dual-list-box__drop-preview" aria-hidden="true">
          <span class="ids-dual-list-box__drop-preview-inner"></span>
        </div>
      }

      @if (hasTooltip) {
        <ids-tooltip
          [side]="tooltipSide"
          [arrowAlign]="tooltipArrowAlign"
          [closable]="false"
          triggerDisplay="block"
        >
          <ng-container *ngTemplateOutlet="rowTemplate"></ng-container>
          @if (item.tooltipTitle) {
            <ids-tooltip-title>{{ item.tooltipTitle }}</ids-tooltip-title>
          }
          <ids-tooltip-body>{{ tooltipBody }}</ids-tooltip-body>
        </ids-tooltip>
      } @else {
        <ng-container *ngTemplateOutlet="rowTemplate"></ng-container>
      }

      @if (showDropAfter) {
        <div class="ids-dual-list-box__drop-preview" aria-hidden="true">
          <span class="ids-dual-list-box__drop-preview-inner"></span>
        </div>
      }

      <ng-template #rowTemplate>
        <div
          class="ids-dual-list-box__list-item"
          [class.ids-dual-list-box__list-item--selected]="selected && !dragging"
          [class.ids-dual-list-box__list-item--focused]="focused"
          [class.ids-dual-list-box__list-item--drag-with-selection]="dragging && dragWithSelection"
          [class.ids-dual-list-box__list-item--drag-without-selection]="dragging && !dragWithSelection"
          [class.ids-dual-list-box__list-item--dragging]="dragging"
          [id]="itemId"
          role="option"
          [attr.aria-selected]="selected"
          [attr.aria-grabbed]="dragging"
          [tabIndex]="focused ? 0 : -1"
          (click)="toggle.emit()"
          (focus)="focusedChange.emit()"
          (keydown)="onRowKeydown($event)"
          (dragover)="dragOverItem.emit($event)"
          (drop)="dropOnItem.emit($event)"
        >
          <div class="ids-dual-list-box__item-main">
            <ids-dual-list-box-drag-handle
              [dragEnabled]="dragEnabled"
              [itemName]="item.name"
              [selected]="selected || dragging"
              (handleDragStart)="dragStart.emit($event)"
              (handleDragEnd)="dragEnd.emit()"
            />
            <ids-dual-list-box-item-content [item]="item" />
          </div>
          @if (showCheck) {
            <ids-dual-list-box-selection-check />
          }
        </div>
      </ng-template>
    </div>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxListItemComponent);
export { IdsDualListBoxListItemComponent };
let IdsDualListBoxDragHandleComponent = class IdsDualListBoxDragHandleComponent {
    dragEnabled = true;
    itemName;
    selected = false;
    handleDragStart = new EventEmitter();
    handleDragEnd = new EventEmitter();
    stop(event) {
        event.stopPropagation();
    }
};
__decorate([
    Input()
], IdsDualListBoxDragHandleComponent.prototype, "dragEnabled", void 0);
__decorate([
    Input({ required: true })
], IdsDualListBoxDragHandleComponent.prototype, "itemName", void 0);
__decorate([
    Input()
], IdsDualListBoxDragHandleComponent.prototype, "selected", void 0);
__decorate([
    Output()
], IdsDualListBoxDragHandleComponent.prototype, "handleDragStart", void 0);
__decorate([
    Output()
], IdsDualListBoxDragHandleComponent.prototype, "handleDragEnd", void 0);
IdsDualListBoxDragHandleComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-drag-handle",
        standalone: true,
        imports: [IdsIconComponent],
        template: `
    <span
      class="ids-dual-list-box__drag-handle"
      [draggable]="dragEnabled"
      [attr.aria-label]="'Drag ' + itemName"
      (dragstart)="handleDragStart.emit($event)"
      (dragend)="handleDragEnd.emit()"
      (click)="stop($event)"
      (mousedown)="stop($event)"
    >
      <ids-icon
        className="ids-dual-list-box__drag-icon"
        shapeName="arrow-arrange"
        variant="mask"
        [size]="16"
      />
    </span>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxDragHandleComponent);
export { IdsDualListBoxDragHandleComponent };
let IdsDualListBoxItemContentComponent = class IdsDualListBoxItemContentComponent {
    item;
};
__decorate([
    Input({ required: true })
], IdsDualListBoxItemContentComponent.prototype, "item", void 0);
IdsDualListBoxItemContentComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-item-content",
        standalone: true,
        template: `
    <span class="ids-dual-list-box__item-content">
      <span class="ids-dual-list-box__item-name">{{ item.name }}</span>
      @if (item.description) {
        <span class="ids-dual-list-box__item-description">{{ item.description }}</span>
      }
    </span>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxItemContentComponent);
export { IdsDualListBoxItemContentComponent };
let IdsDualListBoxSelectionCheckComponent = class IdsDualListBoxSelectionCheckComponent {
};
IdsDualListBoxSelectionCheckComponent = __decorate([
    Component({
        selector: "ids-dual-list-box-selection-check",
        standalone: true,
        imports: [IdsIconComponent],
        template: `
    <span class="ids-dual-list-box__item-check" aria-hidden="true">
      <ids-icon
        className="ids-dual-list-box__selection-check-icon"
        shapeName="shape-check-thick"
        variant="mask"
        [size]="16"
      />
    </span>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDualListBoxSelectionCheckComponent);
export { IdsDualListBoxSelectionCheckComponent };
