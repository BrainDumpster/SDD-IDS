import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/toggle-switch.contract";
import {
  IDS_TOGGLE_SWITCH_CONTEXT,
  type IdsToggleSwitchContext,
} from "./ids-toggle-switch-context";
import { IdsToggleSwitchAssistiveTextComponent } from "./ids-toggle-switch-assistive-text.component";
import { IdsToggleSwitchInputComponent } from "./ids-toggle-switch-input.component";
import { IdsToggleSwitchLabelComponent } from "./ids-toggle-switch-label.component";
import { IdsToggleSwitchThumbComponent } from "./ids-toggle-switch-thumb.component";
import { IdsToggleSwitchTrackComponent } from "./ids-toggle-switch-track.component";

@Component({
  selector: "ids-toggle-switch",
  standalone: true,
  templateUrl: "./ids-toggle-switch.component.html",
  styleUrl: "./ids-toggle-switch.component.scss",
  encapsulation: ViewEncapsulation.None,
  host: {
    "[class]": "hostClass",
    "[attr.data-checked]": 'resolvedChecked ? "" : null',
    "[attr.data-disabled]": 'resolvedDisabled ? "" : null',
  },
  providers: [{ provide: IDS_TOGGLE_SWITCH_CONTEXT, useExisting: IdsToggleSwitchComponent }],
})
export class IdsToggleSwitchComponent
  implements IdsToggleSwitchContext, OnInit, OnChanges, AfterContentInit
{
  @ContentChild(IdsToggleSwitchInputComponent) inputSlot?: IdsToggleSwitchInputComponent;
  @ContentChild(IdsToggleSwitchTrackComponent) trackSlot?: IdsToggleSwitchTrackComponent;
  @ContentChild(IdsToggleSwitchThumbComponent) thumbSlot?: IdsToggleSwitchThumbComponent;
  @ContentChild(IdsToggleSwitchLabelComponent) labelSlot?: IdsToggleSwitchLabelComponent;
  @ContentChild(IdsToggleSwitchAssistiveTextComponent)
  assistiveSlot?: IdsToggleSwitchAssistiveTextComponent;

  @Input() checked?: boolean;
  @Input() defaultChecked = TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS.defaultChecked;
  @Input() disabled = TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() label?: string;
  @Input() id?: string;
  @Input() name?: string;
  @Input() value?: string;
  @Input() className?: string;
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;

  @Output() readonly onCheckedChange = new EventEmitter<boolean>();

  hasInputSlot = false;
  hasTrackSlot = false;
  hasThumbSlot = false;
  hasLabelSlot = false;
  hasAssistiveSlot = false;

  private internalChecked: boolean = TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS.defaultChecked;
  private readonly generatedId = `ids-toggle-switch-${Math.random().toString(36).slice(2, 9)}`;

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
  }

  ngAfterContentInit(): void {
    this.hasInputSlot = Boolean(this.inputSlot);
    this.hasTrackSlot = Boolean(this.trackSlot);
    this.hasThumbSlot = Boolean(this.thumbSlot);
    this.hasLabelSlot = Boolean(this.labelSlot);
    this.hasAssistiveSlot = Boolean(this.assistiveSlot);
    this.cdr.markForCheck();
  }

  get isControlled(): boolean {
    return this.checked !== undefined;
  }

  get resolvedChecked(): boolean {
    return this.isControlled ? Boolean(this.checked) : this.internalChecked;
  }

  get resolvedDisabled(): boolean {
    return this.disabled;
  }

  get resolvedId(): string {
    return this.id || this.generatedId;
  }

  get resolvedName(): string | undefined {
    return this.name;
  }

  get resolvedValue(): string | undefined {
    return this.value;
  }

  get resolvedLabel(): string | undefined {
    return this.label;
  }

  get assistiveId(): string | undefined {
    return this.hasAssistiveSlot ? `${this.resolvedId}-assistive` : undefined;
  }

  get describedBy(): string | undefined {
    if (this.ariaDescribedBy && this.assistiveId) {
      return `${this.ariaDescribedBy} ${this.assistiveId}`;
    }
    return this.ariaDescribedBy ?? this.assistiveId;
  }

  get hostClass(): string {
    return ["ids-toggle-switch", this.className].filter(Boolean).join(" ");
  }

  get showFallbackLabel(): boolean {
    return !this.hasLabelSlot && Boolean(this.label);
  }

  onInputChange(event: Event): void {
    if (this.resolvedDisabled) {
      return;
    }
    const next = (event.target as HTMLInputElement).checked;
    if (!this.isControlled) {
      this.internalChecked = next;
    }
    this.onCheckedChange.emit(next);
    this.cdr.markForCheck();
  }
}
