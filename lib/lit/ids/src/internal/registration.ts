/**
 * Safe customElements.define — matches edf-core registerElementSafely.
 */
export function registerElementSafely(
  tagName: string,
  elementClass: CustomElementConstructor,
): void {
  if (typeof customElements === "undefined") return;
  if (customElements.get(tagName)) return;
  customElements.define(tagName, elementClass);
}
