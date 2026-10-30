/**
 * IDS Card — Angular implementation generated from design-spec.
 *
 * Path: `lib/angular/ids/card`
 * Source: `components/ids/card/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy matches React `lib/react/ids/card`.
 * Dashboard may inject `IDS_DASHBOARD_CARD_OVERRIDE` so `showDividerInCard` wins
 * over this component's `showDivider` input.
 */

import { CommonModule } from "@angular/common";
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  Optional,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { cx } from "../../shared/utils/cx";
import { IdsButtonComponent } from "../button/ids-button.component";
import {
  IDS_DASHBOARD_CARD_OVERRIDE,
  type IdsDashboardCardHost,
} from "./ids-card.context";
import { IdsCardHeaderMenuComponent } from "./ids-card-header-menu.component";
import { IdsCardSecondaryTitleComponent } from "./ids-card-slots.component";
import type {
  IdsCardAction,
  IdsCardMenuOption,
  IdsCardSize,
} from "./ids-card.types";

const SIZE_CLASS: Record<IdsCardSize, string> = {
  "span-1": "ids-card--span-1",
  "span-2": "ids-card--span-2",
  "span-3": "ids-card--span-3",
};

function resolveSize(value: unknown): IdsCardSize {
  if (value === "span-2" || value === "span-3") return value;
  return "span-1";
}

@Component({
  selector: "ids-card",
  standalone: true,
  imports: [CommonModule, IdsButtonComponent, IdsCardHeaderMenuComponent],
  templateUrl: "./ids-card.component.html",
  styleUrl: "./ids-card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IdsCardComponent
  implements AfterContentInit, AfterViewInit, OnChanges
{
  @ContentChild(IdsCardSecondaryTitleComponent)
  private secondaryTitleSlot?: IdsCardSecondaryTitleComponent;

  @Input() title?: string;
  /**
   * Secondary title shown inline after a `|` separator (Figma Dashboard-Element-Card
   * `14093:123118` — Body 1 / `var(--color-text-gray-neutral)`).
   * Prefer string; or project `<ids-card-secondary-title>`.
   */
  @Input() secondaryTitle?: string;
  /** Optional trailing meta before kebab (e.g. “Last 24 Hours” — Body 2 / neutral). */
  @Input() headerMeta?: string;
  @Input() actions?: IdsCardAction[];
  @Input() showButtons = false;
  @Input() menuOptions?: IdsCardMenuOption[];
  @Input() showOverflowMenu?: boolean;
  /** @deprecated Alias of `showOverflowMenu` */
  @Input() showOverFlowMenu?: boolean;
  /**
   * When `true` (default), `CardBody` shows header‖body `border-top` and, if a
   * footer is present, body‖footer `border-bottom`. Set `false` to hide both.
   * Overridden by `IDS_DASHBOARD_CARD_OVERRIDE.showDividerInCard` when injected.
   */
  @Input() showDivider = true;
  /**
   * Column span inside Dashboard’s 3-column grid.
   * `span-1` (default) | `span-2` (2×) | `span-3` (3× / full row).
   */
  @Input() size: IdsCardSize = "span-1";
  /** Demo-only — not in Figma Card-Main; ignored. */
  @Input() elevated?: boolean;
  /** Demo-only — not in Figma Card-Main; ignored. */
  @Input() outlined?: boolean;
  @Input() className?: string;

  @Output() readonly optionSelected = new EventEmitter<string>();
  @Output() readonly actionClick = new EventEmitter<IdsCardAction>();

  readonly titleId = `ids-card-title-${Math.random().toString(36).slice(2, 9)}`;
  readonly secondaryId = `ids-card-secondary-${Math.random().toString(36).slice(2, 9)}`;

  hasProjectedHeader = false;
  hasProjectedAdditionalFilter = false;
  hasProjectedFooter = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly host: ElementRef<HTMLElement>,
    @Optional()
    @Inject(IDS_DASHBOARD_CARD_OVERRIDE)
    private readonly dashboardHost?: IdsDashboardCardHost,
  ) {}

  @HostBinding("class")
  get hostClass(): string {
    return this.rootClass;
  }

  @HostBinding("attr.data-ids")
  get dataIds(): string {
    return "ids-card";
  }

  @HostBinding("attr.data-card-size")
  get dataCardSizeAttr(): IdsCardSize {
    return this.resolvedSize;
  }

  @HostBinding("attr.role")
  get roleAttr(): string {
    return "group";
  }

  @HostBinding("attr.aria-labelledby")
  get ariaLabelledby(): string | null {
    return this.hasTitle ? this.titleId : null;
  }

  @HostBinding("attr.aria-describedby")
  get ariaDescribedby(): string | null {
    return this.hasSecondaryTitle ? this.secondaryId : null;
  }

  ngAfterContentInit(): void {
    this.scanProjections();
    this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.scanProjections();
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.cdr.markForCheck();
  }

  /** Resolved Dashboard grid span (`span-1` | `span-2` | `span-3`). */
  get resolvedSize(): IdsCardSize {
    return resolveSize(this.size);
  }

  /**
   * Effective body divider flag. Dashboard host wins when
   * `IDS_DASHBOARD_CARD_OVERRIDE` is provided.
   */
  get effectiveShowDivider(): boolean {
    if (this.dashboardHost != null) {
      return this.dashboardHost.showDividerInCard;
    }
    return this.showDivider;
  }

  /** Card root element (host) — overflow menu collision boundary. */
  get cardRootEl(): HTMLElement | null {
    return this.host.nativeElement ?? null;
  }

  get hasTitle(): boolean {
    return this.title != null && String(this.title).length > 0;
  }

  get hasProjectedSecondaryTitle(): boolean {
    return Boolean(this.secondaryTitleSlot);
  }

  get hasSecondaryTitle(): boolean {
    return (
      this.hasProjectedSecondaryTitle ||
      (this.secondaryTitle != null && String(this.secondaryTitle).length > 0)
    );
  }

  get overflowOn(): boolean {
    return this.showOverflowMenu ?? this.showOverFlowMenu ?? false;
  }

  get showMenu(): boolean {
    return (
      this.overflowOn &&
      this.menuOptions != null &&
      this.menuOptions.length > 0
    );
  }

  get hasTrailing(): boolean {
    return (
      (this.headerMeta != null && String(this.headerMeta).length > 0) ||
      this.showMenu ||
      this.hasProjectedAdditionalFilter
    );
  }

  get hasHeader(): boolean {
    return (
      this.hasProjectedHeader ||
      this.hasTitle ||
      this.hasSecondaryTitle ||
      this.showMenu ||
      this.hasProjectedAdditionalFilter ||
      (this.headerMeta != null && String(this.headerMeta).length > 0)
    );
  }

  get hasFooter(): boolean {
    return (
      this.showButtons &&
      ((this.actions != null && this.actions.length > 0) ||
        this.hasProjectedFooter)
    );
  }

  get rootClass(): string {
    return cx("ids-card", SIZE_CLASS[this.resolvedSize], this.className);
  }

  get bodyClass(): string {
    return cx(
      "ids-card-body",
      !this.effectiveShowDivider && "ids-card-body--no-divider",
      this.effectiveShowDivider &&
        this.hasFooter &&
        "ids-card-body--with-footer",
    );
  }

  get menuAriaLabel(): string {
    return this.hasTitle ? `Options for ${this.title}` : "Card options";
  }

  onOptionSelected(value: string): void {
    this.optionSelected.emit(value);
  }

  onActionClicked(action: IdsCardAction): void {
    action.onClick?.();
    this.actionClick.emit(action);
  }

  /** Used by Dashboard when `showDividerInCard` / drag attrs change. */
  markForCheck(): void {
    this.cdr.markForCheck();
  }

  private scanProjections(): void {
    const root = this.host.nativeElement;
    this.hasProjectedHeader = Boolean(root.querySelector("[idsCardHeader]"));
    this.hasProjectedAdditionalFilter = Boolean(
      root.querySelector("[idsCardAdditionalFilter]"),
    );
    this.hasProjectedFooter = Boolean(root.querySelector("[idsCardFooter]"));
  }
}
