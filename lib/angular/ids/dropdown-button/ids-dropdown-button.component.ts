import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import {
  DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS,
  type DropdownButtonSize,
  type DropdownButtonStyle,
  type IdsDropdownButtonSelection,
} from "@component-contracts/ids/dropdown-button.contract";
import {
  IDS_DROPDOWN_BUTTON_CONTEXT,
  type IdsDropdownButtonContext,
  type IdsDropdownButtonMenuApi,
  type IdsDropdownButtonTriggerApi,
} from "./ids-dropdown-button-context";
import { IdsDropdownButtonMenuComponent } from "./ids-dropdown-button-menu.component";

@Component({
  selector: "ids-dropdown-button",
  standalone: true,
  templateUrl: "./ids-dropdown-button.component.html",
  styleUrl: "./ids-dropdown-button.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: IDS_DROPDOWN_BUTTON_CONTEXT, useExisting: IdsDropdownButtonComponent }],
})
export class IdsDropdownButtonComponent implements OnChanges, IdsDropdownButtonContext {
  @ContentChild(IdsDropdownButtonMenuComponent) menuComponent?: IdsDropdownButtonMenuComponent;

  @Input() buttonStyle: DropdownButtonStyle =
    DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.buttonStyle;
  @Input() size: DropdownButtonSize = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.size;
  @Input() disabled: boolean = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() open?: boolean;
  @Input() defaultOpen: boolean = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultOpen;

  @Output() readonly openChange = new EventEmitter<boolean>();
  @Output() readonly selectionChange = new EventEmitter<IdsDropdownButtonSelection>();

  private triggerApi?: IdsDropdownButtonTriggerApi;
  private menuApi?: IdsDropdownButtonMenuApi;
  private uncontrolledOpen: boolean = this.defaultOpen;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  get isOpen(): boolean {
    return this.open ?? this.uncontrolledOpen;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["defaultOpen"]?.firstChange) {
      this.uncontrolledOpen = this.defaultOpen;
    }
    if (changes["disabled"] && this.disabled && this.isOpen) {
      this.applyOpenState(false);
    }
    this.cdr.markForCheck();
  }

  registerTrigger(trigger: IdsDropdownButtonTriggerApi): void {
    this.triggerApi = trigger;
  }

  registerMenu(menu: IdsDropdownButtonMenuApi): void {
    this.menuApi = menu;
  }

  toggleFromTrigger(): void {
    if (this.isOpen) {
      this.closeMenu({ focusTrigger: false });
      return;
    }
    this.openFromTrigger();
  }

  openFromTrigger(focusTarget: "first" | "last" = "first"): void {
    if (this.disabled) {
      return;
    }
    this.applyOpenState(true);
    queueMicrotask(() => {
      if (focusTarget === "last") {
        this.menuApi?.focusLastEnabledItem();
      } else {
        this.menuApi?.focusFirstEnabledItem();
      }
    });
  }

  closeMenu(options?: { focusTrigger?: boolean }): void {
    const focusTrigger = options?.focusTrigger ?? true;
    if (!this.isOpen) {
      if (focusTrigger) {
        this.triggerApi?.focusTrigger();
      }
      return;
    }
    this.applyOpenState(false);
    if (focusTrigger) {
      queueMicrotask(() => this.triggerApi?.focusTrigger());
    }
  }

  selectItem(selection: IdsDropdownButtonSelection): void {
    if (this.disabled) {
      return;
    }
    this.selectionChange.emit(selection);
    this.closeMenu({ focusTrigger: true });
  }

  get menuId(): string | null {
    return this.menuApi?.menuId ?? this.menuComponent?.menuId ?? null;
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) {
      return;
    }
    const target = event.target as Node | null;
    if (target && this.elementRef.nativeElement.contains(target)) {
      return;
    }
    this.closeMenu({ focusTrigger: false });
  }

  @HostListener("document:keydown.escape", ["$event"])
  onEscape(event: Event): void {
    if (!this.isOpen) {
      return;
    }
    event.preventDefault();
    this.closeMenu({ focusTrigger: true });
  }

  private applyOpenState(next: boolean): void {
    if (this.open === undefined) {
      this.uncontrolledOpen = next;
    }
    this.openChange.emit(next);
    this.cdr.markForCheck();
    // Menu and trigger are OnPush children — notify them so their views re-evaluate isOpen.
    this.menuApi?.markForCheck();
    this.triggerApi?.markForCheck();
  }
}
