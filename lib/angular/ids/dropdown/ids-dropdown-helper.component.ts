import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from "@angular/core";
import { IDS_DROPDOWN_CONTEXT } from "./ids-dropdown-context";

let helperIdCounter = 0;

@Component({
  selector: "ids-dropdown-helper",
  standalone: true,
  templateUrl: "./ids-dropdown-helper.component.html",
  styleUrl: "./ids-dropdown-helper.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDropdownHelperComponent implements OnInit, OnDestroy {
  private readonly dropdown = inject(IDS_DROPDOWN_CONTEXT, { optional: true });
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input() text?: string;

  readonly helperId = `ids-dropdown-helper-${++helperIdCounter}`;

  ngOnInit(): void {
    this.dropdown?.registerDescribedBy(this.helperId);
  }

  ngOnDestroy(): void {
    this.dropdown?.unregisterDescribedBy(this.helperId);
  }
}
