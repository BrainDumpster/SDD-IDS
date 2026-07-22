import type * as go from "gojs";

/**
 * Reads a resolved value for a semantic CSS variable (defined in
 * src/tokens.css) directly off <html>, so GoJS canvas-rendered colors
 * (which cannot see CSS at all) stay in sync with the app's Light/Dark
 * theme. Because this always re-reads getComputedStyle at call time, it
 * must be called from inside a Binding converter (not cached in a
 * top-level constant), and callers must force those Bindings to
 * re-evaluate after a theme switch (see refreshTopologyTheme below).
 */
export function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined" || typeof document === "undefined") return fallback;
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * Forces every color/theme-driven Binding in the diagram to re-evaluate
 * against the current CSS variable values, and re-applies the div's own
 * background. Call this whenever the app's `data-theme` attribute
 * changes (see GoJSTopologyEngine's MutationObserver).
 */
export function refreshTopologyTheme(diagram: go.Diagram): void {
  diagram.commit((d) => {
    if (d.div) {
      d.div.style.background = cssVar("--color-background-component", "#ffffff");
    }
    d.updateAllTargetBindings();
  }, null);
}
