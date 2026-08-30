/**
 * IDS Spinner — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/spinner`
 * Source: `components/ids/spinner/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   backdrop? (mode=overlay)
 *   spinnerRoot
 *     spinnerVisual (track disc + rotating arc)
 *     label (visible-inline | visible-below | sr-only)
 *
 * No SVG path/circle rendering. No @base-ui-components dependency.
 */

import React, {
  type HTMLAttributes,
  type ReactElement,
} from "react";
import styles from "./IdsSpinner.module.css";

export type IdsSpinnerSize = "sm" | "md" | "lg";
export type IdsSpinnerMode = "inline" | "overlay";
export type IdsSpinnerLabelVisibility =
  | "sr-only"
  | "visible-below"
  | "visible-inline";
export type IdsSpinnerAriaLive = "polite" | "assertive" | "off";

export interface IdsSpinnerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Visual size. Default `md`. Unknown → `md`. */
  size?: IdsSpinnerSize | string;
  /** Layout mode. Default `inline`. Unknown → `inline`. */
  mode?: IdsSpinnerMode | string;
  /** Loading copy. Empty → `"Loading..."`. */
  label?: string;
  /**
   * Label presentation. Default `sr-only`.
   * Incompatible values fall back per design-spec matrix.
   */
  labelVisibility?: IdsSpinnerLabelVisibility | string;
  /** Live region politeness. Default `polite`. Unknown → `polite`. */
  ariaLive?: IdsSpinnerAriaLive | string;
}

const SIZES = new Set<IdsSpinnerSize>(["sm", "md", "lg"]);
const MODES = new Set<IdsSpinnerMode>(["inline", "overlay"]);
const LABEL_VISIBILITIES = new Set<IdsSpinnerLabelVisibility>([
  "sr-only",
  "visible-below",
  "visible-inline",
]);
const ARIA_LIVES = new Set<IdsSpinnerAriaLive>(["polite", "assertive", "off"]);

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveSize(value: unknown): IdsSpinnerSize {
  if (typeof value === "string" && SIZES.has(value as IdsSpinnerSize)) {
    return value as IdsSpinnerSize;
  }
  return "md";
}

function resolveMode(value: unknown): IdsSpinnerMode {
  if (typeof value === "string" && MODES.has(value as IdsSpinnerMode)) {
    return value as IdsSpinnerMode;
  }
  return "inline";
}

function resolveLabel(label: string | undefined): string {
  if (label == null || String(label).trim() === "") {
    return "Loading...";
  }
  return String(label);
}

function resolveAriaLive(value: unknown): IdsSpinnerAriaLive {
  if (typeof value === "string" && ARIA_LIVES.has(value as IdsSpinnerAriaLive)) {
    return value as IdsSpinnerAriaLive;
  }
  return "polite";
}

/**
 * Resolve labelVisibility against the design-spec supported matrix.
 * Unknown / incompatible → declared fallbacks.
 */
function resolveLabelVisibility(
  size: IdsSpinnerSize,
  mode: IdsSpinnerMode,
  value: unknown,
): IdsSpinnerLabelVisibility {
  let visibility: IdsSpinnerLabelVisibility | undefined;
  if (
    typeof value === "string" &&
    LABEL_VISIBILITIES.has(value as IdsSpinnerLabelVisibility)
  ) {
    visibility = value as IdsSpinnerLabelVisibility;
  }

  if (visibility == null) {
    if (size === "sm") return "visible-inline";
    if (size === "md") return "visible-below";
    return "sr-only";
  }

  // size=sm: visible-inline | sr-only; overlay → sr-only only
  if (size === "sm") {
    if (mode === "overlay") return "sr-only";
    if (visibility === "visible-below") return "visible-inline";
    return visibility;
  }

  // size=md|lg: visible-below | sr-only (visible-inline incompatible)
  if (visibility === "visible-inline") {
    return size === "lg" ? "sr-only" : "visible-below";
  }

  return visibility;
}

export function IdsSpinner({
  size: sizeProp = "md",
  mode: modeProp = "inline",
  label: labelProp = "Loading...",
  labelVisibility: labelVisibilityProp = "sr-only",
  ariaLive: ariaLiveProp = "polite",
  className,
  ...rest
}: IdsSpinnerProps): ReactElement {
  const size = resolveSize(sizeProp);
  const mode = resolveMode(modeProp);
  const label = resolveLabel(labelProp);
  const labelVisibility = resolveLabelVisibility(
    size,
    mode,
    labelVisibilityProp,
  );
  const ariaLive = resolveAriaLive(ariaLiveProp);

  const showVisibleInline = labelVisibility === "visible-inline";
  const showVisibleBelow = labelVisibility === "visible-below";

  const labelNode =
    labelVisibility === "sr-only" ? (
      <span
        className={styles["ids-spinner-sr-only"]}
        data-ids="ids-spinner-label"
      >
        {label}
      </span>
    ) : (
      <span
        className={cx(
          styles["ids-spinner-label"],
          showVisibleInline && styles["ids-spinner-label--inline"],
          showVisibleBelow && styles["ids-spinner-label--below"],
        )}
        data-ids="ids-spinner-label"
      >
        {label}
      </span>
    );

  const root = (
    <div
      {...rest}
      className={cx(
        styles["ids-spinner"],
        styles[`ids-spinner--${size}`],
        styles[`ids-spinner--${mode}`],
        showVisibleInline && styles["ids-spinner--layout-inline"],
        showVisibleBelow && styles["ids-spinner--layout-stack"],
        labelVisibility === "sr-only" && styles["ids-spinner--layout-sr-only"],
        className,
      )}
      data-ids="ids-spinner"
      data-size={size}
      data-mode={mode}
      data-label-visibility={labelVisibility}
      role="status"
      aria-live={ariaLive}
    >
      <span
        className={styles["ids-spinner-visual"]}
        data-ids="ids-spinner-visual"
        aria-hidden="true"
      >
        <span
          className={styles["ids-spinner-track"]}
          data-ids="ids-spinner-track"
        />
        <span
          className={styles["ids-spinner-arc"]}
          data-ids="ids-spinner-arc"
        />
      </span>
      {labelNode}
    </div>
  );

  if (mode !== "overlay") {
    return root;
  }

  return (
    <div
      className={styles["ids-spinner-overlay"]}
      data-ids="ids-spinner-overlay"
      data-mode="overlay"
    >
      <div
        className={styles["ids-spinner-backdrop"]}
        data-ids="ids-spinner-backdrop"
        aria-hidden="true"
      />
      {root}
    </div>
  );
}

IdsSpinner.displayName = "IdsSpinner";

export default IdsSpinner;
