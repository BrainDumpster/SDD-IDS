import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type SliderValue = string | number | Array<string | number>;

@Component({
  selector: 'ids-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider-angular.component.html',
  styleUrl: './slider-angular.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderAngularComponent {
  @Input() min = 0;
  @Input() max = 100;
  @Input() value: SliderValue = '';
  @Input() disabled = false;
  @Input() customLabel: string[] = [];
  @Input() showLable = false; // kept as requested API name
  @Input() showTicks = false;
  @Input() showStepper = false; // alias to showTicks
  @Input() step = 1;
  @Input() showValueInput = false;

  @Output() onValueChange = new EventEmitter<number | string>();

  get isRange(): boolean {
    return Array.isArray(this.value);
  }

  get normalizedMin(): number {
    return this.toNumber(this.min, 0);
  }

  get normalizedMax(): number {
    const max = this.toNumber(this.max, 100);
    return max > this.normalizedMin ? max : this.normalizedMin + 1;
  }

  get normalizedStep(): number {
    const step = this.toNumber(this.step, 1);
    return step > 0 ? step : 1;
  }

  get normalizedValue(): number | [number, number] {
    const min = this.normalizedMin;
    const max = this.normalizedMax;

    if (this.isRange) {
      const raw = this.value as Array<string | number>;
      const a = this.clamp(this.toNumber(raw[0], min), min, max);
      const b = this.clamp(this.toNumber(raw[1], max), min, max);
      return a <= b ? [a, b] : [b, a];
    }

    return this.clamp(this.toNumber(this.value, min), min, max);
  }

  get labels(): [string, string] {
    if (!this.showLable) return ['', ''];
    if (this.customLabel?.length >= 2) return [this.customLabel[0] ?? '', this.customLabel[1] ?? ''];
    return [String(this.normalizedMin), String(this.normalizedMax)];
  }

  get stepperEnabled(): boolean {
    return this.showTicks || this.showStepper;
  }

  get stepValues(): number[] {
    const min = this.normalizedMin;
    const max = this.normalizedMax;
    const step = this.normalizedStep;
    const values = [min];
    let current = min;
    const epsilon = step / 1000;
    while (current + step < max - epsilon) {
      current += step;
      values.push(current);
    }
    if (values[values.length - 1] !== max) values.push(max);
    return Array.from(new Set(values.map((v) => Number(v.toFixed(6))))).sort((a, b) => a - b);
  }

  get thumbPercents(): number[] {
    const min = this.normalizedMin;
    const max = this.normalizedMax;
    const range = max - min || 1;
    const val = this.normalizedValue;
    if (Array.isArray(val)) {
      return [((val[0] - min) / range) * 100, ((val[1] - min) / range) * 100];
    }
    return [((val - min) / range) * 100];
  }

  isStepperSelected(tick: number): boolean {
    const val = this.normalizedValue;
    if (Array.isArray(val)) return tick >= val[0] && tick <= val[1];
    return tick <= val;
  }

  trackFillStyle(): Record<string, string> {
    const min = this.normalizedMin;
    const max = this.normalizedMax;
    const range = max - min || 1;
    const val = this.normalizedValue;
    if (Array.isArray(val)) {
      const left = ((val[0] - min) / range) * 100;
      const right = ((val[1] - min) / range) * 100;
      return { left: `${left}%`, right: `${100 - right}%` };
    }
    const right = 100 - (((val as number) - min) / range) * 100;
    return { left: '0%', right: `${right}%` };
  }

  thumbLeftStyle(percent: number): string {
    return `left: calc((100% - 16px) * ${percent / 100} + 8px);`;
  }

  onSingleInput(raw: string): void {
    const next = this.clamp(this.toNumber(raw, this.normalizedMin), this.normalizedMin, this.normalizedMax);
    this.value = next;
    this.onValueChange.emit(next);
  }

  onRangeInput(index: 0 | 1, raw: string): void {
    const val = this.normalizedValue as [number, number];
    const next = this.clamp(this.toNumber(raw, this.normalizedMin), this.normalizedMin, this.normalizedMax);
    const out: [number, number] = [...val];
    if (index === 0) {
      out[0] = Math.min(next, out[1]);
      this.onValueChange.emit(out[0]);
    } else {
      out[1] = Math.max(next, out[0]);
      this.onValueChange.emit(out[1]);
    }
    this.value = out;
  }

  private toNumber(value: unknown, fallback: number): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
