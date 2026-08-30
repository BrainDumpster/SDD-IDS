/**
 * IDS Progress Bar — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/progress-bar`
 * Source: `components/ids/progress-bar/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   ProgressRoot
 *     ProgressMetaRow?          (with-label)
 *     ProgressTrackRow          (track ± inline %)
 *       ProgressTrack / trackBg / ProgressIndicator
 *     ProgressHelperRow?        (IdsHelper + IdsIcon? + IdsHelperText)
 *
 * Composition: helper row uses lib `IdsHelper` / `IdsHelperText` and `IdsIcon`.
 * No @base-ui-components dependency.
 */

import React, { type CSSProperties, type ReactElement } from "react";
import { IdsHelper, IdsHelperText } from "../helper";
import { IdsIcon } from "../icon";
import styles from "./IdsProgressBar.module.css";

export type IdsProgressBarType = "inline" | "with-label" | "indeterminate";
export type IdsProgressBarThickness = "thin" | "medium" | "thick";
export type IdsProgressBarState =
  | "in-progress"
  | "completed-success"
  | "completed-warning"
  | "failed-error";

export interface IdsProgressBarProps {
  /** Clamped 0–100; ignored when `type="indeterminate"`. Default `0`. */
  value?: number;
  /** Meta row label (`with-label`); also used for `aria-label` fallback. */
  label?: string;
  /** Helper row copy. */
  helperText?: string;
  /** Renders helper row when `helperText` is set. Default `false`. */
  showHelperText?: boolean;
  /** Default `inline`. Unknown → `inline`. */
  type?: IdsProgressBarType | string;
  /** Default `medium`. Unknown → `medium`. */
  thickness?: IdsProgressBarThickness | string;
  /** Default `in-progress`. Unknown → `in-progress`. */
  state?: IdsProgressBarState | string;
  className?: string;
}

const TYPES = new Set<IdsProgressBarType>([
  "inline",
  "with-label",
  "indeterminate",
]);
const THICKNESSES = new Set<IdsProgressBarThickness>([
  "thin",
  "medium",
  "thick",
]);
const STATES = new Set<IdsProgressBarState>([
  "in-progress",
  "completed-success",
  "completed-warning",
  "failed-error",
]);

const HELPER_ICON_BY_STATE: Record<
  Exclude<IdsProgressBarState, "in-progress">,
  string
> = {
  "completed-success": "status-ok-circ-solid",
  "completed-warning": "status-warn-tri-solid",
  "failed-error": "status-critical-square-solid",
};

const SHAPE_PATTERN = /^[a-z0-9-]+$/;

const iconUrlByShape: Record<string, string> = (() => {
  const modules = import.meta.glob<string>("../../../../assets/icons/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
  });
  const out: Record<string, string> = {};
  for (const path of Object.keys(modules)) {
    const file = path.replace(/^.*\/([^/]+)\.svg$/, "$1");
    if (file && modules[path] != null) {
      out[file] = modules[path] as string;
    }
  }
  return out;
})();

function hasIconAsset(shape: string): boolean {
  return SHAPE_PATTERN.test(shape) && Boolean(iconUrlByShape[shape]);
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveType(value: unknown): IdsProgressBarType {
  if (typeof value === "string" && TYPES.has(value as IdsProgressBarType)) {
    return value as IdsProgressBarType;
  }
  return "inline";
}

function resolveThickness(value: unknown): IdsProgressBarThickness {
  if (
    typeof value === "string" &&
    THICKNESSES.has(value as IdsProgressBarThickness)
  ) {
    return value as IdsProgressBarThickness;
  }
  return "medium";
}

function resolveState(value: unknown): IdsProgressBarState {
  if (typeof value === "string" && STATES.has(value as IdsProgressBarState)) {
    return value as IdsProgressBarState;
  }
  return "in-progress";
}

function clampValue(value: number | undefined): number {
  const n = typeof value === "number" && !Number.isNaN(value) ? value : 0;
  return Math.min(100, Math.max(0, n));
}

export function IdsProgressBar({
  value = 0,
  label,
  helperText,
  showHelperText = false,
  type: typeProp = "inline",
  thickness: thicknessProp = "medium",
  state: stateProp = "in-progress",
  className,
}: IdsProgressBarProps): ReactElement {
  const type = resolveType(typeProp);
  const thickness = resolveThickness(thicknessProp);
  const state = resolveState(stateProp);
  const clampedValue = clampValue(value);
  const isIndeterminate = type === "indeterminate";
  const isWithLabel = type === "with-label";
  const isInline = type === "inline";
  const showPercentage = !isIndeterminate;
  const percentLabel = `${Math.round(clampedValue)}%`;
  const progressClip = isIndeterminate ? "0%" : `${clampedValue}%`;
  const valueFull = !isIndeterminate && clampedValue >= 100;

  const helperIconSlug =
    state !== "in-progress" ? HELPER_ICON_BY_STATE[state] : undefined;
  const showHelperIcon =
    helperIconSlug != null && hasIconAsset(helperIconSlug);

  const track = (
    <div
      className={styles["ids-progress-bar-track"]}
      data-ids="ids-progress-bar-track"
    >
      <div
        className={styles["ids-progress-bar-track-bg"]}
        data-ids="ids-progress-bar-track-bg"
        aria-hidden="true"
      />
      <div
        className={styles["ids-progress-bar-indicator"]}
        data-ids="ids-progress-bar-indicator"
        style={
          isIndeterminate
            ? undefined
            : ({ width: `${clampedValue}%` } as CSSProperties)
        }
      />
    </div>
  );

  return (
    <div
      className={cx(
        styles["ids-progress-bar"],
        styles[`ids-progress-bar--${thickness}`],
        styles[`ids-progress-bar--${state}`],
        isIndeterminate && styles["ids-progress-bar--indeterminate"],
        className,
      )}
      data-ids="ids-progress-bar"
      data-type={type}
      data-thickness={thickness}
      data-state={state}
      data-value-full={valueFull ? "true" : undefined}
      role="progressbar"
      aria-valuemin={isIndeterminate ? undefined : 0}
      aria-valuemax={isIndeterminate ? undefined : 100}
      aria-valuenow={isIndeterminate ? undefined : clampedValue}
      aria-label={label ?? "Progress"}
      style={{ "--progress-clip": progressClip } as CSSProperties}
    >
      {isWithLabel ? (
        <div
          className={styles["ids-progress-bar-labeled-block"]}
          data-ids="ids-progress-bar-labeled-block"
        >
          <div
            className={styles["ids-progress-bar-meta"]}
            data-ids="ids-progress-bar-meta"
          >
            {label ? (
              <span
                className={styles["ids-progress-bar-label"]}
                data-ids="ids-progress-bar-label"
              >
                {label}
              </span>
            ) : null}
            {showPercentage ? (
              <span
                className={styles["ids-progress-bar-value"]}
                data-ids="ids-progress-bar-value"
              >
                {percentLabel}
              </span>
            ) : null}
          </div>
          {track}
        </div>
      ) : isInline ? (
        <div
          className={styles["ids-progress-bar-inline-row"]}
          data-ids="ids-progress-bar-track-row"
        >
          {track}
          {showPercentage ? (
            <span
              className={styles["ids-progress-bar-inline-value"]}
              data-ids="ids-progress-bar-inline-value"
            >
              {percentLabel}
            </span>
          ) : null}
        </div>
      ) : (
        track
      )}

      {showHelperText && helperText ? (
        <IdsHelper data-ids="ids-progress-bar-helper">
          {showHelperIcon ? (
            <IdsIcon shape={helperIconSlug!} variant="img" size={16} />
          ) : null}
          <IdsHelperText>{helperText}</IdsHelperText>
        </IdsHelper>
      ) : null}
    </div>
  );
}

IdsProgressBar.displayName = "IdsProgressBar";

export default IdsProgressBar;
