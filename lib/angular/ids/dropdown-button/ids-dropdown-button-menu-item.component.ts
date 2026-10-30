import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { IDS_DROPDOWN_BUTTON_CONTEXT } from "./ids-dropdown-button-context";
import { IdsDropdownButtonMenuComponent } from "./ids-dropdown-button-menu.component";

@Component({
  selector: "ids-dropdown-button-menu-item",
  standalone: true,
  templateUrl: "./ids-dropdown-button-menu-item.component.html",
  styleUrl: "./ids-dropdown-button-menu-item.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDropdownButtonMenuItemComponent {
  readonly dropdown = inject(IDS_DROPDOWN_BUTTON_CONTEXT);
  readonly menu = inject(IdsDropdownButtonMenuComponent, { host: true });

  @ViewChild("itemButton", { static: true }) itemButton!: ElementRef<HTMLButtonElement>;

  @Input({ required: true }) value!: string;
  @Input({ required: true }) label!: string;
  @Input() disabled = false;

  focusItem(): void {
    this.itemButton.nativeElement.focus();
  }

  onClick(): void {
    if (this.disabled) {
      return;
    }
    this.dropdown.selectItem({ value: this.value, label: this.label });
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.menu.focusNextItem(this);
        return;
      case "ArrowUp":
        event.preventDefault();
        this.menu.focusPreviousItem(this);
        return;
      case "Home":
        event.preventDefault();
        this.menu.focusFirstEnabledItem();
        return;
      case "End":
        event.preventDefault();
        this.menu.focusLastEnabledItem();
        return;
      case "Tab":
        this.dropdown.closeMenu({ focusTrigger: false });
        return;
      case "Escape":
        event.preventDefault();
        this.dropdown.closeMenu({ focusTrigger: true });
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        this.onClick();
        return;
      default:
        return;
    }
  }
}
