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
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS,
  type SegmentedButtonChangeMeta,
  type SegmentedButtonSimulatedState,
  type SegmentedButtonType,
} from "@component-contracts/ids/segmented-button.contract";
import {
  IDS_SEGMENTED_BUTTONS_CONTEXT,
  type IdsSegmentedButtonsContext,
  type IdsSegmentedButtonsSegment,
} from "./ids-segmented-buttons-group-context";
import { IdsSegmentedIconComponent } from "./ids-segmented-icon.component";
import { IdsSegmentedTextComponent } from "./ids-segmented-text.component";

@Component({
  selector: "ids-segmented-buttons",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./ids-segmented-buttons.component.html",
  styleUrl: "./ids-segmented-buttons.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: IDS_SEGMENTED_BUTTONS_CONTEXT, useExisting: IdsSegmentedButtonsComponent },
  ],
})
export class IdsSegmentedButtonsComponent
  implements OnInit, OnChanges, AfterContentInit, IdsSegmentedButtonsContext
{
  @ContentChildren(IdsSegmentedTextComponent) textQuery!: QueryList<IdsSegmentedTextComponent>;
  @ContentChildren(IdsSegmentedIconComponent) iconQuery!: QueryList<IdsSegmentedIconComponent>;

  @Input() type: SegmentedButtonType = SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.type;
  @Input() selected?: string | number;
  @Input() defaultSelected: string | number = SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultSelected;
  @Input() disabled = SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() ariaLabel: string = SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel;
  @Input() ariaLabelledby?: string;

  @Output() readonly selectedChange = new EventEmitter<string>();
  @Output() readonly change = new EventEmitter<{
    value: string;
    meta: SegmentedButtonChangeMeta;
  }>();

  private internalSelected = String(SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultSelected);
  private items: IdsSegmentedButtonsSegment[] = [];
  private focusedIndex = 0;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.isControlled) {
      this.internalSelected = String(this.defaultSelected);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["selected"] && this.selected !== undefined) {
      this.internalSelected = String(this.selected);
      this.notifySelectionChange();
    }
    if (changes["defaultSelected"] && this.selected === undefined) {
      this.internalSelected = String(this.defaultSelected);
      this.notifySelectionChange();
    }
  }

  ngAfterContentInit(): void {
    this.bindItems();
    this.textQuery.changes.subscribe(() => this.bindItems());
    this.iconQuery.changes.subscribe(() => this.bindItems());
  }

  get isControlled(): boolean {
    return this.selected !== undefined;
  }

  get resolvedSelected(): string {
    return this.isControlled ? String(this.selected ?? "") : this.internalSelected;
  }

  registerItems(items: readonly IdsSegmentedButtonsSegment[]): void {
    this.items = [...items];
    if (this.focusedIndex >= this.items.length) {
      this.focusedIndex = Math.max(0, this.items.length - 1);
    }
    this.notifySelectionChange();
    this.cdr.markForCheck();
  }

  isSelected(value: string): boolean {
    return this.resolvedSelected === value;
  }

  isItemDisabled(item: IdsSegmentedButtonsSegment): boolean {
    return this.disabled || item.disabled;
  }

  select(next: string): void {
    const targetItem = this.items.find((item) => item.segmentValue === next);
    if (!targetItem || this.isItemDisabled(targetItem)) {
      return;
    }
    if (!this.isControlled) {
      this.internalSelected = next;
    }
    const index = this.items.findIndex((item) => item.segmentValue === next);
    if (index >= 0) {
      this.focusedIndex = index;
    }
    const meta = targetItem.getChangeMeta();
    this.selectedChange.emit(next);
    this.change.emit({ value: next, meta });
    this.notifySelectionChange();
    this.cdr.markForCheck();
  }

  optionId(value: string): string {
    return `ids-segmented-${value}`;
  }

  simulatedStateAttr(state?: SegmentedButtonSimulatedState): string | null {
    return state ?? null;
  }

  onItemKeydown(event: KeyboardEvent, item: IdsSegmentedButtonsSegment): void {
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
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        targetIndex = enabledIndices[(currentPos + 1) % enabledIndices.length];
        break;
      case "ArrowLeft":
      case "ArrowUp":
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
      case "Enter":
        event.preventDefault();
        this.select(item.segmentValue);
        return;
      default:
        return;
    }

    this.focusedIndex = targetIndex;
    const target = this.items[targetIndex];
    if (target) {
      this.select(target.segmentValue);
      document.getElementById(this.optionId(target.segmentValue))?.focus();
    }
  }

  itemTabIndex(item: IdsSegmentedButtonsSegment): number {
    const index = this.items.indexOf(item);
    return index === this.focusedIndex ? 0 : -1;
  }

  onItemFocus(item: IdsSegmentedButtonsSegment): void {
    this.focusedIndex = this.items.indexOf(item);
  }

  notifySelectionChange(): void {
    for (const item of [...this.textQuery, ...this.iconQuery]) {
      item.notifySelectionChange();
    }
  }

  private bindItems(): void {
    const segments =
      this.type === "text"
        ? (this.textQuery.toArray() as IdsSegmentedButtonsSegment[])
        : (this.iconQuery.toArray() as IdsSegmentedButtonsSegment[]);
    this.registerItems(segments);
  }
}
