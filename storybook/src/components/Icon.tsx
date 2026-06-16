import type { CSSProperties } from "react";

import styles from "./Icon.module.css";
import { ICON_INLINE_SVG_RAW_BY_SLUG, stripXmlDeclaration } from "./iconInlineRegistry";

/** Resolved asset URLs only (Vite `?url`); never inline `data:image/svg+xml`. */
const iconUrlBySlug: Record<string, string> = (() => {
  const modules = import.meta.glob<string>("../../../assets/icons/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
  });
  const out: Record<string, string> = {};
  for (const path of Object.keys(modules)) {
    const file = path.replace(/^.*\/([^/]+)\.svg$/, "$1");
    if (file && modules[path] != null) out[file] = modules[path] as string;
  }
  return out;
})();

export interface IconProps {
  /** Canonical icon slug from `assets/icons/<slug>.svg`. */
  shapeName: string;
  className?: string;
  title?: string;
  /**
   * Semantic icon color as a CSS value, typically `var(--color-icon-...)`.
   * Sets the root `color` (drives mask tint via `currentColor`). Omit when the parent
   * should own `color` (e.g. interactive tiles with :hover/:active token shifts).
   */
  color?: string;
  /** Merged into the root element; use for width/height in stories or rare overrides. */
  style?: CSSProperties;
  /**
   * `mask` (default): CSS mask + `background-color: currentColor` (from `color` prop or ancestor).
   * `img`: `<img src>` for full-color SVGs (e.g. alert severity glyphs).
   * `inline`: real `<svg>` in DOM for slugs in `iconInlineRegistry` (falls back to `mask` if unlisted).
   */
  variant?: "mask" | "img" | "inline";
}

function resolveUrl(shapeName: string): string | undefined {
  if (!/^[a-z0-9-]+$/.test(shapeName)) return undefined;
  return iconUrlBySlug[shapeName];
}

export function Icon({
  shapeName,
  className,
  title,
  color,
  style: styleProp,
  variant = "mask",
}: IconProps) {
  const colorStyle = color ? ({ color } as CSSProperties) : undefined;
  const inlineRaw =
    variant === "inline" ? ICON_INLINE_SVG_RAW_BY_SLUG[shapeName] : undefined;

  if (inlineRaw) {
    return (
      <span
        className={[styles.inlineWrap, className].filter(Boolean).join(" ")}
        style={{ ...colorStyle, ...styleProp }}
        aria-hidden="true"
        title={title}
        dangerouslySetInnerHTML={{ __html: stripXmlDeclaration(inlineRaw) }}
      />
    );
  }

  const src = resolveUrl(shapeName);

  if (!src) {
    return (
      <span
        className={className}
        style={{ ...colorStyle, ...styleProp }}
        aria-hidden="true"
        title={title ?? `Missing icon: ${shapeName}`}
      />
    );
  }

  if (variant === "img") {
    return (
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={className}
        title={title}
        style={{
          width: 16,
          height: 16,
          display: "block",
          boxSizing: "border-box",
          ...colorStyle,
          ...styleProp,
        }}
      />
    );
  }

  const style = {
    backgroundColor: "currentColor",
    display: "inline-block",
    width: 16,
    height: 16,
    boxSizing: "border-box",
    WebkitMaskImage: `url("${src}")`,
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    WebkitMaskSize: "contain",
    maskImage: `url("${src}")`,
    maskRepeat: "no-repeat",
    maskPosition: "center",
    maskSize: "contain",
    ...colorStyle,
    ...styleProp,
  } as CSSProperties;

  return <span className={className} style={style} aria-hidden="true" title={title} />;
}
