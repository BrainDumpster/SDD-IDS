/**
 * IdsSlider — Lit web component.
 *
 * Tag: `ids-slider`
 * Spec: `components/ids/slider/design-spec.md`
 * API parity: `lib/react/ids/slider` (`IdsSlider`)
 *
 * Anatomy:
 *   SliderRoot
 *     SliderMinLabel?
 *     SliderRail (+ Progress/Range segment, TickList, Thumbs, ValueLabels)
 *     SliderMaxLabel?
 *     SliderValueInputMin? (+ separator + SliderValueInputMax? in range)
 *
 * Events (bubbles + composed):
 *   `value-change` → detail: IdsSliderValue  (React onValueChange)
 *   `value-commit` → detail: IdsSliderValue  (React onValueCommit)
 */
import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import {
  SLIDER_RUNTIME_DEFAULTS,
  buildTicks,
  normalizeBounds,
  normalizeFrequency,
  normalizeRange,
  normalizeSingle,
  normalizeStep,
  parseSliderValue,
  resolveSliderMode,
  toArrayValue,
  toOutputValue,
  valueToPercent,
  type IdsSliderMode,
  type IdsSliderValue,
} from "./slider.constants.js";
import { sliderStyles } from "./slider.styles.js";

export class IdsSlider extends LitElement {
  static override styles = [sliderStyles];

  /** `"single"` | `"range"` — unknown → `single`. */
  @property({ type: String, reflect: true })
  mode: IdsSliderMode | string = SLIDER_RUNTIME_DEFAULTS.mode;

  @property({ type: Number })
  min = 0;

  @property({ type: Number })
  max = 100;

  @property({ type: Number })
  step = SLIDER_RUNTIME_DEFAULTS.step;

  /**
   * Controlled value. Prefer property binding for range:
   * `.value=${[30, 60]}` or `value='[30,60]'`.
   */
  @property({
    attribute: "value",
    converter: {
      fromAttribute: (value: string | null) => parseSliderValue(value),
      toAttribute: (value: IdsSliderValue | undefined) => {
        if (value === undefined) return null;
        return Array.isArray(value) ? JSON.stringify(value) : String(value);
      },
    },
  })
  value: IdsSliderValue | undefined = undefined;

  /** Uncontrolled initial value (property or attribute). */
  @property({
    attribute: "defaultvalue",
    converter: {
      fromAttribute: (value: string | null) => parseSliderValue(value),
    },
  })
  defaultValue: IdsSliderValue | undefined = undefined;

  @property({ type: Boolean, reflect: true })
  disabled = SLIDER_RUNTIME_DEFAULTS.disabled;

  @property({ type: Boolean, attribute: "showstepper", reflect: true })
  showStepper = SLIDER_RUNTIME_DEFAULTS.showStepper;

  /** Alias of `showStepper` — OR’d with `showStepper`. */
  @property({ type: Boolean, attribute: "showticks", reflect: true })
  showTicks = SLIDER_RUNTIME_DEFAULTS.showTicks;

  @property({ type: Number, attribute: "stepperfrequency" })
  stepperFrequency: number | undefined = undefined;

  /**
   * Default `true` (spec). Lit Boolean attrs treat absence as false, so use
   * an explicit converter: missing/`true` → true, only `"false"` → false.
   */
  @property({
    attribute: "showvaluelabel",
    converter: {
      fromAttribute: (value: string | null) => value !== "false",
      toAttribute: (value: boolean) => (value ? "true" : "false"),
    },
  })
  showValueLabel = SLIDER_RUNTIME_DEFAULTS.showValueLabel;

  @property({ type: Boolean, attribute: "showvalueinput", reflect: true })
  showValueInput = SLIDER_RUNTIME_DEFAULTS.showValueInput;

  @property({ type: String, attribute: "minlabel" })
  minLabel = "";

  @property({ type: String, attribute: "maxlabel" })
  maxLabel = "";

  @state()
  private internal: number[] = [];

  private initialized = false;
  private dragging: 0 | 1 | null = null;
  private railEl: HTMLDivElement | null = null;
  private latestValues: number[] = [];
  private readonly generatedId = `ids-slider-${Math.random().toString(36).slice(2, 9)}`;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-slider");
    this.ensureInitialized();
  }

  override willUpdate(changed: Map<string, unknown>): void {
    this.ensureInitialized();
    if (
      !this.isControlled() &&
      (changed.has("mode") ||
        changed.has("min") ||
        changed.has("max") ||
        changed.has("step") ||
        changed.has("stepperFrequency") ||
        changed.has("showStepper") ||
        changed.has("showTicks"))
    ) {
      this.internal = toArrayValue(
        this.resolvedMode,
        toOutputValue(this.resolvedMode, this.internal),
        this.resolvedMin,
        this.resolvedMax,
        this.activeStep,
      );
    }
  }

  private ensureInitialized(): void {
    if (this.initialized) return;
    this.internal = toArrayValue(
      this.resolvedMode,
      this.defaultValue,
      this.resolvedMin,
      this.resolvedMax,
      this.activeStep,
    );
    this.initialized = true;
  }

  private get resolvedMode(): IdsSliderMode {
    return resolveSliderMode(this.mode);
  }

  private get resolvedMin(): number {
    return normalizeBounds(this.min, this.max).min;
  }

  private get resolvedMax(): number {
    return normalizeBounds(this.min, this.max).max;
  }

  private get safeStep(): number {
    return normalizeStep(this.step);
  }

  private get steppersOn(): boolean {
    return Boolean(this.showStepper || this.showTicks);
  }

  private get frequency(): number {
    return normalizeFrequency(this.stepperFrequency, this.safeStep);
  }

  private get activeStep(): number {
    return this.steppersOn ? this.frequency : this.safeStep;
  }

  private isControlled(): boolean {
    return this.value !== undefined;
  }

  private currentValues(): number[] {
    if (this.isControlled()) {
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

  private emitChange(out: IdsSliderValue, emitCommit: boolean): void {
    this.dispatchEvent(
      new CustomEvent("value-change", {
        detail: out,
        bubbles: true,
        composed: true,
      }),
    );
    if (emitCommit) {
      this.dispatchEvent(
        new CustomEvent("value-commit", {
          detail: out,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private commitValues(next: number[], emitCommit: boolean): void {
    const { resolvedMode: mode, resolvedMin: min, resolvedMax: max, activeStep } =
      this;
    const normalized =
      mode === "range"
        ? normalizeRange([next[0] ?? min, next[1] ?? min], min, max, activeStep)
        : [normalizeSingle(next[0] ?? min, min, max, activeStep)];
    if (!this.isControlled()) {
      this.internal = normalized;
    }
    this.latestValues = normalized;
    this.emitChange(toOutputValue(mode, normalized), emitCommit);
    this.requestUpdate();
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
    const draft: [number, number] = [
      this.latestValues[0] ?? this.resolvedMin,
      this.latestValues[1] ?? this.resolvedMin,
    ];
    if (index === 0) {
      draft[0] = Math.min(nextVal, draft[1]);
    } else {
      draft[1] = Math.max(nextVal, draft[0]);
    }
    this.commitValues(draft, emitCommit);
  }

  private clientXToValue(clientX: number): number {
    const el = this.railEl;
    if (!el) return this.resolvedMin;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return this.resolvedMin;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return normalizeSingle(
      this.resolvedMin + ratio * (this.resolvedMax - this.resolvedMin),
      this.resolvedMin,
      this.resolvedMax,
      this.activeStep,
    );
  }

  private pickThumbForRail(nextVal: number): 0 | 1 {
    if (this.resolvedMode === "single") return 0;
    const [lo, hi] = this.latestValues;
    const distLo = Math.abs(nextVal - lo);
    const distHi = Math.abs(nextVal - hi);
    if (distLo === distHi) {
      const mid = (lo + hi) / 2;
      return nextVal <= mid ? 0 : 1;
    }
    return distLo < distHi ? 0 : 1;
  }

  private beginDrag(thumb: 0 | 1, clientX: number, target: HTMLElement, pointerId: number): void {
    this.dragging = thumb;
    this.setThumbValue(thumb, this.clientXToValue(clientX), false);
    target.setPointerCapture(pointerId);
  }

  private onRailPointerDown = (event: PointerEvent): void => {
    if (this.disabled) return;
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (
      target.closest('[data-ids="ids-slider-thumb-min"], [data-ids="ids-slider-thumb-max"]')
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
  };

  private onRailPointerMove = (event: PointerEvent): void => {
    if (this.disabled || this.dragging == null) return;
    this.setThumbValue(this.dragging, this.clientXToValue(event.clientX), false);
  };

  private endDrag = (event: PointerEvent): void => {
    if (this.dragging == null) return;
    this.dragging = null;
    const current = event.currentTarget as HTMLElement;
    if (current.hasPointerCapture(event.pointerId)) {
      current.releasePointerCapture(event.pointerId);
    }
    this.dispatchEvent(
      new CustomEvent("value-commit", {
        detail: toOutputValue(this.resolvedMode, this.latestValues),
        bubbles: true,
        composed: true,
      }),
    );
  };

  private onThumbKeyDown(index: 0 | 1, event: KeyboardEvent): void {
    if (this.disabled) return;
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
    const current = this.latestValues[index];
    this.setThumbValue(index, current + delta, true);
  }

  private onInputCommit(index: 0 | 1, raw: string): void {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    this.setThumbValue(index, parsed, true);
  }

  private isTickSelected(tick: number, values: number[]): boolean {
    if (this.resolvedMode === "range") {
      return tick >= values[0] && tick <= values[1];
    }
    return tick <= values[0];
  }

  private renderThumb(index: 0 | 1, val: number) {
    const left = `${valueToPercent(val, this.resolvedMin, this.resolvedMax)}%`;
    const name =
      this.resolvedMode === "range"
        ? index === 0
          ? "Minimum value"
          : "Maximum value"
        : "Slider value";
    return html`
      <button
        type="button"
        class="ids-slider-thumb"
        data-ids=${index === 0 ? "ids-slider-thumb-min" : "ids-slider-thumb-max"}
        style=${styleMap({ left })}
        role="slider"
        aria-label=${name}
        aria-valuemin=${this.resolvedMin}
        aria-valuemax=${this.resolvedMax}
        aria-valuenow=${val}
        aria-disabled=${this.disabled ? "true" : nothing}
        ?disabled=${this.disabled}
        tabindex=${this.disabled ? -1 : 0}
        @keydown=${(event: KeyboardEvent) => this.onThumbKeyDown(index, event)}
        @pointerdown=${(event: PointerEvent) => {
          if (this.disabled) return;
          if (event.button !== 0) return;
          event.preventDefault();
          event.stopPropagation();
          if (!this.railEl) return;
          this.beginDrag(index, event.clientX, this.railEl, event.pointerId);
        }}
      ></button>
    `;
  }

  override render() {
    const mode = this.resolvedMode;
    const min = this.resolvedMin;
    const max = this.resolvedMax;
    const values = this.currentValues();
    this.latestValues = values;
    const steppersOn = this.steppersOn;
    const ticks = steppersOn ? buildTicks(min, max, this.frequency) : [];
    const minActive = values.some((v) => v === min);
    const maxActive = values.some((v) => v === max);
    const rootId = this.id || this.generatedId;

    const segmentStyle =
      mode === "single"
        ? { width: `${valueToPercent(values[0], min, max)}%` }
        : {
            left: `${valueToPercent(values[0], min, max)}%`,
            width: `${
              valueToPercent(values[1], min, max) - valueToPercent(values[0], min, max)
            }%`,
          };

    return html`
      <div
        id=${rootId}
        class="ids-slider"
        data-ids="ids-slider"
        data-mode=${mode}
        data-disabled=${this.disabled ? "true" : nothing}
        data-stepper=${steppersOn ? "on" : "off"}
      >
        <div class="ids-slider-row" data-ids="ids-slider-row">
          ${this.minLabel
            ? html`<span
                class="ids-slider-min-label"
                data-ids="ids-slider-min-label"
                data-active=${minActive ? "true" : nothing}
                >${this.minLabel}</span
              >`
            : nothing}

          <div class="ids-slider-rail-wrap" data-ids="ids-slider-rail-wrap">
            <div
              class="ids-slider-control"
              data-ids="ids-slider-control"
              @pointerdown=${this.onRailPointerDown}
              @pointermove=${this.onRailPointerMove}
              @pointerup=${this.endDrag}
              @pointercancel=${this.endDrag}
            >
              <div
                class="ids-slider-rail"
                data-ids="ids-slider-rail"
                aria-hidden="true"
              >
                ${mode === "single"
                  ? html`<div
                      class="ids-slider-progress"
                      data-ids="ids-slider-progress"
                      style=${styleMap(segmentStyle)}
                    ></div>`
                  : html`<div
                      class="ids-slider-range"
                      data-ids="ids-slider-range"
                      style=${styleMap(segmentStyle)}
                    ></div>`}

                ${steppersOn && ticks.length > 0
                  ? html`<div
                      class="ids-slider-tick-list"
                      data-ids="ids-slider-tick-list"
                      aria-hidden="true"
                    >
                      ${ticks.map(
                        (tick) => html`<span
                          class="ids-slider-tick"
                          data-ids="ids-slider-tick"
                          data-selected=${this.isTickSelected(tick, values)
                            ? "true"
                            : nothing}
                          style=${styleMap({
                            left: `${valueToPercent(tick, min, max)}%`,
                          })}
                        ></span>`,
                      )}
                    </div>`
                  : nothing}

                ${mode === "single"
                  ? this.renderThumb(0, values[0])
                  : html`${this.renderThumb(0, values[0])}${this.renderThumb(1, values[1])}`}

                ${this.showValueLabel
                  ? html`<div
                      class="ids-slider-value-label-layer"
                      data-ids="ids-slider-value-label-layer"
                      aria-hidden="true"
                    >
                      ${values.map(
                        (v, index) => html`<span
                          class="ids-slider-value-label"
                          data-ids=${index === 0
                            ? "ids-slider-value-label-min"
                            : "ids-slider-value-label-max"}
                          style=${styleMap({
                            left: `${valueToPercent(v, min, max)}%`,
                          })}
                          >${v}</span
                        >`,
                      )}
                    </div>`
                  : nothing}
              </div>
            </div>
          </div>

          ${this.maxLabel
            ? html`<span
                class="ids-slider-max-label"
                data-ids="ids-slider-max-label"
                data-active=${maxActive ? "true" : nothing}
                >${this.maxLabel}</span
              >`
            : nothing}

          ${this.showValueInput
            ? html`<div
                class="ids-slider-input-group"
                data-ids="ids-slider-input-group"
              >
                <div
                  class="ids-slider-value-input"
                  data-ids="ids-slider-value-input-min"
                >
                  <input
                    class="ids-slider-value-input-control"
                    type="number"
                    .value=${String(values[0])}
                    ?disabled=${this.disabled}
                    aria-label=${mode === "range" ? "Minimum value" : "Slider value"}
                    @change=${(event: Event) =>
                      this.onInputCommit(
                        0,
                        (event.target as HTMLInputElement).value,
                      )}
                  />
                </div>
                ${mode === "range"
                  ? html`<span
                        class="ids-slider-input-separator"
                        data-ids="ids-slider-input-separator"
                        aria-hidden="true"
                        >-</span
                      >
                      <div
                        class="ids-slider-value-input"
                        data-ids="ids-slider-value-input-max"
                      >
                        <input
                          class="ids-slider-value-input-control"
                          type="number"
                          .value=${String(values[1])}
                          ?disabled=${this.disabled}
                          aria-label="Maximum value"
                          @change=${(event: Event) =>
                            this.onInputCommit(
                              1,
                              (event.target as HTMLInputElement).value,
                            )}
                        />
                      </div>`
                  : nothing}
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }

  override updated(): void {
    this.railEl = this.renderRoot.querySelector(
      '[data-ids="ids-slider-control"]',
    ) as HTMLDivElement | null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-slider": IdsSlider;
  }
}
