import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from "@angular/core";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_DROPDOWN_CONTEXT } from "./ids-dropdown-context";

let errorIdCounter = 0;

@Component({
  selector: "ids-dropdown-error",
  standalone: true,
  imports: [IdsIconComponent],
  templateUrl: "./ids-dropdown-error.component.html",
  styleUrl: "./ids-dropdown-error.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDropdownErrorComponent implements OnInit, OnDestroy {
  private readonly dropdown = inject(IDS_DROPDOWN_CONTEXT, { optional: true });

  @Input() text?: string;

  readonly errorId = `ids-dropdown-error-${++errorIdCounter}`;

  ngOnInit(): void {
    this.dropdown?.registerDescribedBy(this.errorId);
  }

  ngOnDestroy(): void {
    this.dropdown?.unregisterDescribedBy(this.errorId);
  }
}
