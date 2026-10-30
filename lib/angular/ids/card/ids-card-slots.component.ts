import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { cx } from "../../shared/utils/cx";
import type { IdsCardKeyValueItem } from "./ids-card.types";

/**
 * Optional secondary title (Figma Dashboard-Element-Card).
 * Rendered inline after `|` when used with `title` — Body 1 / `var(--color-text-gray-neutral)`.
 */
@Component({
  selector: "ids-card-secondary-title",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    style: "display: contents",
  },
  template: `
    <span
      [class]="rootClass"
      data-ids="ids-card-secondary-title"
    >
      <ng-content />
    </span>
  `,
})
export class IdsCardSecondaryTitleComponent {
  @Input() className?: string;

  get rootClass(): string {
    return cx("ids-card-secondary-title", this.className);
  }
}

/** Content Type=Text — Figma `15718:219736`. */
@Component({
  selector: "ids-card-text-content",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ids-card-text-content" data-ids="ids-card-text-content">
      <p class="ids-card-text-section-title">{{ sectionTitle }}</p>
      <div class="ids-card-text-paragraph"><ng-content /></div>
    </div>
  `,
})
export class IdsCardTextContentComponent {
  @Input() sectionTitle = "Section Title";
}

/** Content Type=Key Value Pair — Figma `15718:220110`. Composes lib `IdsIcon`. */
@Component({
  selector: "ids-card-key-value-content",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <dl class="ids-card-key-value-list" data-ids="ids-card-key-value-content">
      @for (item of items; track item.id ?? $index) {
        <div class="ids-card-key-value-row">
          <dt class="ids-card-key-value-label">{{ item.label }}:</dt>
          <dd class="ids-card-key-value-value">
            @if (item.iconSlug) {
              <ids-icon
                [shape]="item.iconSlug"
                [size]="16"
                color="var(--color-icon-gray-neutral-base)"
                className="ids-card-key-value-icon"
              />
            }
            <span>{{ item.value }}</span>
          </dd>
        </div>
      }
    </dl>
  `,
})
export class IdsCardKeyValueContentComponent {
  @Input() items: IdsCardKeyValueItem[] = [];
}
