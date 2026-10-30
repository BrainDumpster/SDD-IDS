import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  AfterContentInit,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  IDS_DROPDOWN_CONTEXT,
  type IdsDropdownContext,
} from "./ids-dropdown-context";
import { IdsDropdownMenuComponent } from "./ids-dropdown-menu.component";
import type { IdsDropdownMode, IdsDropdownSelectionMode } from "./ids-dropdown.types";

function selectionModeForMode(mode: IdsDropdownMode): IdsDropdownSelectionMode {
  switch (mode) {
    case "combobox-multi":
    case "multi-select":
      return "multi";
    case "combobox-single":
    case "single-select":
      return "single";
    default:
      return "single";
  }
}

@Component({
  selector: "ids-dropdown",
  standalone: true,
  templateUrl: "./ids-dropdown.component.html",
  styleUrl: "./ids-dropdown.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: IDS_DROPDOWN_CONTEXT, useExisting: IdsDropdownComponent }],
})
export class IdsDropdownComponent implements IdsDropdownContext, OnChanges, AfterContentInit {
  @ContentChild(IdsDropdownMenuComponent) menu?: IdsDropdownMenuComponent;

  @Input() mode: IdsDropdownMode = "single-select";
  @Input() disabled = false;
  /** @deprecated Prefer `showRadio` (React/spec name). */
  @Input() showSingleSelectRadio = false;
  /** Spec/React alias for radio option visuals. When set, wins over `showSingleSelectRadio`. */
  @Input() showRadio?: boolean | null;
  @Input() value?: string;
  @Input() values: string[] = [];
  @Input() defaultValue?: string;
  @Input() defaultValues: string[] = [];

  @Output() readonly valueChange = new EventEmitter<string>();
  @Output() readonly valuesChange = new EventEmitter<string[]>();
  @Output() readonly selectionChange = new EventEmitter<string | string[]>();

  selectedValues: string[] = [];
  private describedBy = new Set<string>();

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get selectionMode(): IdsDropdownSelectionMode {
    return selectionModeForMode(this.mode);
  }

  /** Resolved radio visibility (React `showRadio` preferred). */
  get resolvedShowRadio(): boolean {
    return this.showRadio ?? this.showSingleSelectRadio;
  }

  ngAfterContentInit(): void {
    this.syncMenuFromRoot();
    this.syncSelectedFromInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["value"] || changes["values"] || changes["defaultValue"] || changes["defaultValues"]) {
      this.syncSelectedFromInputs();
    }
    if (changes["disabled"] || changes["showSingleSelectRadio"] || changes["showRadio"] || changes["mode"]) {
      this.syncMenuFromRoot();
    }
  }

  private syncMenuFromRoot(): void {
    if (!this.menu) {
      return;
    }
    this.menu.disabled = this.disabled;
    this.menu.selectionMode = this.selectionMode;
    this.menu.showSingleSelectRadio = this.resolvedShowRadio;
    this.menu.selectedValues = [...this.selectedValues];
    this.menu.describedBy = this.describedByIds();
    this.menu.syncTriggerShellFilled();
    this.cdr.markForCheck();
  }

  private syncSelectedFromInputs(): void {
    if (this.selectionMode === "single") {
      const next = this.value ?? this.defaultValue;
      this.selectedValues = next ? [next] : [];
    } else {
      this.selectedValues = [...(this.values.length ? this.values : this.defaultValues)];
    }
    if (this.menu) {
      this.menu.selectedValues = [...this.selectedValues];
      this.menu.syncTriggerShellFilled();
      this.cdr.markForCheck();
    }
  }

  isSelected(value: string): boolean {
    return this.selectedValues.includes(value);
  }

  toggleValue(value: string): void {
    if (this.disabled) {
      return;
    }
    let next: string[];
    if (this.selectionMode === "single") {
      next = [value];
      this.valueChange.emit(value);
      this.selectionChange.emit(value);
    } else {
      next = this.selectedValues.includes(value)
        ? this.selectedValues.filter((entry) => entry !== value)
        : [...this.selectedValues, value];
      this.valuesChange.emit(next);
      this.selectionChange.emit(next);
    }
    this.selectedValues = next;
    if (this.menu) {
      this.menu.selectedValues = [...next];
      this.menu.syncTriggerShellFilled();
    }
    this.cdr.markForCheck();
  }

  registerDescribedBy(id: string): void {
    this.describedBy.add(id);
    if (this.menu) {
      this.menu.describedBy = this.describedByIds();
    }
  }

  unregisterDescribedBy(id: string): void {
    this.describedBy.delete(id);
    if (this.menu) {
      this.menu.describedBy = this.describedByIds();
    }
  }

  describedByIds(): string {
    return [...this.describedBy].join(" ");
  }
}
