/**
 * IDS Dashboard — Angular implementation generated from design-spec.
 *
 * Path: `lib/angular/ids/dashboard`
 * Source: `components/ids/dashboard/design-spec.md`
 * Theme: `components/ids-theme.css`
 * React parity: `lib/react/ids/dashboard` (branch usr/muthu/lib)
 *
 * Anatomy:
 *   IdsDashboard
 *     IdsDashboardGrid
 *       IdsDashboardItem+ → IdsCard (size span-1|2|3, showDivider=showDividerInCard)
 *
 * Accepted trees (React collectMainSlots parity):
 *   ids-dashboard → ids-card+
 *   ids-dashboard → ids-dashboard-item+
 *   ids-dashboard → ids-dashboard-grid → ids-dashboard-item+|ids-card+
 */

import { CommonModule } from "@angular/common";
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { Subscription } from "rxjs";
import { cx } from "../../shared/utils/cx";
import {
  IDS_DASHBOARD_CARD_OVERRIDE,
  type IdsDashboardCardHost,
} from "../card/ids-card.context";
import { IdsCardComponent } from "../card/ids-card.component";
import {
  IDS_DASHBOARD_CONTEXT,
  type IdsDashboardRuntimeContext,
} from "./ids-dashboard.context";
import { IdsDashboardGridComponent } from "./ids-dashboard-grid.component";
import { IdsDashboardItemComponent } from "./ids-dashboard-item.component";
import {
  dashboardItemKey,
  resolveBoolean,
} from "./ids-dashboard.utils";

@Component({
  selector: "ids-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./ids-dashboard.component.html",
  styleUrl: "./ids-dashboard.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: IDS_DASHBOARD_CONTEXT, useExisting: IdsDashboardComponent },
    { provide: IDS_DASHBOARD_CARD_OVERRIDE, useExisting: IdsDashboardComponent },
  ],
})
export class IdsDashboardComponent
  implements
    IdsDashboardRuntimeContext,
    IdsDashboardCardHost,
    AfterContentInit,
    AfterViewInit,
    OnChanges,
    OnDestroy
{
  @ContentChild(IdsDashboardGridComponent)
  gridSlot?: IdsDashboardGridComponent;

  @ContentChildren(IdsDashboardItemComponent, { descendants: true })
  private itemQuery?: QueryList<IdsDashboardItemComponent>;

  @ContentChildren(IdsCardComponent, { descendants: true })
  private cardQuery?: QueryList<IdsCardComponent>;

  /**
   * When `true` (default), nested Cards keep body dividers (`showDivider`).
   * When `false`, forces nested Cards to `showDivider=false`.
   * Dashboard injection wins over any `showDivider` on the Card child.
   */
  @Input() showDividerInCard = true;
  /**
   * When `true`, nested Card items are draggable and can be reordered
   * (HTML5 drag-and-drop). Default `false`.
   */
  @Input() enableDragAndDrop = false;
  /** @deprecated Use `enableDragAndDrop` */
  @Input() cardsDraggable?: boolean;
  @Input() className?: string;

  /** Fires after a successful drag reorder with ordered child keys. */
  @Output() readonly cardsReorder = new EventEmitter<string[]>();

  dragKey: string | null = null;
  overKey: string | null = null;

  private order: string[] = [];
  private subs = new Subscription();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly host: ElementRef<HTMLElement>,
  ) {}

  get dragEnabled(): boolean {
    return resolveBoolean(this.enableDragAndDrop ?? this.cardsDraggable, false);
  }

  get dividerOn(): boolean {
    return resolveBoolean(this.showDividerInCard, true);
  }

  get hasExplicitGrid(): boolean {
    return Boolean(this.gridSlot);
  }

  @HostBinding("class")
  get hostClass(): string {
    return cx("IdsDashboard", this.className);
  }

  @HostBinding("attr.data-ids")
  get dataIds(): string {
    return "IdsDashboard";
  }

  @HostBinding("attr.aria-label")
  get ariaLabel(): string {
    return "Dashboard";
  }

  @HostBinding("attr.role")
  get role(): string {
    return "region";
  }

  @HostBinding("attr.data-show-divider-in-card")
  get dataShowDivider(): string {
    return this.dividerOn ? "true" : "false";
  }

  @HostBinding("attr.data-enable-drag-and-drop")
  get dataDrag(): string {
    return this.dragEnabled ? "true" : "false";
  }

  @HostBinding("attr.data-cards-draggable")
  get dataCardsDraggable(): string {
    return this.dragEnabled ? "true" : "false";
  }

  ngAfterContentInit(): void {
    this.syncProjected();
    if (this.itemQuery) {
      this.subs.add(this.itemQuery.changes.subscribe(() => this.syncProjected()));
    }
    if (this.cardQuery) {
      this.subs.add(this.cardQuery.changes.subscribe(() => this.syncProjected()));
    }
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.syncProjected());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["showDividerInCard"] ||
      changes["enableDragAndDrop"] ||
      changes["cardsDraggable"]
    ) {
      this.refreshCards();
      this.syncProjected();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onItemDragStart(itemKey: string, event: DragEvent): void {
    if (!this.dragEnabled) return;
    event.dataTransfer?.setData("text/plain", itemKey);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    this.dragKey = itemKey;
    this.refreshItems();
  }

  onItemDragOver(itemKey: string, event: DragEvent): void {
    if (!this.dragEnabled || this.dragKey == null) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    if (this.overKey !== itemKey) {
      this.overKey = itemKey;
      this.refreshItems();
    }
  }

  onItemDrop(itemKey: string, event: DragEvent): void {
    if (!this.dragEnabled) return;
    event.preventDefault();
    const from = event.dataTransfer?.getData("text/plain") || this.dragKey;
    if (from) this.reorder(from, itemKey);
    this.dragKey = null;
    this.overKey = null;
    this.refreshItems();
  }

  onItemDragEnd(): void {
    this.dragKey = null;
    this.overKey = null;
    this.refreshItems();
  }

  private syncProjected(): void {
    const items = this.itemQuery?.toArray() ?? [];
    items.forEach((item, index) => {
      item.resolvedKey = dashboardItemKey(item.itemKey, index);
    });

    if (items.length > 0) {
      const keys = items.map((i) => i.resolvedKey);
      this.order = this.mergeOrder(this.order, keys);
      this.applyOrderStyles(items.map((i) => i.resolvedKey));
    } else {
      this.syncBareCards();
    }
    this.refreshCards();
    this.refreshItems();
    this.cdr.markForCheck();
  }

  private syncBareCards(): void {
    const cards = this.cardQuery?.toArray() ?? [];
    const keys = cards.map((_, index) => dashboardItemKey(undefined, index));
    this.order = this.mergeOrder(this.order, keys);

    cards.forEach((card, index) => {
      const el = card.cardRootEl;
      if (!el) return;
      const key = keys[index]!;
      el.setAttribute("data-dashboard-item", key);
      el.setAttribute(
        "data-card-draggable",
        this.dragEnabled ? "true" : "false",
      );
      if (this.dragEnabled) {
        el.setAttribute("draggable", "true");
        el.ondragstart = (e) => this.onItemDragStart(key, e);
        el.ondragover = (e) => this.onItemDragOver(key, e);
        el.ondrop = (e) => this.onItemDrop(key, e);
        el.ondragend = () => this.onItemDragEnd();
      } else {
        el.removeAttribute("draggable");
        el.ondragstart = null;
        el.ondragover = null;
        el.ondrop = null;
        el.ondragend = null;
      }
      const pos = this.order.indexOf(key);
      el.style.order = String(pos >= 0 ? pos : index);
      el.setAttribute(
        "data-dragging",
        this.dragKey === key ? "true" : "false",
      );
      el.setAttribute(
        "data-drop-target",
        this.overKey === key && this.dragKey !== key ? "true" : "false",
      );
    });
  }

  private applyOrderStyles(keys: string[]): void {
    const root = this.host.nativeElement;
    keys.forEach((key) => {
      const pos = this.order.indexOf(key);
      const el = root.querySelector(
        `[data-dashboard-item="${cssEscape(key)}"]`,
      ) as HTMLElement | null;
      if (el && pos >= 0) el.style.order = String(pos);
    });
  }

  private mergeOrder(prev: string[], defaultOrder: string[]): string[] {
    const nextKeys = new Set(defaultOrder);
    const kept = prev.filter((k) => nextKeys.has(k));
    const added = defaultOrder.filter((k) => !kept.includes(k));
    return [...kept, ...added];
  }

  private reorder(fromKey: string, toKey: string): void {
    if (fromKey === toKey) return;
    const next = [...this.order];
    const from = next.indexOf(fromKey);
    const to = next.indexOf(toKey);
    if (from < 0 || to < 0) return;
    next.splice(from, 1);
    next.splice(to, 0, fromKey);
    this.order = next;
    this.cardsReorder.emit([...next]);
    this.applyOrderStyles(this.order);
    this.syncBareCards();
  }

  private refreshItems(): void {
    this.itemQuery?.forEach((item) => item.markForCheck());
    this.cdr.markForCheck();
  }

  private refreshCards(): void {
    this.cardQuery?.forEach((card) => card.markForCheck());
  }
}

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/"/g, '\\"');
}
