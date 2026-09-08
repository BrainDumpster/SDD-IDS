import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
} from "@angular/core";
import { IDS_ANCHOR_MENU_CONTEXT } from "./ids-anchor-menu-context";
import { IDS_TOOLTIP_IMPORTS } from "../tooltip";

@Component({
  selector: "ids-anchor-menu-header",
  standalone: true,
  imports: [...IDS_TOOLTIP_IMPORTS],
  // The heading grows to the rail's max width and wraps to a 2nd line; past two
  // lines it truncates with an ellipsis (clamp on the inner label, padding on
  // the wrapper) and reveals the full text on hover via IdsTooltip.
  // Anchor the tooltip to the label (not the padded wrapper) so it lines up with
  // the heading text instead of sitting above it in the padding.
  template: `
    <span class="ids-anchor-menu__header">
      @if (useIdsTooltip) {
        <ids-tooltip triggerDisplay="block" [side]="tooltipSide" arrowAlign="start">
          <ids-tooltip-trigger>
            <span #headerLabel class="ids-anchor-menu__header-label">{{
              resolvedTitle
            }}</span>
          </ids-tooltip-trigger>
          <ids-tooltip-panel>
            <ids-tooltip-body>{{ resolvedTitle }}</ids-tooltip-body>
          </ids-tooltip-panel>
        </ids-tooltip>
      } @else {
        <span
          #headerLabel
          class="ids-anchor-menu__header-label"
          [attr.title]="nativeTitle"
          >{{ resolvedTitle }}</span
        >
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsAnchorMenuHeaderComponent implements AfterViewChecked {
  private readonly menu = inject(IDS_ANCHOR_MENU_CONTEXT);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() title?: string;

  @ViewChild("headerLabel", { read: ElementRef })
  headerLabel?: ElementRef<HTMLElement>;
  isTruncated = false;

  get resolvedTitle(): string {
    return this.title ?? this.menu.title;
  }

  /** Show the branded IdsTooltip for a truncated heading unless native mode. */
  get useIdsTooltip(): boolean {
    return this.isTruncated && !this.menu.nativeTooltip;
  }

  /** Auto-flipped tooltip side from the menu (avoids off-screen overflow). */
  get tooltipSide(): "left" | "right" {
    return this.menu.tooltipSide;
  }

  /** Native browser `title` for a truncated heading when native mode is on. */
  get nativeTitle(): string | null {
    return this.isTruncated && this.menu.nativeTooltip ? this.resolvedTitle : null;
  }

  ngAfterViewChecked(): void {
    const el = this.headerLabel?.nativeElement;
    if (!el) {
      return;
    }
    const next = el.scrollHeight > el.clientHeight;
    if (next !== this.isTruncated) {
      this.isTruncated = next;
      this.cdr.markForCheck();
    }
  }
}
