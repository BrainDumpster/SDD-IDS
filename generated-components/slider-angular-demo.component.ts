import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SliderAngularComponent } from './slider-angular.component';

@Component({
  selector: 'ids-slider-angular-demo',
  standalone: true,
  imports: [SliderAngularComponent],
  template: `
    <section style="display:grid;gap:20px;max-width:720px;padding:24px;">
      <h2>Angular Slider Demo</h2>

      <ids-slider
        [min]="0"
        [max]="100"
        [step]="5"
        [value]="singleValue"
        [showLable]="true"
        [showStepper]="true"
        [showValueInput]="true"
        (onValueChange)="singleValue = $event"
      ></ids-slider>

      <ids-slider
        [min]="0"
        [max]="100"
        [step]="5"
        [value]="rangeValue"
        [showLable]="true"
        [showStepper]="true"
        [showValueInput]="true"
        (onValueChange)="onRangeChange()"
      ></ids-slider>

      <ids-slider
        [min]="0"
        [max]="100"
        [step]="5"
        [value]="40"
        [showLable]="true"
        [showStepper]="true"
        [showValueInput]="true"
        [disabled]="true"
      ></ids-slider>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderAngularDemoComponent {
  singleValue: number | string = 25;
  rangeValue: Array<number | string> = [20, 70];

  onRangeChange(): void {
    // Range value is already two-way reflected by slider input event handling.
  }
}
