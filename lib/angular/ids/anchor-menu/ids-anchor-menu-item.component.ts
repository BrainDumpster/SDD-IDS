import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  inject,
} from "@angular/core";
import { IDS_ANCHOR_MENU_CONTEXT } from "./ids-anchor-menu-context";

@Component({
  selector: "ids-anchor-menu-item",
  standalone: true,
  templateUrl: "./ids-anchor-menu-item.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsAnchorMenuItemComponent {
  private readonly menu = inject(IDS_ANCHOR_MENU_CONTEXT);

  @Input({ required: true }) label!: string;
  @Input({ required: true }) href!: string;
  @Input() active = false;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  get isActive(): boolean {
    return this.menu.isActive(this.href);
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

  focusLink(): void {
    this.host.nativeElement.querySelector("a")?.focus();
  }

  notifyChange(): void {
    this.cdr.markForCheck();
  }
}
