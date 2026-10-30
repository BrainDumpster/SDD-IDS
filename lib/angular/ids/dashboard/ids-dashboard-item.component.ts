import { CommonModule } from "@angular/common";
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Optional,
  ViewEncapsulation,
} from "@angular/core";
import { Subscription } from "rxjs";
import { cx } from "../../shared/utils/cx";
import { IdsCardComponent } from "../card/ids-card.component";
import type { IdsCardSize } from "../card/ids-card.types";
import {
  IDS_DASHBOARD_CONTEXT,
  type IdsDashboardRuntimeContext,
} from "./ids-dashboard.context";
import { resolveCardSize } from "./ids-dashboard.utils";

/**
 * IDS Dashboard item slot — `IdsDashboardItem` (React parity).
 * Hosts one nested Card (or other tile). Column span from `size` or nested Card.
 */
@Component({
  selector: "ids-dashboard-item",
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    "[attr.data-ids]": "'IdsDashboardItem'",
  },
})
export class IdsDashboardItemComponent implements AfterContentInit, OnDestroy {
  @ContentChild(IdsCardComponent) private card?: IdsCardComponent;

  /**
   * Column span in the Dashboard grid. Inherited from nested IdsCard `size` when omitted.
   */
  @Input() size?: IdsCardSize;
  /** Stable identity for drag reorder. Falls back to index key from Dashboard. */
  @Input() itemKey?: string;
  @Input() className?: string;

  /** Assigned by Dashboard when itemKey is omitted. */
  resolvedKey = "dashboard-item";

  private sub?: Subscription;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    @Optional()
    @Inject(IDS_DASHBOARD_CONTEXT)
    private readonly ctx: IdsDashboardRuntimeContext | null,
  ) {
    if (!this.ctx) {
      throw new Error("IdsDashboardItem must be used within Dashboard.");
    }
  }

  ngAfterContentInit(): void {
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get resolvedSize(): IdsCardSize {
    if (this.size === "span-1" || this.size === "span-2" || this.size === "span-3") {
      return this.size;
    }
    return resolveCardSize(this.card?.resolvedSize);
  }

  @HostBinding("class")
  get hostClass(): string {
    return cx("IdsDashboardItem", this.className);
  }

  @HostBinding("attr.data-card-size")
  get dataCardSize(): IdsCardSize {
    return this.resolvedSize;
  }

  @HostBinding("attr.data-dashboard-item")
  get dataDashboardItem(): string {
    return this.resolvedKey;
  }

  @HostBinding("attr.data-card-draggable")
  get dataCardDraggable(): string {
    return this.ctx?.dragEnabled ? "true" : "false";
  }

  @HostBinding("attr.data-dragging")
  get dataDragging(): string {
    return this.ctx?.dragEnabled && this.ctx.dragKey === this.resolvedKey
      ? "true"
      : "false";
  }

  @HostBinding("attr.data-drop-target")
  get dataDropTarget(): string {
    return this.ctx?.dragEnabled &&
      this.ctx.overKey === this.resolvedKey &&
      this.ctx.dragKey !== this.resolvedKey
      ? "true"
      : "false";
  }

  @HostBinding("attr.draggable")
  get draggableAttr(): string | null {
    return this.ctx?.dragEnabled ? "true" : null;
  }

  @HostListener("dragstart", ["$event"])
  onDragStart(event: DragEvent): void {
    this.ctx?.onItemDragStart(this.resolvedKey, event);
  }

  @HostListener("dragover", ["$event"])
  onDragOver(event: DragEvent): void {
    this.ctx?.onItemDragOver(this.resolvedKey, event);
  }

  @HostListener("drop", ["$event"])
  onDrop(event: DragEvent): void {
    this.ctx?.onItemDrop(this.resolvedKey, event);
  }

  @HostListener("dragend")
  onDragEnd(): void {
    this.ctx?.onItemDragEnd();
  }

  /** Called by Dashboard after reorder / prop changes. */
  markForCheck(): void {
    this.cdr.markForCheck();
  }
}
