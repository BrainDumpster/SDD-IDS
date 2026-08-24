/**
 * IdsIcon — reusable React icon for `lib/react/ids/*` components.
 *
 * Path: `lib/react/ids/icon`
 * Assets: `assets/icons/<shape>.svg` (repo root)
 *
 * Props:
 * - shape — icon slug / file name without `.svg` (e.g. `chev-down-thick`)
 * - color — CSS color (prefer semantic tokens, e.g. `var(--color-icon-gray-neutral-base)`)
 * - size  — px number or CSS length (default `16`)
 *
 * Renders via CSS mask so monochrome glyphs tint with `color` / `currentColor`.
 * `variant="img"` for full-color SVGs; `variant="inline"` for curated two-tone DOM SVGs.
 */

import React, { type CSSProperties } from "react";
import styles from "./IdsIcon.module.css";
import {
  IDS_ICON_INLINE_SVG_BY_SHAPE,
  stripXmlDeclaration,
} from "./idsIconInlineRegistry";

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

const SHAPE_PATTERN = /^[a-z0-9-]+$/;

export interface IdsIconProps {
  /** Icon name / slug matching `assets/icons/<shape>.svg`. */
  shape: string;
  /** CSS color value; typically a design token `var(--color-icon-…)`. */
  color?: string;
  /** Icon box size in px (number) or any CSS length string. Default: `16`. */
  size?: number | string;
  /**
   * `mask` (default): tintable via `color` / `currentColor`.
   * `img`: full-color SVG (e.g. status-critical-square-solid).
   * `inline`: curated real `<svg>` in DOM (falls back to `mask` if unlisted).
   */
  variant?: "mask" | "img" | "inline";
  className?: string;
  title?: string;
  style?: CSSProperties;
  /** Accessible name when the icon is meaningful; otherwise decorative. */
  "aria-label"?: string;
}

function resolveSize(size: number | string | undefined): string {
  if (size == null) return "16px";
  if (typeof size === "number") return `${size}px`;
  return size;
}

function resolveUrl(shape: string): string | undefined {
  if (!SHAPE_PATTERN.test(shape)) return undefined;
  return iconUrlByShape[shape];
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function IdsIcon({
  shape,
  color,
  size,
  variant = "mask",
  className,
  title,
  style: styleProp,
  "aria-label": ariaLabel,
}: IdsIconProps) {
  const box = resolveSize(size);
  const decorative = !ariaLabel;
  const inlineRaw =
    variant === "inline" ? IDS_ICON_INLINE_SVG_BY_SHAPE[shape] : undefined;

  if (inlineRaw) {
    return (
      <span
        className={cx(styles["ids-icon"], styles["ids-icon--inline"], className)}
        style={{ width: box, height: box, color, ...styleProp }}
        data-ids="ids-icon"
        data-shape={shape}
        data-variant="inline"
        role={decorative ? undefined : "img"}
        aria-hidden={decorative ? true : undefined}
        aria-label={ariaLabel}
        title={title}
        dangerouslySetInnerHTML={{ __html: stripXmlDeclaration(inlineRaw) }}
      />
    );
  }

  const src = resolveUrl(shape);

  if (!src) {
    return (
      <span
        className={cx(styles["ids-icon"], styles["ids-icon--missing"], className)}
        style={{ width: box, height: box, color, ...styleProp }}
        data-ids="ids-icon"
        data-shape={shape}
        data-missing="true"
        role={decorative ? undefined : "img"}
        aria-hidden={decorative ? true : undefined}
        aria-label={ariaLabel}
        title={title ?? `Missing icon: ${shape}`}
      />
    );
  }

  if (variant === "img") {
    return (
      <img
        src={src}
        alt=""
        aria-hidden={decorative ? true : undefined}
        aria-label={ariaLabel}
        title={title}
        className={cx(styles["ids-icon"], styles["ids-icon--img"], className)}
        data-ids="ids-icon"
        data-shape={shape}
        data-variant="img"
        style={{
          width: box,
          height: box,
          display: "block",
          boxSizing: "border-box",
          ...styleProp,
        }}
      />
    );
  }

  const style: CSSProperties = {
    width: box,
    height: box,
    color,
    WebkitMaskImage: `url("${src}")`,
    maskImage: `url("${src}")`,
    ...styleProp,
  };

  return (
    <span
      className={cx(styles["ids-icon"], styles["ids-icon--mask"], className)}
      style={style}
      data-ids="ids-icon"
      data-shape={shape}
      data-variant="mask"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={ariaLabel}
      title={title}
    />
  );
}

export default IdsIcon;
