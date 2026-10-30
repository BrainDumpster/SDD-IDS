import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import {
  DROPDOWN_BUTTON_CARET_ICON,
  DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS,
  DROPDOWN_BUTTON_TRIGGER_ICON,
} from "@component-contracts/ids/dropdown-button.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";
import {
  IDS_DROPDOWN_BUTTON_CONTEXT,
  type IdsDropdownButtonTriggerApi,
} from "./ids-dropdown-button-context";

@Component({
  selector: "ids-dropdown-button-trigger",
  standalone: true,
  imports: [IdsIconComponent],
  templateUrl: "./ids-dropdown-button-trigger.component.html",
  styleUrl: "./ids-dropdown-button-trigger.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsDropdownButtonTriggerComponent
  implements AfterViewInit, IdsDropdownButtonTriggerApi
{
  readonly dropdown = inject(IDS_DROPDOWN_BUTTON_CONTEXT);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild("triggerButton", { static: true }) triggerButton!: ElementRef<HTMLButtonElement>;

  @Input() label = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.label;
  @Input() showLeadingIcon = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.showLeadingIcon;
  @Input() iconOnly = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.iconOnly;
  @Input() ariaLabel = "";

  readonly leadingIconName = DROPDOWN_BUTTON_TRIGGER_ICON;
  readonly caretIconName = DROPDOWN_BUTTON_CARET_ICON;

  ngAfterViewInit(): void {
    this.dropdown.registerTrigger(this);
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }

  get accessibleName(): string {
    if (this.ariaLabel.trim().length > 0) {
      return this.ariaLabel;
    }
    return this.label || DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel;
  }

  get showIcon(): boolean {
    return this.iconOnly || this.showLeadingIcon;
  }

  focusTrigger(): void {
    this.triggerButton.nativeElement.focus();
  }

  onClick(): void {
    this.dropdown.toggleFromTrigger();
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (this.dropdown.isOpen) {
          this.dropdown.closeMenu({ focusTrigger: true });
        } else {
          this.dropdown.openFromTrigger("first");
        }
        return;
      case "ArrowDown":
        event.preventDefault();
        this.dropdown.openFromTrigger("first");
        return;
      case "ArrowUp":
        event.preventDefault();
        this.dropdown.openFromTrigger("last");
        return;
      default:
        return;
    }
  }
}
