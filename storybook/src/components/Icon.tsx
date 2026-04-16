import type { CSSProperties } from "react";

const iconUrlBySlug: Record<string, string> = (() => {
  const modules = import.meta.glob<string>("../../../assets/icons/*.svg", {
    eager: true,
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
  /** Canonical icon slug from assets/icons/<slug>.svg. */
  shapeName: string;
  className?: string;
  title?: string;
}

export function Icon({ shapeName, className, title }: IconProps) {
  const src = /^[a-z0-9-]+$/.test(shapeName) ? iconUrlBySlug[shapeName] : undefined;

  if (!src) {
    return <span className={className} aria-hidden="true" title={title ?? `Missing icon: ${shapeName}`} />;
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
