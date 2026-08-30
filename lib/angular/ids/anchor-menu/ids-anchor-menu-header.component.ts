import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { IDS_ANCHOR_MENU_CONTEXT } from "./ids-anchor-menu-context";

@Component({
  selector: "ids-anchor-menu-header",
  standalone: true,
  template: `<span class="ids-anchor-menu__header">{{ resolvedTitle }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsAnchorMenuHeaderComponent {
  private readonly menu = inject(IDS_ANCHOR_MENU_CONTEXT);

  @Input() title?: string;

  get resolvedTitle(): string {
    return this.title ?? this.menu.title;
  }
}
