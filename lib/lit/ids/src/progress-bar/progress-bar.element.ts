/**
 * IdsProgressBar — Lit web component.
 *
 * Tag: `ids-progress-bar` (edf-core)
 * Visuals / a11y: `components/ids/progress-bar/design-spec.md`
 *
 * Supports:
 * - Design-spec API: `type` (layout), `thickness`, `state`, `value`, `label`,
 *   `helperText`, `showHelperText`
 * - edf-core props: `progressLabel`, `displayValue`, `displayValuePosition`,
 *   `message`, `shape`, `loop`, `size` (sm|md|lg), `disabled`, and edf `type`
 *   status values (`success`|`warning`|`danger`|`info`|`neutral`)
 *
 * When `type` is a layout value (`inline`|`with-label`|`indeterminate`) it drives
 * layout; when it is an edf status value it drives `state` (layout defaults via
 * `displayValuePosition` / `loop`).
 */
import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import "../icon/register.js";
import {
  EDF_STATUS_TYPES,
  HELPER_ICON_BY_STATE,
  HELPER_ICON_COLOR_BY_STATE,
  LAYOUT_TYPES,
  STATES,
  THICKNESSES,
  clampProgressValue,
  mapEdfSizeToThickness,
  mapEdfTypeToState,
  type IdsProgressBarLayoutType,
  type IdsProgressBarState,
  type IdsProgressBarThickness,
} from "./progress-bar.constants.js";
import { progressBarStyles } from "./progress-bar.styles.js";

export class IdsProgressBar extends LitElement {
  static override styles = [progressBarStyles];

  /** Determinate progress 0–100 (ignored when indeterminate / loop). */
  @property({ type: Number, reflect: true })
  value = 0;

  /** Design-spec meta label (`with-label`). */
  @property({ type: String })
  label = "";

  /** edf-core label alias (merged with `label` at render). */
  @property({ type: String, attribute: "progresslabel", reflect: true })
  progressLabel = "";

  @property({ type: String, attribute: "helpertext", reflect: true })
  helperText = "";

  @property({ type: Boolean, attribute: "showhelpertext", reflect: true })
  showHelperText = false;

  /**
   * Layout type (design-spec) **or** edf status type.
   * Layout: `inline` | `with-label` | `indeterminate`
   * Status (edf): `neutral` | `info` | `success` | `warning` | `danger`
   */
  @property({ type: String, reflect: true })
  type: string = "inline";

  /** Design-spec thickness (preferred over edf `size`). */
  @property({ type: String, reflect: true })
  thickness: string = "";

  /** Design-spec completion state. */
  @property({ type: String, reflect: true })
  state: string = "";

  /** edf-core: indeterminate loop animation. */
  @property({ type: Boolean, reflect: true })
  loop = false;

  /** edf-core size → thickness when `thickness` unset: sm|md|lg */
  @property({ type: String, reflect: true })
  size: string = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** edf-core: custom percentage / step text. */
  @property({ type: String, attribute: "displayvalue", reflect: true })
  displayValue = "";

  /** edf-core: `top` → with-label layout, `right` → inline. */
  @property({ type: String, attribute: "displayvalueposition", reflect: true })
  displayValuePosition: string = "";

  /** edf-core: message row (treated as helper text). */
  @property({ type: String, reflect: true })
  message = "";

  /** edf-core: helper icon shape override (slug under assets/icons). */
  @property({ type: String, reflect: true })
  shape = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "ids-progress-bar");
  }

  private resolveLayout(): IdsProgressBarLayoutType {
    if (this.loop) return "indeterminate";
    if (LAYOUT_TYPES.has(this.type as IdsProgressBarLayoutType)) {
      return this.type as IdsProgressBarLayoutType;
    }
    if (this.displayValuePosition === "top") return "with-label";
    if (this.displayValuePosition === "right") return "inline";
    return "inline";
  }

  private resolveThickness(): IdsProgressBarThickness {
    if (THICKNESSES.has(this.thickness as IdsProgressBarThickness)) {
      return this.thickness as IdsProgressBarThickness;
    }
    if (this.size) return mapEdfSizeToThickness(this.size);
    return "medium";
  }

  private resolveState(): IdsProgressBarState {
    if (STATES.has(this.state as IdsProgressBarState)) {
      return this.state as IdsProgressBarState;
    }
    if (EDF_STATUS_TYPES.has(this.type)) {
      return mapEdfTypeToState(this.type);
    }
    return "in-progress";
  }

  private resolveHelperText(): string {
    if (this.helperText) return this.helperText;
    if (this.message) return this.message;
    return "";
  }

  private shouldShowHelper(helper: string): boolean {
    if (!helper) return false;
    if (this.showHelperText) return true;
    // edf demos set message/helperText without showHelperText
    if (this.message || this.helperText) return true;
    return false;
  }

  private resolveHelperIcon(state: IdsProgressBarState): {
    slug: string;
    color?: string;
  } | null {
    if (this.shape) {
      const slug = this.shape
        .replace(/^dell-/, "")
        .replace(/-ko-(yellow|green|red)$/, "");
      // Map common edf shapes onto IDS assets when possible
      const mapped =
        slug.includes("ok-circ") || slug.includes("status-ok")
          ? "status-ok-circ-solid"
          : slug.includes("warn-tri") || slug.includes("status-warn")
            ? "status-warn-tri-solid"
            : slug.includes("critical") || slug.includes("status-critical")
              ? "status-critical-square-solid"
              : this.shape.replace(/^dell-/, "").replace(/-ko-(yellow|green|red)$/, "");
      return { slug: mapped };
    }
    if (state === "in-progress") return null;
    return {
      slug: HELPER_ICON_BY_STATE[state],
      color: HELPER_ICON_COLOR_BY_STATE[state],
    };
  }

  private percentText(clamped: number, layout: IdsProgressBarLayoutType): string {
    if (layout === "indeterminate") return "";
    if (this.displayValue) return this.displayValue;
    return `${Math.round(clamped)}%`;
  }

  private renderTrack(clamped: number, isIndeterminate: boolean) {
    return html`
      <div class="ids-progress-bar-track" data-ids="ids-progress-bar-track">
        <div
          class="ids-progress-bar-track-bg"
          data-ids="ids-progress-bar-track-bg"
          aria-hidden="true"
        ></div>
        <div
          class="ids-progress-bar-indicator"
          data-ids="ids-progress-bar-indicator"
          data-hook-ids="ids-progress-bar"
          style=${isIndeterminate
            ? nothing
            : styleMap({ width: `${clamped}%` })}
        ></div>
      </div>
    `;
  }

  override render() {
    const resolvedLabel = this.label || this.progressLabel;
    const layout = this.resolveLayout();
    const thickness = this.resolveThickness();
    const state = this.resolveState();
    const clamped = clampProgressValue(this.value);
    const isIndeterminate = layout === "indeterminate";
    const isWithLabel = layout === "with-label";
    const isInline = layout === "inline";
    const percentLabel = this.percentText(clamped, layout);
    const showPercentage = Boolean(percentLabel);
    const progressClip = isIndeterminate ? "0%" : `${clamped}%`;
    const valueFull = !isIndeterminate && clamped >= 100;
    const helper = this.resolveHelperText();
    const showHelper = this.shouldShowHelper(helper);
    const helperIcon = showHelper ? this.resolveHelperIcon(state) : null;

    const rootClasses = {
      "ids-progress-bar": true,
      [`ids-progress-bar--${thickness}`]: true,
      [`ids-progress-bar--${state}`]: true,
      "ids-progress-bar--indeterminate": isIndeterminate,
    };

    return html`
      <div
        class=${classMap(rootClasses)}
        data-ids="ids-progress-bar"
        data-type=${layout}
        data-thickness=${thickness}
        data-state=${state}
        data-value-full=${valueFull ? "true" : nothing}
        role="progressbar"
        aria-valuemin=${isIndeterminate ? nothing : 0}
        aria-valuemax=${isIndeterminate ? nothing : 100}
        aria-valuenow=${isIndeterminate ? nothing : clamped}
        aria-label=${resolvedLabel || "Progress"}
        style=${styleMap({ "--progress-clip": progressClip })}
      >
        ${isWithLabel
          ? html`
              <div
                class="ids-progress-bar-labeled-block"
                data-ids="ids-progress-bar-labeled-block"
              >
                <div class="ids-progress-bar-meta" data-ids="ids-progress-bar-meta">
                  ${resolvedLabel
                    ? html`<span
                        class="ids-progress-bar-label"
                        data-ids="ids-progress-bar-label"
                        data-hook-ids="ids-progress-bar-label"
                        >${resolvedLabel}</span
                      >`
                    : nothing}
                  ${showPercentage
                    ? html`<span
                        class="ids-progress-bar-value"
                        data-ids="ids-progress-bar-value"
                        data-hook-ids="ids-progress-bar-display-value"
                        >${percentLabel}</span
                      >`
                    : nothing}
                </div>
                ${this.renderTrack(clamped, isIndeterminate)}
              </div>
            `
          : isInline
            ? html`
                <div
                  class="ids-progress-bar-inline-row"
                  data-ids="ids-progress-bar-track-row"
                >
                  ${this.renderTrack(clamped, isIndeterminate)}
                  ${showPercentage
                    ? html`<span
                        class="ids-progress-bar-inline-value"
                        data-ids="ids-progress-bar-inline-value"
                        data-hook-ids="ids-progress-bar-display-value"
                        >${percentLabel}</span
                      >`
                    : nothing}
                </div>
              `
            : this.renderTrack(clamped, isIndeterminate)}
        ${showHelper
          ? html`
              <div
                class="ids-progress-bar-helper"
                data-ids="ids-progress-bar-helper"
              >
                ${helperIcon
                  ? html`<ids-icon
                      shape=${helperIcon.slug}
                      size="16"
                      variant="img"
                      .color=${helperIcon.color}
                      data-hook-ids="ids-progress-bar-shape"
                    ></ids-icon>`
                  : nothing}
                <span
                  data-hook-ids=${this.message
                    ? "ids-progress-bar-helper-message"
                    : "ids-progress-bar-helper-text"}
                  >${helper}</span
                >
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-progress-bar": IdsProgressBar;
  }
}
