import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, inject } from "@angular/core";

@Component({
  selector: "ids-dropdown-menu-footer",
  standalone: true,
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDropdownMenuFooterComponent {
  readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input({ required: true }) actionLabel!: string;
  @Output() readonly action = new EventEmitter<void>();
}
