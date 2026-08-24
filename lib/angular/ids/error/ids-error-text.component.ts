import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { ERROR_TEXT_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/error.contract";

@Component({
  selector: "ids-error-text",
  standalone: true,
  templateUrl: "./ids-error-text.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsErrorTextComponent {
  /** Explicit text input — if omitted, use projected content via <ng-content>. */
  @Input() text?: string = ERROR_TEXT_SPEC_ACCURATE_DEFAULTS.text;
  @Input() className?: string = ERROR_TEXT_SPEC_ACCURATE_DEFAULTS.className;
}
