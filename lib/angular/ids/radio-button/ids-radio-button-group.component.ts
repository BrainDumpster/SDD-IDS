import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
} from "@angular/core";
import {
  RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS,
  type RadioButtonOrientation,
  type RadioButtonSimulatedState,
} from "@component-contracts/ids/radio-button.contract";
import {
  IDS_RADIO_BUTTON_GROUP_CONTEXT,
  type IdsRadioButtonGroupContext,
} from "./ids-radio-button-group-context";
import { IdsRadioButtonComponent } from "./ids-radio-button.component";

@Component({
  selector: "ids-radio-button-group",
  standalone: true,
  templateUrl: "./ids-radio-button-group.component.html",
  styleUrl: "./ids-radio-button-group.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: IDS_RADIO_BUTTON_GROUP_CONTEXT, useExisting: IdsRadioButtonGroupComponent },
  ],
})
export class IdsRadioButtonGroupComponent
  implements OnInit, OnChanges, AfterContentInit, IdsRadioButtonGroupContext
{
  @ContentChildren(IdsRadioButtonComponent) itemQuery!: QueryList<IdsRadioButtonComponent>;

  @Input() id?: string;
  @Input({ required: true }) name = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.name;
  @Input() value?: string;
  @Input() defaultValue = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultValue;
  @Input() disabled = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() orientation: RadioButtonOrientation =
    RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.orientation;

  @Output() readonly valueChange = new EventEmitter<string>();

  private internalValue: string = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultValue;
  private items: IdsRadioButtonComponent[] = [];
  private focusedIndex = 0;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.isControlled) {
      this.internalValue = this.defaultValue;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["value"] && this.value !== undefined) {
      this.internalValue = this.value;
      this.notifySelectionChange();
    }
    if (changes["defaultValue"] && this.value === undefined) {
      this.internalValue = this.defaultValue;
      this.notifySelectionChange();
    }
  }

  ngAfterContentInit(): void {
    this.bindItems();
    this.itemQuery.changes.subscribe(() => this.bindItems());
  }

  get isControlled(): boolean {
    return this.value !== undefined;
  }

  get resolvedValue(): string {
    return this.isControlled ? (this.value ?? "") : this.internalValue;
  }

  registerItems(items: readonly IdsRadioButtonComponent[]): void {
    this.items = [...items];
    if (this.focusedIndex >= this.items.length) {
      this.focusedIndex = Math.max(0, this.items.length - 1);
    }
    this.notifySelectionChange();
  }

  isSelected(value: string): boolean {
    return this.resolvedValue === value;
  }

  isItemDisabled(item: IdsRadioButtonComponent): boolean {
    return this.disabled || item.disabled;
  }

  select(next: string): void {
    if (!this.isControlled) {
      this.internalValue = next;
    }
    const index = this.items.findIndex((item) => item.value === next);
    if (index >= 0) {
      this.focusedIndex = index;
    }
    this.valueChange.emit(next);
    this.notifySelectionChange();
    this.cdr.markForCheck();
  }

  optionId(value: string): string {
    return `${this.id ?? this.name}-${value}`;
  }

  simulatedStateAttr(state?: RadioButtonSimulatedState): string | null {
    if (!state || state === "default") {
      return null;
    }
    return state;
  }

  onItemKeydown(event: KeyboardEvent, item: IdsRadioButtonComponent): void {
    const index = this.items.indexOf(item);
    const enabledIndices = this.items
      .map((row, i) => (this.isItemDisabled(row) ? -1 : i))
      .filter((i) => i >= 0);
    if (!enabledIndices.length) {
      return;
    }

    const currentPos = enabledIndices.indexOf(index);
    let targetIndex = index;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        targetIndex = enabledIndices[(currentPos + 1) % enabledIndices.length];
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        targetIndex =
          enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length];
        break;
      case "Home":
        event.preventDefault();
        targetIndex = enabledIndices[0];
        break;
      case "End":
        event.preventDefault();
        targetIndex = enabledIndices[enabledIndices.length - 1];
        break;
      case " ":
        event.preventDefault();
        this.select(item.value);
        return;
      default:
        return;
    }

    this.focusedIndex = targetIndex;
    const target = this.items[targetIndex];
    if (target) {
      this.select(target.value);
      document.getElementById(this.optionId(target.value))?.focus();
    }
  }

  itemTabIndex(item: IdsRadioButtonComponent): number {
    const index = this.items.indexOf(item);
    return index === this.focusedIndex ? 0 : -1;
  }

  onItemFocus(item: IdsRadioButtonComponent): void {
    this.focusedIndex = this.items.indexOf(item);
  }

  notifySelectionChange(): void {
    for (const item of this.items) {
      item.notifySelectionChange();
    }
  }

  private bindItems(): void {
    this.registerItems(this.itemQuery.toArray());
  }
}
