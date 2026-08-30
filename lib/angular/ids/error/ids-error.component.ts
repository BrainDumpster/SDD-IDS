import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { ERROR_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/error.contract";

@Component({
  selector: "ids-error",
  standalone: true,
  templateUrl: "./ids-error.component.html",
  styleUrl: "./ids-error.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsErrorComponent {
  @Input() id?: string = ERROR_SPEC_ACCURATE_DEFAULTS.id;
  @Input() className?: string = ERROR_SPEC_ACCURATE_DEFAULTS.className;
}
