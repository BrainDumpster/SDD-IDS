import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import type { RadioButtonSimulatedState } from "@component-contracts/ids/radio-button.contract";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_RADIO_BUTTON_GROUP_CONTEXT } from "./ids-radio-button-group-context";

@Component({
  selector: "ids-radio-button",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  templateUrl: "./ids-radio-button.component.html",
  styleUrl: "./ids-radio-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsRadioButtonComponent {
  private readonly group = inject(IDS_RADIO_BUTTON_GROUP_CONTEXT);

  @Input({ required: true }) value!: string;
  @Input({ required: true }) label!: string;
  @Input() disabled = false;
  @Input() error = false;
  @Input() helperText?: string;
  /** Docs / Storybook only — static matrix states. */
  @Input() simulatedState?: RadioButtonSimulatedState;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get groupName(): string {
    return this.group.name;
  }

  get isSelected(): boolean {
    return this.group.isSelected(this.value);
  }

  get isDisabled(): boolean {
    return this.group.isItemDisabled(this);
  }

  get optionId(): string {
    return this.group.optionId(this.value);
  }

  get assistiveId(): string | undefined {
    return this.helperText ? `${this.optionId}-assistive` : undefined;
  }

  get simulatedStateAttr(): string | null {
    return this.group.simulatedStateAttr(this.simulatedState);
  }

  get tabIndex(): number {
    return this.group.itemTabIndex(this);
  }

  onSelect(): void {
    this.group.select(this.value);
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
