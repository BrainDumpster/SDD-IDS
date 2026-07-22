/**
 * Middle-truncates `text` so the result never exceeds `maxLength` characters.
 * When truncation is required, the result keeps the START and END of the
 * original text, replacing the removed middle portion with a single
 * ellipsis ("…").
 *
 * Example: truncateMiddle("A Very Long Node Name Indeed", 24)
 *   -> "A Very Long …Name Indeed"
 */
export function truncateMiddle(text: string, maxLength = 24): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  const ellipsis = "\u2026"; // "…"
  const keep = Math.max(maxLength - ellipsis.length, 0);
  const startLength = Math.ceil(keep / 2);
  const endLength = keep - startLength;

  const start = text.substr(0, startLength);
  const end = endLength > 0 ? text.substr(text.length - endLength) : "";

  return `${start}${ellipsis}${end}`;
}
