/**
 * Theme-adaptive severity/status glyphs, tokenized for reuse.
 *
 * The raw IDS severity SVGs bake LIGHT-mode hex fills (e.g. critical #AF0000,
 * success #1B8500). Rendered as <img> those never adapt, so dark mode shows the
 * wrong colors. Here we strip the <style> block and rebind each fill to the
 * semantic token the design calls for, then the consumer renders the markup via
 * `dangerouslySetInnerHTML` (real inline <svg>) so both the outer shape and the
 * inner knock-out mark follow the active theme.
 *
 * `SEVERITY_ICON_SVG_BY_SLUG` is the reusable primitive: any component that shows
 * full-color severity icons on a NEUTRAL background (Status Bar, Toast, Alert
 * inline, ProgressBar, …) can map its own variant → slug → tokenized SVG. This is
 * intentionally NOT part of the shared `iconInlineRegistry` (which maps
 * `status-warn-tri-solid` to a black triangle for the global alert banner); the
 * coloring here is for neutral-background contexts and must stay separate.
 */
import statusCriticalRaw from "../../../assets/icons/status-critical-square-solid.svg?raw";
import statusWarnRaw from "../../../assets/icons/status-warn-tri-solid.svg?raw";
import statusOkRaw from "../../../assets/icons/status-ok-circ-solid.svg?raw";
import infoRaw from "../../../assets/icons/info-circ-solid.svg?raw";
import stateProgressRaw from "../../../assets/icons/state-progress-circle.svg?raw";
import stateStandbyRaw from "../../../assets/icons/state-standby-clock-solid.svg?raw";
import stateCancelledRaw from "../../../assets/icons/state-cancelled-solid.svg?raw";
import stateRemoveRaw from "../../../assets/icons/state-remove-solid.svg?raw";
import statusUnknownRaw from "../../../assets/icons/status-unknown-diamond-solid.svg?raw";
import type { IdsStatusBarSeverity } from "../spec-contracts/ids-status-bar.contract";

// Inner knock-out mark tokens. Some marks stay white in both themes (WHITE);
// others flip with the theme (INVERSE).
const WHITE = "--color-icon-white";
const INVERSE = "--color-icon-inverse";

/**
 * Replace the SVG's `<style>`-driven fill classes with inline `fill="var(--token)"`.
 * `classToToken` maps each `st0`/`cls-1`/… class to a CSS variable name.
 */
export function tokenizeSvg(raw: string, classToToken: Record<string, string>): string {
  let s = raw.replace(/<\?xml[^>]*>\s*/i, "");
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
  s = s.replace(/\swidth="[^"]*"/i, "");
  s = s.replace(/\sheight="[^"]*"/i, "");
  s = s.replace(/\sstyle="enable-background:[^"]*"/gi, "");
  for (const [cls, token] of Object.entries(classToToken)) {
    s = s.replace(new RegExp(`class="${cls}"`, "g"), `fill="var(${token})"`);
  }
  return s.trim();
}

/** Reusable: tokenized severity glyph markup keyed by canonical icon slug. */
export const SEVERITY_ICON_SVG_BY_SLUG: Readonly<Record<string, string>> = {
  "status-critical-square-solid": tokenizeSvg(statusCriticalRaw, {
    st0: "--color-icon-alerting-critical",
    st1: WHITE,
  }),
  // Minor/warning stays yellow across themes; outline + "!" stay dark.
  "status-warn-tri-solid": tokenizeSvg(statusWarnRaw, {
    st0: "--color-icon-alerting-minor",
    st1: "--color-icon-alerting-minor-2",
    st2: "--color-icon-black",
  }),
  "status-ok-circ-solid": tokenizeSvg(statusOkRaw, {
    st0: "--color-icon-alerting-success",
    st1: WHITE,
  }),
  // NOTE: info mark set to WHITE by parity with critical/success; confirm against
  // Figma when wiring the info severity into Toast / Alert-inline.
  "info-circ-solid": tokenizeSvg(infoRaw, {
    st0: "--color-icon-alerting-info",
    st1: WHITE,
  }),
  "state-progress-circle": tokenizeSvg(stateProgressRaw, {
    "cls-2": "--color-icon-brand-base",
    "cls-1": WHITE,
  }),
  "state-standby-clock-solid": tokenizeSvg(stateStandbyRaw, {
    st1: "--color-icon-brand-base",
    st0: INVERSE,
  }),
  "state-cancelled-solid": tokenizeSvg(stateCancelledRaw, {
    st0: "--color-icon-neutral-light",
    st1: INVERSE,
  }),
  "state-remove-solid": tokenizeSvg(stateRemoveRaw, {
    st0: "--color-icon-neutral-light",
    st1: INVERSE,
  }),
  "status-unknown-diamond-solid": tokenizeSvg(statusUnknownRaw, {
    st0: "--color-icon-neutral-light",
    st1: INVERSE,
  }),
};

/** Status Bar severities rendered as tokenized inline SVG (skipped composed separately). */
export type TokenizedSeverity = Exclude<IdsStatusBarSeverity, "skipped">;

const SEVERITY_TO_SLUG: Record<TokenizedSeverity, string> = {
  critical: "status-critical-square-solid",
  warning: "status-warn-tri-solid",
  success: "status-ok-circ-solid",
  "in-progress": "state-progress-circle",
  scheduled: "state-standby-clock-solid",
  canceling: "state-cancelled-solid",
  canceled: "state-remove-solid",
  unknown: "status-unknown-diamond-solid",
};

/** Status Bar severity → tokenized SVG, derived from the shared slug map. */
export const STATUS_BAR_SEVERITY_SVG = Object.fromEntries(
  Object.entries(SEVERITY_TO_SLUG).map(([severity, slug]) => [severity, SEVERITY_ICON_SVG_BY_SLUG[slug]])
) as Record<TokenizedSeverity, string>;
