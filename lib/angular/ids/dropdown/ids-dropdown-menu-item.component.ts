import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  inject,
} from "@angular/core";
import { IDS_DROPDOWN_CONTEXT } from "./ids-dropdown-context";
import type { IdsDropdownMenuItemModel } from "./ids-dropdown.types";

@Component({
  selector: "ids-dropdown-menu-item",
  standalone: true,
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDropdownMenuItemComponent {
  readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly dropdown = inject(IDS_DROPDOWN_CONTEXT, { optional: true });

  @Input({ required: true }) value!: string;
  @Input({ required: true }) label!: string;
  @Input() disabled = false;

  toMenuModel(): IdsDropdownMenuItemModel {
    const value = this.value;
    return {
      id: value,
      value,
      label: this.label,
      disabled: this.disabled,
      selectable: true,
      onClick: () => this.dropdown?.toggleValue(value),
    };
  }
}
