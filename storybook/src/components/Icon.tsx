import type { CSSProperties } from "react";

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
   * `mask` (default): CSS mask + `background-color: currentColor` from styles (tintable monochrome assets).
   * `img`: `<img src>` for full-color SVGs (e.g. alert severity glyphs).
   */
  variant?: "mask" | "img";
}

function resolveUrl(shapeName: string): string | undefined {
  if (!/^[a-z0-9-]+$/.test(shapeName)) return undefined;
  return iconUrlBySlug[shapeName];
}

export function Icon({ shapeName, className, title, variant = "mask" }: IconProps) {
  const src = resolveUrl(shapeName);

  if (!src) {
    return (
      <span
        className={className}
        aria-hidden="true"
        title={title ?? `Missing icon: ${shapeName}`}
      />
    );
  }

  if (variant === "img") {
    return <img src={src} alt="" aria-hidden="true" className={className} title={title} />;
  }

  const style = {
    WebkitMaskImage: `url("${src}")`,
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    WebkitMaskSize: "contain",
    maskImage: `url("${src}")`,
    maskRepeat: "no-repeat",
    maskPosition: "center",
    maskSize: "contain",
  } as CSSProperties;

  return <span className={className} style={style} aria-hidden="true" title={title} />;
}
