import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  inject,
} from "@angular/core";
import { IDS_ANCHOR_MENU_CONTEXT } from "./ids-anchor-menu-context";
import { IDS_TOOLTIP_IMPORTS } from "../tooltip";

@Component({
  selector: "ids-anchor-menu-item",
  standalone: true,
  imports: [...IDS_TOOLTIP_IMPORTS],
  templateUrl: "./ids-anchor-menu-item.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsAnchorMenuItemComponent
  implements AfterViewChecked, OnChanges {
  private readonly menu = inject(IDS_ANCHOR_MENU_CONTEXT);

  @Input({ required: true }) label!: string;
  @Input({ required: true }) href!: string;
  @Input() active = false;

  @ViewChild("labelRef", { read: ElementRef }) labelRef?: ElementRef<HTMLElement>;
  isTruncated = false;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  get isActive(): boolean {
    return this.menu.isActive(this.href);
  }

  /** Show the branded IdsTooltip for truncated labels unless native mode. */
  get useIdsTooltip(): boolean {
    return this.isTruncated && !this.menu.nativeTooltip;
  }

  /** Auto-flipped tooltip side from the menu (avoids off-screen overflow). */
  get tooltipSide(): "left" | "right" {
    return this.menu.tooltipSide;
  }

  /** Native browser `title` for truncated labels when native mode is on. */
  get nativeTitle(): string | null {
    return this.isTruncated && this.menu.nativeTooltip ? this.label : null;
  }

  get canNavigate(): boolean {
    return this.menu.canNavigate(this.href);
  }

  get tabIndex(): number {
    return this.menu.itemTabIndex(this);
  }

  get offsetTopPx(): number {
    return this.host.nativeElement.offsetTop;
  }

  onClick(event: Event): void {
    this.menu.selectItem(this, event);
  }

  onKeydown(event: KeyboardEvent): void {
    this.menu.onItemKeydown(event, this);
  }

  onFocus(): void {
    this.menu.onItemFocus(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["label"]) {
      this.isTruncated = false;
      this.cdr.markForCheck();
    }
  }

  ngAfterViewChecked(): void {
    this.checkTruncated();
  }

  private checkTruncated(): void {
    const el = this.labelRef?.nativeElement;
    if (!el) {
      return;
    }
    const next = el.scrollHeight > el.clientHeight;
    if (next !== this.isTruncated) {
      this.isTruncated = next;
      this.cdr.markForCheck();
    }
  }

  focusLink(): void {
    this.host.nativeElement.querySelector("a")?.focus();
  }

  notifyChange(): void {
    this.cdr.markForCheck();
  }
}
