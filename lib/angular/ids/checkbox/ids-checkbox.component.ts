import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  CHECKBOX_SPEC_ACCURATE_DEFAULTS,
  type CheckboxDensity,
} from "@component-contracts/ids/checkbox.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IDS_CHECKBOX_GROUP_CONTEXT } from "./ids-checkbox-group-context";

@Component({
  selector: "ids-checkbox",
  standalone: true,
  imports: [CommonModule, IdsIconComponent],
  templateUrl: "./ids-checkbox.component.html",
  styleUrl: "./ids-checkbox.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsCheckboxComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild("checkboxInput") checkboxInput?: ElementRef<HTMLInputElement>;

  private readonly group = inject(IDS_CHECKBOX_GROUP_CONTEXT, { optional: true });

  @Input() id?: string;
  @Input({ required: true }) label: string = CHECKBOX_SPEC_ACCURATE_DEFAULTS.label;
  @Input() showLabel = CHECKBOX_SPEC_ACCURATE_DEFAULTS.showLabel;
  /** Static demo only: draw the focus ring (Storybook matrix “Focus” row). */
  @Input() simulateFocusVisible = CHECKBOX_SPEC_ACCURATE_DEFAULTS.simulateFocusVisible;
  @Input() checked?: boolean;
  @Input() defaultChecked = CHECKBOX_SPEC_ACCURATE_DEFAULTS.checked;
  @Input()
  set partial(value: boolean) {
    this.partialState = value;
  }
  get partial(): boolean {
    return this.partialState;
  }
  @Input() disabled = CHECKBOX_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() error = CHECKBOX_SPEC_ACCURATE_DEFAULTS.error;
  @Input() helperText?: string;
  @Input() name?: string;
  @Input() value?: string;
  @Input() density: CheckboxDensity = "default";

  @Output() readonly checkedChange = new EventEmitter<boolean>();

  private internalChecked: boolean = CHECKBOX_SPEC_ACCURATE_DEFAULTS.checked;
  private partialState: boolean = CHECKBOX_SPEC_ACCURATE_DEFAULTS.partial;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.isControlled) {
      this.internalChecked = this.defaultChecked;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["checked"] && this.checked !== undefined) {
      this.internalChecked = this.checked;
    }
    if (changes["defaultChecked"] && this.checked === undefined) {
      this.internalChecked = this.defaultChecked;
    }
    this.syncPartial();
  }

  ngAfterViewInit(): void {
    this.syncPartial();
  }

  get isControlled(): boolean {
    return this.checked !== undefined;
  }

  get resolvedChecked(): boolean {
    return this.isControlled ? (this.checked ?? false) : this.internalChecked;
  }

  get resolvedDisabled(): boolean {
    return this.disabled || Boolean(this.group?.disabled);
  }

  get resolvedName(): string | undefined {
    return this.name ?? this.group?.name;
  }

  get resolvedId(): string {
    if (this.id) {
      return this.id;
    }
    const prefix = this.group?.idPrefix;
    const slug = this.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (prefix) {
      return `${prefix}-${slug}`;
    }
    return `checkbox-${slug}`;
  }

  get assistiveId(): string | undefined {
    return this.helperText ? `${this.resolvedId}-assistive` : undefined;
  }

  get dataChecked(): string | null {
    if (this.partial) {
      return "mixed";
    }
    if (this.resolvedChecked) {
      return "";
    }
    return null;
  }

  get ariaChecked(): boolean | "mixed" {
    if (this.partial) {
      return "mixed";
    }
    return this.resolvedChecked;
  }

  get showIndicator(): boolean {
    return this.resolvedChecked || this.partial;
  }

  get indicatorType(): "check" | "minus" {
    return this.partial ? "minus" : "check";
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const next = input.checked;
    if (this.partialState) {
      this.partialState = false;
    }
    if (!this.isControlled) {
      this.internalChecked = next;
    }
    this.checkedChange.emit(next);
    this.syncIndeterminate();
    this.cdr.markForCheck();
  }

  private syncPartial(): void {
    const el = this.checkboxInput?.nativeElement;
    if (el) {
      el.indeterminate = this.partialState;
    }
  }
}
