import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";

@Component({
  selector: "ids-dropdown-tag",
  standalone: true,
  imports: [IdsIconComponent],
  templateUrl: "./ids-dropdown-tag.component.html",
  styleUrl: "./ids-dropdown-tag.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDropdownTagComponent {
  @Input({ required: true }) label!: string;
  @Output() readonly dismiss = new EventEmitter<void>();
}
