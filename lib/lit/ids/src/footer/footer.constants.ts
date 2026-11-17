/**
 * IDS Footer — constants from design-spec / React IdsFooter.
 * Spec: `components/ids/footer/design-spec.md`
 */

export const HOSTNAME_MAX_CHARS = 48;

/**
 * At or below this viewport width the inline date/time group is hidden and
 * surfaced in a tooltip on the time zone button instead.
 */
export const COMPACT_BREAKPOINT_PX = 1024;

export const FOOTER_API_DEFAULTS = {
  showHostname: true,
  showCurrentDateAndTime: true,
  showTimeZone: true,
  copyDisabled: false,
  timeZoneDisabled: false,
  ariaLabel: "Application status",
  timeZoneFallbackLabel: "Time zone",
} as const;

/** Visibility toggles: non-boolean → `true` (design-spec fallback). */
export function resolveShowFlag(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  return true;
}

export function truncateHostname(value: string, max = HOSTNAME_MAX_CHARS): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}...`;
}

export async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
