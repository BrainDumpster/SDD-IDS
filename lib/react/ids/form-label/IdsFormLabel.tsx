/**
 * IDS Form Label — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/form-label`
 * Source: `components/ids/form-label/design-spec.md`
 * Theme: `components/ids-theme.css`
 * Figma: component set `12065:229953` (IDS-Design-Library).
 *
 * Anatomy:
 *   labelRoot (row, align-items:center, size padding-block)
 *     labelGroup (<label>, gap space-2)
 *       labelText (children)
 *       requiredMarker? ("*", aria-hidden)
 *     infoIcon? (info-circ-solid, 16px)
 */

import React, {
  type LabelHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { IdsIcon } from "../icon";
import styles from "./IdsFormLabel.module.css";

export type IdsFormLabelSize = "sm" | "md" | "lg";

export interface IdsFormLabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "children"> {
  /** Label text content. */
  children?: ReactNode;
  /** Visual size mapped to Figma `Size` 24/32/40. Default `md`. Unknown → `md`. */
  size?: IdsFormLabelSize | string;
  /** Render trailing required marker `*`. Default `false`. */
  required?: boolean;
  /** Render the `info-circ-solid` info icon. Default `false`. */
  showInfoIcon?: boolean;
  /**
   * Accessible name for the info icon. When provided, the icon is exposed to
   * assistive tech (`role="img"`); otherwise it is decorative (`aria-hidden`).
   */
  infoLabel?: string;
  /** Associates the label to a control `id` (native `<label for>`). */
  htmlFor?: string;
}

const SIZES = new Set<IdsFormLabelSize>(["sm", "md", "lg"]);

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveSize(value: unknown): IdsFormLabelSize {
  if (typeof value === "string" && SIZES.has(value as IdsFormLabelSize)) {
    return value as IdsFormLabelSize;
  }
  return "md";
}

export function IdsFormLabel({
  children,
  size: sizeProp = "md",
  required = false,
  showInfoIcon = false,
  infoLabel,
  htmlFor,
  className,
  ...rest
}: IdsFormLabelProps): ReactElement {
  const size = resolveSize(sizeProp);
  const iconDecorative = infoLabel == null || infoLabel.trim() === "";

  return (
    <span
      className={cx(styles["ids-form-label"], styles[`ids-form-label--${size}`], className)}
      data-ids="ids-form-label"
      data-size={size}
    >
      <label
        {...rest}
        className={styles["ids-form-label-group"]}
        data-ids="ids-form-label-group"
        htmlFor={htmlFor}
      >
        <span className={styles["ids-form-label-text"]} data-ids="ids-form-label-text">
          {children}
        </span>
        {required ? (
          <span
            className={styles["ids-form-label-marker"]}
            data-ids="ids-form-label-marker"
            aria-hidden="true"
          >
            *
          </span>
        ) : null}
      </label>
      {showInfoIcon ? (
        <span
          className={styles["ids-form-label-info"]}
          data-ids="ids-form-label-info"
          role={iconDecorative ? undefined : "img"}
          aria-label={iconDecorative ? undefined : infoLabel}
          aria-hidden={iconDecorative ? "true" : undefined}
        >
          <IdsIcon shape="info-circ-solid" variant="img" size={16} />
        </span>
      ) : null}
    </span>
  );
}

IdsFormLabel.displayName = "IdsFormLabel";

export default IdsFormLabel;
