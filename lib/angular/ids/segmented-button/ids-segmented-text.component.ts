import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from "@angular/core";
import type { SegmentedButtonSimulatedState } from "@component-contracts/ids/segmented-button.contract";
import { IDS_SEGMENTED_BUTTONS_CONTEXT, type IdsSegmentedButtonsSegment } from "./ids-segmented-buttons-group-context";

@Component({
  selector: "ids-segmented-text",
  standalone: true,
  templateUrl: "./ids-segmented-text.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: flex;
        flex: 1 1 0;
        min-width: 0;
        align-items: stretch;
      }
    `,
  ],
})
export class IdsSegmentedTextComponent implements IdsSegmentedButtonsSegment {
  private readonly group = inject(IDS_SEGMENTED_BUTTONS_CONTEXT);

  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) label!: string;
  @Input() ariaLabel?: string;
  @Input() title?: string;
  @Input() disabled = false;
  /** Storybook / visual QA only — pins hover, press, or focus-visible styling. */
  @Input() simulatedState?: SegmentedButtonSimulatedState;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get segmentValue(): string {
    return String(this.value);
  }

  get isSelected(): boolean {
    return this.group.isSelected(this.segmentValue);
  }

  get isDisabled(): boolean {
    return this.group.isItemDisabled(this);
  }

  get optionId(): string {
    return this.group.optionId(this.segmentValue);
  }

  get simulatedStateAttr(): string | null {
    return this.group.simulatedStateAttr(this.simulatedState);
  }

  get tabIndex(): number {
    return this.group.itemTabIndex(this);
  }

  getChangeMeta(): { type: "text"; label: string } {
    return { type: "text", label: this.label };
  }

  onSelect(): void {
    this.group.select(this.segmentValue);
  }

  onKeydown(event: KeyboardEvent): void {
    this.group.onItemKeydown(event, this);
  }

  onFocus(): void {
    this.group.onItemFocus(this);
  }

  notifySelectionChange(): void {
    this.cdr.markForCheck();
  }
}
