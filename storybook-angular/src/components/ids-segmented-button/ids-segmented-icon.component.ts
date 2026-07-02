import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from "@angular/core";
import type { SegmentedButtonSimulatedState } from "@component-contracts/ids/segmented-button.contract";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_SEGMENTED_BUTTONS_CONTEXT, type IdsSegmentedButtonsSegment } from "./ids-segmented-buttons-group-context";

@Component({
  selector: "ids-segmented-icon",
  standalone: true,
  imports: [IdsIconComponent],
  templateUrl: "./ids-segmented-icon.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: flex;
        flex-shrink: 0;
        align-self: center;
      }
    `,
  ],
  host: {
    "[style.color]": "resolvedColor",
  },
})
export class IdsSegmentedIconComponent implements IdsSegmentedButtonsSegment {
  private readonly group = inject(IDS_SEGMENTED_BUTTONS_CONTEXT);

  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) shape!: string;
  @Input({ required: true }) ariaLabel!: string;
  @Input() title?: string;
  /** Optional override; segment state tokens apply when omitted. */
  @Input() color?: string;
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

  get resolvedColor(): string | null {
    return this.color ?? null;
  }

  getChangeMeta(): { type: "icon"; ariaLabel: string } {
    return { type: "icon", ariaLabel: this.ariaLabel };
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
