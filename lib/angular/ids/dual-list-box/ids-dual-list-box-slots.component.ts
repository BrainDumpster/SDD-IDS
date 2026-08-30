import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from "@angular/core";
import {
  type DualListBoxItem,
  type DualListBoxMetricsFormat,
  type DualListBoxPane,
  type DualListBoxTooltipArrowAlign,
  type DualListBoxTooltipSide,
} from "@component-contracts/ids/dual-list-box.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";
import {
  IdsTooltipArrowComponent,
  IdsTooltipBodyComponent,
  IdsTooltipComponent,
  IdsTooltipHeaderComponent,
  IdsTooltipPanelComponent,
  IdsTooltipTitleComponent,
  IdsTooltipTriggerComponent,
} from "../tooltip/index";

@Component({
  selector: "ids-dual-list-box-lists-parent",
  standalone: true,
  template: `<div class="ids-dual-list-box__lists-parent"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDualListBoxListsParentComponent {}

@Component({
  selector: "ids-dual-list-box-available-pane",
  standalone: true,
  template: `<div class="ids-dual-list-box__pane ids-dual-list-box__pane--available"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDualListBoxAvailablePaneComponent {}

@Component({
  selector: "ids-dual-list-box-selected-pane",
  standalone: true,
  template: `<div class="ids-dual-list-box__pane ids-dual-list-box__pane--selected"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDualListBoxSelectedPaneComponent {}

@Component({
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
export class IdsDualListBoxAvailablePaneHeaderComponent {
  @Input({ required: true }) title!: string;
}

@Component({
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
export class IdsDualListBoxSelectedPaneHeaderComponent {
  @Input({ required: true }) title!: string;
}

@Component({
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
export class IdsDualListBoxAvailableMetricsComponent {
  @Input() showMetrics = true;
  @Input() metricsFormat: DualListBoxMetricsFormat = "total";
  @Input() totalCount = 0;
  @Input() selectedCount = 0;
}

@Component({
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
export class IdsDualListBoxSelectedMetricsComponent {
  @Input() showMetrics = true;
  @Input() metricsFormat: DualListBoxMetricsFormat = "total";
  @Input() totalCount = 0;
  @Input() selectedCount = 0;
}

@Component({
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
export class IdsDualListBoxAvailableListGroupComponent {
  @Input() empty = false;
  @Input() dragOver = false;
  @Input({ required: true }) placeholder!: string;
  @Input({ required: true }) ariaLabel!: string;

  @Output() readonly dragOverEvent = new EventEmitter<DragEvent>();
  @Output() readonly dropEvent = new EventEmitter<DragEvent>();
  @Output() readonly dragLeaveEvent = new EventEmitter<DragEvent>();
  @Output() readonly listKeydown = new EventEmitter<KeyboardEvent>();
  @Output() readonly listFocus = new EventEmitter<FocusEvent>();
}

@Component({
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
export class IdsDualListBoxSelectedListGroupComponent {
  @Input() empty = false;
  @Input() dragOver = false;
  @Input({ required: true }) placeholder!: string;
  @Input({ required: true }) ariaLabel!: string;

  @Output() readonly dragOverEvent = new EventEmitter<DragEvent>();
  @Output() readonly dropEvent = new EventEmitter<DragEvent>();
  @Output() readonly dragLeaveEvent = new EventEmitter<DragEvent>();
  @Output() readonly listKeydown = new EventEmitter<KeyboardEvent>();
  @Output() readonly listFocus = new EventEmitter<FocusEvent>();
}

@Component({
  selector: "ids-dual-list-box-transfer-button-group",
  standalone: true,
  template: `
    <div class="ids-dual-list-box__transfer-button-group" role="toolbar" aria-label="Transfer actions">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDualListBoxTransferButtonGroupComponent {}

@Component({
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
export class IdsDualListBoxTransferButtonComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) label!: string;
  @Input() enabled = false;

  @Output() readonly pressed = new EventEmitter<void>();

  onKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (this.enabled) {
        this.pressed.emit();
      }
    }
  }
}

@Component({
  selector: "ids-dual-list-box-list-item",
  standalone: true,
  imports: [
    CommonModule,
    IdsTooltipComponent,
    IdsTooltipTriggerComponent,
    IdsTooltipPanelComponent,
    IdsTooltipHeaderComponent,
    IdsTooltipTitleComponent,
    IdsTooltipBodyComponent,
    IdsTooltipArrowComponent,
    forwardRef(() => IdsDualListBoxDragHandleComponent),
    forwardRef(() => IdsDualListBoxItemContentComponent),
    forwardRef(() => IdsDualListBoxSelectionCheckComponent),
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
          <ids-tooltip-trigger>
            <ng-container *ngTemplateOutlet="rowTemplate"></ng-container>
          </ids-tooltip-trigger>
          <ids-tooltip-panel>
            @if (item.tooltipTitle) {
              <ids-tooltip-header>
                <ids-tooltip-title>{{ item.tooltipTitle }}</ids-tooltip-title>
              </ids-tooltip-header>
            }
            <ids-tooltip-body>{{ tooltipBody }}</ids-tooltip-body>
            <ids-tooltip-arrow />
          </ids-tooltip-panel>
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
export class IdsDualListBoxListItemComponent {
  @Input({ required: true }) item!: DualListBoxItem;
  @Input({ required: true }) pane!: DualListBoxPane;
  @Input({ required: true }) itemId!: string;
  @Input() selected = false;
  @Input() focused = false;
  @Input() dragging = false;
  @Input() dragWithSelection = false;
  @Input() dragEnabled = true;
  @Input() showCheck = false;
  @Input() showDropBefore = false;
  @Input() showDropAfter = false;
  @Input() tooltipSide: DualListBoxTooltipSide = "top";
  @Input() tooltipArrowAlign: DualListBoxTooltipArrowAlign = "center";

  @Output() readonly toggle = new EventEmitter<void>();
  @Output() readonly focusedChange = new EventEmitter<void>();
  @Output() readonly dragStart = new EventEmitter<DragEvent>();
  @Output() readonly dragEnd = new EventEmitter<void>();
  @Output() readonly dragOverItem = new EventEmitter<DragEvent>();
  @Output() readonly dropOnItem = new EventEmitter<DragEvent>();

  get hasTooltip(): boolean {
    return Boolean(this.item.tooltipTitle || this.item.tooltipDescription);
  }

  get tooltipBody(): string {
    return this.item.tooltipDescription || this.item.tooltipTitle || this.item.name;
  }

  onRowKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggle.emit();
    }
  }
}

@Component({
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
export class IdsDualListBoxDragHandleComponent {
  @Input() dragEnabled = true;
  @Input({ required: true }) itemName!: string;
  @Input() selected = false;

  @Output() readonly handleDragStart = new EventEmitter<DragEvent>();
  @Output() readonly handleDragEnd = new EventEmitter<void>();

  stop(event: Event): void {
    event.stopPropagation();
  }
}

@Component({
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
export class IdsDualListBoxItemContentComponent {
  @Input({ required: true }) item!: DualListBoxItem;
}

@Component({
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
export class IdsDualListBoxSelectionCheckComponent {}
