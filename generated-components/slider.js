import { LitElement, css, html } from 'https://esm.sh/lit@3';

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 1;

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export class SliderComponent extends LitElement {
  static properties = {
    min: { type: Number },
    max: { type: Number },
    value: { type: Object },
    disabled: { type: Boolean, reflect: true },
    customLabel: { type: Array },
    showLable: { type: Boolean, reflect: true },
    showTicks: { type: Boolean, reflect: true },
    showStepper: { type: Boolean, reflect: true },
    step: { type: Number },
    showValueInput: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.min = DEFAULT_MIN;
    this.max = DEFAULT_MAX;
    this.value = '';
    this.disabled = false;
    this.customLabel = [];
    this.showLable = false;
    this.showTicks = false;
    this.showStepper = false;
    this.step = DEFAULT_STEP;
    this.showValueInput = false;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
      color: var(--color-text-neutral-strong, #252525);
      font: var(--font-body-2, 400 14px/20px Roboto, sans-serif);
    }
    .root { display:grid; gap:8px; width:100%; }
    .track-row {
      display:grid;
      grid-template-columns:auto 1fr auto auto;
      gap:8px;
      align-items:center;
    }
    .edge-label {
      color:var(--color-text-brand-base, #0076CE);
      min-width: 24px;
      text-align:center;
    }
    .range-wrap { position:relative; width:100%; min-height:52px; display:flex; align-items:center; }
    .base-track, .fill-track {
      position:absolute;
      left:0;
      right:0;
      top:50%;
      transform:translateY(-50%);
      height:4px;
      border-radius:999px;
      pointer-events:none;
      box-sizing:border-box;
    }
    .base-track { background:var(--color-background-gray-light, #EAEAEA); border:1px solid var(--color-border-accessible, #757575); }
    .fill-track { background:var(--color-background-controls-brand-base, #0076CE); border:1px solid var(--color-border-brand-base, #0076CE); }
    input[type='range'] { -webkit-appearance:none; appearance:none; width:100%; height:32px; background:transparent; margin:0; position:relative; z-index:2; }
    input[type='range']::-webkit-slider-runnable-track { height:4px; background:transparent; }
    input[type='range']::-moz-range-track { height:4px; background:transparent; border:0; }
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance:none; appearance:none; width:16px; height:16px; margin-top:-6px; border-radius:50%;
      border:1px solid var(--color-border-brand-base, #0076CE);
      background:var(--color-background-controls-brand-base, #0076CE); cursor:pointer; box-sizing:border-box;
    }
    input[type='range']::-moz-range-thumb {
      width:16px; height:16px; border-radius:50%;
      border:1px solid var(--color-border-brand-base, #0076CE);
      background:var(--color-background-controls-brand-base, #0076CE); cursor:pointer; box-sizing:border-box;
    }
    input[type='range']:hover::-webkit-slider-thumb, input[type='range']:hover::-moz-range-thumb {
      background:var(--color-icon-brand-strong, #0062AB);
      border-color:var(--color-icon-brand-strong, #0062AB);
    }
    input[type='range']:focus-visible::-webkit-slider-thumb, input[type='range']:focus-visible::-moz-range-thumb {
      outline:2px solid var(--color-border-brand-base, #0076CE); outline-offset:2px;
    }
    .range-top {
      position:absolute;
      inset:0;
      z-index:3;
      pointer-events:none;
      display:flex;
      align-items:center;
    }
    .range-top input {
      pointer-events:none;
      background:transparent;
    }
    .range-top input::-webkit-slider-thumb {
      pointer-events:all;
    }
    .range-top input::-moz-range-thumb {
      pointer-events:all;
    }
    .value-inputs { display:flex; gap:4px; align-items:center; }
    .value-inputs input {
      width:72px; border:1px solid var(--color-border-accessible, #757575);
      background:var(--color-background-component, #FFFFFF);
      color:var(--color-text-neutral-strong, #252525); padding:4px 8px; box-sizing:border-box;
    }
    :host([disabled]) .value-inputs input,
    .value-inputs input:disabled {
      color:var(--color-text-disabled, #757575);
      -webkit-text-fill-color:var(--color-text-disabled, #757575);
      border-color:var(--color-border-accessible, #757575);
      background:var(--color-background-gray-light, #EAEAEA);
      opacity:1;
    }
    .tick-overlay {
      position:absolute;
      left:0;
      right:0;
      top:50%;
      transform:translateY(-50%);
      pointer-events:none;
      z-index:1;
      height:8px;
    }
    .tick-mark {
      position:absolute;
      top:0;
      width:8px;
      height:8px;
      border-radius:50%;
      border:1px solid var(--color-border-disabled, #757575);
      background:var(--color-background-component, #FFFFFF);
      box-sizing:border-box;
      transform:translateX(-50%);
    }
    .tick-mark.edge-start {
      transform:none;
    }
    .tick-mark.edge-end {
      transform:translateX(-100%);
    }
    .tick-mark.selected {
      border-color:var(--color-icon-brand-base, #0076CE);
      background:var(--color-icon-brand-base, #0076CE);
    }
    .value-overlay {
      position:absolute;
      left:0;
      right:0;
      top:32px;
      height:18px;
      pointer-events:none;
      z-index:1;
    }
    .value-chip {
      position:absolute;
      transform:translateX(-50%);
      color:var(--color-text-brand-base, #0076CE);
      font:400 12px/18px Roboto,sans-serif;
      white-space:nowrap;
    }
    :host([disabled]) .value-chip {
      color:var(--color-text-disabled, #757575);
    }
    .ticks { display:flex; justify-content:space-between; padding-inline:8px; color:var(--color-text-brand-base, #0076CE); font:400 12px/18px Roboto,sans-serif; }
    :host([disabled]) .base-track {
      border-color:var(--color-border-disabled, #757575);
      background:var(--color-background-gray-light, #EAEAEA);
    }
    :host([disabled]) .fill-track {
      border-color:var(--color-border-disabled, #757575);
      background:var(--color-icon-disabled, #757575);
    }
    :host([disabled]) input[type='range']::-webkit-slider-thumb,
    :host([disabled]) input[type='range']:disabled::-webkit-slider-thumb,
    input[type='range']:disabled::-webkit-slider-thumb {
      background:var(--color-icon-disabled, #757575) !important;
      border-color:var(--color-border-disabled, #757575) !important;
      cursor:not-allowed;
    }
    :host([disabled]) input[type='range']::-moz-range-thumb,
    :host([disabled]) input[type='range']:disabled::-moz-range-thumb,
    input[type='range']:disabled::-moz-range-thumb {
      background:var(--color-icon-disabled, #757575) !important;
      border-color:var(--color-border-disabled, #757575) !important;
      cursor:not-allowed;
    }
  `;

  get _isRange() { return Array.isArray(this.value); }
  get _normalizedMin() { return toNumber(this.min, DEFAULT_MIN); }
  get _normalizedMax() { const m=toNumber(this.max, DEFAULT_MAX); return m>this._normalizedMin ? m : this._normalizedMin + DEFAULT_STEP; }
  get _normalizedStep() { const s=toNumber(this.step, DEFAULT_STEP); return s>0 ? s : DEFAULT_STEP; }
  get _normalizedValue() {
    const min=this._normalizedMin; const max=this._normalizedMax;
    if (this._isRange) {
      const raw=this.value;
      const a=clamp(toNumber(raw[0], min), min, max);
      const b=clamp(toNumber(raw[1], max), min, max);
      return a<=b ? [a,b] : [b,a];
    }
    return clamp(toNumber(this.value, min), min, max);
  }

  _emitValueChange(nextValue) {
    this.dispatchEvent(new CustomEvent('onValueChange', { detail: nextValue, bubbles: true, composed: true }));
  }
  _onSingleInput = (e) => { const n=clamp(toNumber(e.target.value,this._normalizedMin),this._normalizedMin,this._normalizedMax); this.value=n; this._emitValueChange(n); };
  _onRangeInput(index, e) {
    const current=this._normalizedValue;
    const n=clamp(toNumber(e.target.value,this._normalizedMin),this._normalizedMin,this._normalizedMax);
    const vals=[...current];
    if (index === 0) {
      vals[0] = Math.min(n, vals[1]);
    } else {
      vals[1] = Math.max(n, vals[0]);
    }
    this.value=vals;
    this._emitValueChange(vals[index]);
  }
  _onSingleValueInput = (e) => this._onSingleInput(e);
  _onRangeValueInput(index, e) { this._onRangeInput(index, e); }

  _fillStyle() {
    const min=this._normalizedMin, max=this._normalizedMax, range=max-min;
    if (this._isRange) {
      const [a,b]=this._normalizedValue; const left=((a-min)/range)*100; const right=((b-min)/range)*100;
      return `left:${left}%; right:${100-right}%;`;
    }
    const v=this._normalizedValue; const right=100-((v-min)/range)*100; return `left:0%; right:${right}%;`;
  }
  _labels() {
    if (!this.showLable) return ['', ''];
    const labels=this.customLabel?.length ? this.customLabel : [String(this._normalizedMin), String(this._normalizedMax)];
    return [labels[0] ?? '', labels[1] ?? ''];
  }
  _ticks() { return null; }
  _stepValues() {
    const min=this._normalizedMin, max=this._normalizedMax, step=this._normalizedStep;
    const values=[min];
    let current=min;
    const epsilon = step / 1000;
    while (current + step < max - epsilon) {
      current += step;
      values.push(current);
    }
    if (values[values.length - 1] !== max) values.push(max);
    return Array.from(new Set(values.map((v) => Number(v.toFixed(6))))).sort((a, b) => a - b);
  }
  _tickOverlay() {
    if (!(this.showTicks || this.showStepper)) return null;
    const ticks=this._stepValues();
    const val=this._normalizedValue;
    const isSelected = (tickVal) => {
      if (Array.isArray(val)) {
        return tickVal >= val[0] && tickVal <= val[1];
      }
      return tickVal <= val;
    };
    return html`<div class="tick-overlay">${ticks.map((t, i)=>{
      const p = ((t-this._normalizedMin)/(this._normalizedMax-this._normalizedMin || 1))*100;
      const cls = i === 0 ? 'edge-start' : i === ticks.length - 1 ? 'edge-end' : '';
      return html`<span class="tick-mark ${isSelected(t) ? 'selected' : ''} ${cls}" style=${`left:${p}%;`}></span>`;
    })}</div>`;
  }
  _thumbPercents() {
    const min=this._normalizedMin, max=this._normalizedMax, range=max-min || 1;
    const val=this._normalizedValue;
    if (Array.isArray(val)) {
      return [((val[0]-min)/range)*100, ((val[1]-min)/range)*100];
    }
    return [((val-min)/range)*100];
  }
  _thumbLeftStyle(percent) {
    return `left: calc((100% - 16px) * ${percent / 100} + 8px);`;
  }
  _valueOverlay() {
    const percents=this._thumbPercents();
    const val=this._normalizedValue;
    const values=Array.isArray(val) ? val : [val];
    return html`<div class="value-overlay">${percents.map((p, i)=>{
      return html`<span class="value-chip" style=${this._thumbLeftStyle(p)}>${values[i]}</span>`;
    })}</div>`;
  }
  _valueInputs() {
    if (!this.showValueInput) return null;
    if (this._isRange) {
      const [a,b]=this._normalizedValue;
      return html`<div class="value-inputs">
        <input type="number" .value=${String(a)} ?disabled=${this.disabled} min=${String(this._normalizedMin)} max=${String(this._normalizedMax)} step=${String(this._normalizedStep)} @input=${(e)=>this._onRangeValueInput(0,e)} />
        <input type="number" .value=${String(b)} ?disabled=${this.disabled} min=${String(this._normalizedMin)} max=${String(this._normalizedMax)} step=${String(this._normalizedStep)} @input=${(e)=>this._onRangeValueInput(1,e)} />
      </div>`;
    }
    return html`<div class="value-inputs">
      <input type="number" .value=${String(this._normalizedValue)} ?disabled=${this.disabled} min=${String(this._normalizedMin)} max=${String(this._normalizedMax)} step=${String(this._normalizedStep)} @input=${this._onSingleValueInput} />
    </div>`;
  }

  render() {
    const min=this._normalizedMin, max=this._normalizedMax, step=this._normalizedStep, disabled=this.disabled;
    return html`<div class="root">
      <div class="track-row">
        ${
          (() => {
            const [leftLabel] = this._labels();
            return html`<span class="edge-label">${leftLabel}</span>`;
          })()
        }
        <div class="range-wrap">
          <div class="base-track"></div>
          <div class="fill-track" style=${this._fillStyle()}></div>
          ${this._tickOverlay()}
          ${this._valueOverlay()}
          ${this._isRange ? html`
            <input class="range-min" type="range" min=${String(min)} max=${String(max)} step=${String(step)} .value=${String(this._normalizedValue[0])} ?disabled=${disabled} @input=${(e)=>this._onRangeInput(0,e)} />
            <div class="range-top">
              <input class="range-max" type="range" min=${String(min)} max=${String(max)} step=${String(step)} .value=${String(this._normalizedValue[1])} ?disabled=${disabled} @input=${(e)=>this._onRangeInput(1,e)} />
            </div>
          ` : html`
            <input type="range" min=${String(min)} max=${String(max)} step=${String(step)} .value=${String(this._normalizedValue)} ?disabled=${disabled} @input=${this._onSingleInput} />
          `}
        </div>
        ${
          (() => {
            const [, rightLabel] = this._labels();
            return html`<span class="edge-label">${rightLabel}</span>`;
          })()
        }
        ${this._valueInputs()}
      </div>
      ${this._ticks()}
    </div>`;
  }
}

customElements.define('slider-component', SliderComponent);
