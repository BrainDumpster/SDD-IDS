import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  SLIDER_RUNTIME_DEFAULTS,
  type IdsSliderMode,
  type IdsSliderValue,
} from "@component-contracts/ids/slider.contract";
import { IdsTextBoxComponent } from "../text-box/ids-text-box.component";
import {
  buildTicks,
  clamp,
  normalizeBounds,
  normalizeFrequency,
  normalizeRange,
  normalizeSingle,
  normalizeStep,
  resolveSliderMode,
  toArrayValue,
  toOutputValue,
  valueToPercent,
  valuesEqual,
} from "./ids-slider.utils";

@Component({
  selector: "ids-slider",
  standalone: true,
  imports: [IdsTextBoxComponent],
  templateUrl: "./ids-slider.component.html",
  styleUrl: "./ids-slider.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    "[class]": "hostClass",
    "[attr.data-ids]": "'ids-slider'",
    "[attr.data-mode]": "resolvedMode",
    "[attr.data-disabled]": 'resolvedDisabled ? "true" : null',
    "[attr.data-stepper]": 'steppersOn ? "on" : "off"',
  },
})
export class IdsSliderComponent implements OnChanges {
  @ViewChild("railRef") railRef?: ElementRef<HTMLDivElement>;

  @Input() mode: IdsSliderMode | string = SLIDER_RUNTIME_DEFAULTS.mode;
  @Input() min!: number;
  @Input() max!: number;
  @Input() step: number = SLIDER_RUNTIME_DEFAULTS.step;
  @Input() value?: IdsSliderValue;
  @Input() defaultValue?: IdsSliderValue;
  @Input() disabled = SLIDER_RUNTIME_DEFAULTS.disabled;
  @Input() showStepper = SLIDER_RUNTIME_DEFAULTS.showStepper;
  @Input() showTicks = SLIDER_RUNTIME_DEFAULTS.showTicks;
  @Input() stepperFrequency?: number;
  @Input() showValueLabel = SLIDER_RUNTIME_DEFAULTS.showValueLabel;
  @Input() showValueInput = SLIDER_RUNTIME_DEFAULTS.showValueInput;
  @Input() minLabel?: string;
  @Input() maxLabel?: string;
  @Input() className?: string;
  @Input() id?: string;

  @Output() readonly onValueChange = new EventEmitter<IdsSliderValue>();
  @Output() readonly onValueCommit = new EventEmitter<IdsSliderValue>();

  private internal: number[] = [];
  private initialized = false;
  private dragging: 0 | 1 | null = null;
  private readonly generatedId = `ids-slider-${Math.random().toString(36).slice(2, 9)}`;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const boundsOrModeChanged =
      Boolean(changes["mode"]) ||
      Boolean(changes["min"]) ||
      Boolean(changes["max"]) ||
      Boolean(changes["step"]) ||
      Boolean(changes["stepperFrequency"]) ||
      Boolean(changes["showStepper"]) ||
      Boolean(changes["showTicks"]);

    if (!this.initialized) {
      this.internal = toArrayValue(
        this.resolvedMode,
        this.defaultValue,
        this.resolvedMin,
        this.resolvedMax,
        this.activeStep,
      );
      this.initialized = true;
      return;
    }

    if (!this.isControlled && boundsOrModeChanged) {
      this.internal = toArrayValue(
        this.resolvedMode,
        toOutputValue(this.resolvedMode, this.internal),
        this.resolvedMin,
        this.resolvedMax,
        this.activeStep,
      );
    }
  }

  get resolvedMode(): IdsSliderMode {
    return resolveSliderMode(this.mode);
  }

  get resolvedMin(): number {
    return normalizeBounds(this.min, this.max).min;
  }

  get resolvedMax(): number {
    return normalizeBounds(this.min, this.max).max;
  }

  get safeStep(): number {
    return normalizeStep(this.step);
  }

  get steppersOn(): boolean {
    return Boolean(this.showStepper || this.showTicks);
  }

  get frequency(): number {
    return normalizeFrequency(this.stepperFrequency, this.safeStep);
  }

  get activeStep(): number {
    return this.steppersOn ? this.frequency : this.safeStep;
  }

  get isControlled(): boolean {
    return this.value !== undefined;
  }

  get currentValues(): number[] {
    if (this.isControlled) {
      return toArrayValue(
        this.resolvedMode,
        this.value,
        this.resolvedMin,
        this.resolvedMax,
        this.activeStep,
      );
    }
    return toArrayValue(
      this.resolvedMode,
      toOutputValue(this.resolvedMode, this.internal),
      this.resolvedMin,
      this.resolvedMax,
      this.activeStep,
    );
  }

  get resolvedDisabled(): boolean {
    return this.disabled;
  }

  get resolvedId(): string {
    return this.id || this.generatedId;
  }

  get hostClass(): string {
    return ["ids-slider", this.className].filter(Boolean).join(" ");
  }

  get hasMinLabel(): boolean {
    return this.minLabel != null && this.minLabel !== "";
  }

  get hasMaxLabel(): boolean {
    return this.maxLabel != null && this.maxLabel !== "";
  }

  get minActive(): boolean {
    return this.currentValues.some((value) => value === this.resolvedMin);
  }

  get maxActive(): boolean {
    return this.currentValues.some((value) => value === this.resolvedMax);
  }

  get ticks(): number[] {
    if (!this.steppersOn) {
      return [];
    }
    return buildTicks(this.resolvedMin, this.resolvedMax, this.frequency);
  }

  get segmentLeft(): string {
    if (this.resolvedMode === "single") {
      return "0";
    }
    return `${valueToPercent(this.currentValues[0], this.resolvedMin, this.resolvedMax)}%`;
  }

  get segmentWidth(): string {
    if (this.resolvedMode === "single") {
      return `${valueToPercent(this.currentValues[0], this.resolvedMin, this.resolvedMax)}%`;
    }
    const start = valueToPercent(
      this.currentValues[0],
      this.resolvedMin,
      this.resolvedMax,
    );
    const end = valueToPercent(
      this.currentValues[1],
      this.resolvedMin,
      this.resolvedMax,
    );
    return `${end - start}%`;
  }

  get inputValueMin(): string {
    return String(this.currentValues[0]);
  }

  get inputValueMax(): string {
    return String(this.currentValues[1] ?? this.currentValues[0]);
  }

  percentStyle(value: number): string {
    return `${valueToPercent(value, this.resolvedMin, this.resolvedMax)}%`;
  }

  isTickSelected(tick: number): boolean {
    if (this.resolvedMode === "range") {
      return tick >= this.currentValues[0] && tick <= this.currentValues[1];
    }
    return tick <= this.currentValues[0];
  }

  thumbName(index: 0 | 1): string {
    if (this.resolvedMode === "range") {
      return index === 0 ? "Minimum value" : "Maximum value";
    }
    return "Slider value";
  }

  onRailPointerDown(event: PointerEvent): void {
    if (this.resolvedDisabled) {
      return;
    }
    if (event.button !== 0) {
      return;
    }
    const target = event.target as HTMLElement;
    if (
      target.closest(
        '[data-ids="ids-slider-thumb-min"], [data-ids="ids-slider-thumb-max"]',
      )
    ) {
      return;
    }
    const nextVal = this.clientXToValue(event.clientX);
    this.beginDrag(
      this.pickThumbForRail(nextVal),
      event.clientX,
      event.currentTarget as HTMLElement,
      event.pointerId,
    );
  }

  onRailPointerMove(event: PointerEvent): void {
    if (this.resolvedDisabled || this.dragging == null) {
      return;
    }
    this.setThumbValue(this.dragging, this.clientXToValue(event.clientX), false);
  }

  endDrag(event: PointerEvent): void {
    if (this.dragging == null) {
      return;
    }
    this.dragging = null;
    const current = event.currentTarget as HTMLElement;
    if (current.hasPointerCapture(event.pointerId)) {
      current.releasePointerCapture(event.pointerId);
    }
    this.onValueCommit.emit(
      toOutputValue(this.resolvedMode, this.latestValues()),
    );
  }

  onThumbPointerDown(index: 0 | 1, event: PointerEvent): void {
    if (this.resolvedDisabled) {
      return;
    }
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const control = this.railRef?.nativeElement;
    if (!control) {
      return;
    }
    this.beginDrag(index, event.clientX, control, event.pointerId);
  }

  onThumbKeyDown(index: 0 | 1, event: KeyboardEvent): void {
    if (this.resolvedDisabled) {
      return;
    }
    let delta = 0;
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        delta = -this.activeStep;
        break;
      case "ArrowRight":
      case "ArrowUp":
        delta = this.activeStep;
        break;
      case "Home":
        event.preventDefault();
        this.setThumbValue(index, this.resolvedMin, true);
        return;
      case "End":
        event.preventDefault();
        this.setThumbValue(index, this.resolvedMax, true);
        return;
      default:
        return;
    }
    event.preventDefault();
    const current = this.latestValues()[index];
    this.setThumbValue(index, current + delta, true);
  }

  onInputCommit(index: 0 | 1, raw: string): void {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      return;
    }
    this.setThumbValue(index, parsed, true);
  }

  private beginDrag(
    thumb: 0 | 1,
    clientX: number,
    target: HTMLElement,
    pointerId: number,
  ): void {
    this.dragging = thumb;
    this.setThumbValue(thumb, this.clientXToValue(clientX), false);
    target.setPointerCapture(pointerId);
  }

  private clientXToValue(clientX: number): number {
    const el = this.railRef?.nativeElement;
    if (!el) {
      return this.resolvedMin;
    }
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) {
      return this.resolvedMin;
    }
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return normalizeSingle(
      this.resolvedMin + ratio * (this.resolvedMax - this.resolvedMin),
      this.resolvedMin,
      this.resolvedMax,
      this.activeStep,
    );
  }

  private pickThumbForRail(nextVal: number): 0 | 1 {
    if (this.resolvedMode === "single") {
      return 0;
    }
    const [lo, hi] = this.latestValues();
    const distLo = Math.abs(nextVal - lo);
    const distHi = Math.abs(nextVal - hi);
    if (distLo === distHi) {
      const mid = (lo + hi) / 2;
      return nextVal <= mid ? 0 : 1;
    }
    return distLo < distHi ? 0 : 1;
  }

  private latestValues(): number[] {
    return this.currentValues;
  }

  private commitValues(next: number[], emitCommit: boolean): void {
    const normalized =
      this.resolvedMode === "range"
        ? normalizeRange(
            [next[0] ?? this.resolvedMin, next[1] ?? this.resolvedMin],
            this.resolvedMin,
            this.resolvedMax,
            this.activeStep,
          )
        : [
            normalizeSingle(
              next[0] ?? this.resolvedMin,
              this.resolvedMin,
              this.resolvedMax,
              this.activeStep,
            ),
          ];
    if (!this.isControlled && !valuesEqual(this.internal, normalized)) {
      this.internal = normalized;
    }
    const out = toOutputValue(this.resolvedMode, normalized);
    this.onValueChange.emit(out);
    if (emitCommit) {
      this.onValueCommit.emit(out);
    }
    this.cdr.markForCheck();
  }

  private setThumbValue(index: 0 | 1, nextRaw: number, emitCommit: boolean): void {
    const nextVal = normalizeSingle(
      nextRaw,
      this.resolvedMin,
      this.resolvedMax,
      this.activeStep,
    );
    if (this.resolvedMode === "single") {
      this.commitValues([nextVal], emitCommit);
      return;
    }
    const latest = this.latestValues();
    const draft: [number, number] = [latest[0], latest[1]];
    if (index === 0) {
      draft[0] = Math.min(nextVal, draft[1]);
    } else {
      draft[1] = Math.max(nextVal, draft[0]);
    }
    this.commitValues(draft, emitCommit);
  }
}
