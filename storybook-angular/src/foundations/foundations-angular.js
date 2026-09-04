/**
 * Bake shared Foundations / Getting Started HTML into an Angular story template.
 * Escape characters that Angular's template parser treats specially so doc
 * snippets (`@Component`, JSON `{…}`, `@ids/…`) are not compiled as bindings.
 *
 * @param {string} html
 * @returns {string}
 */
export function asAngularDocsTemplate(html) {
  return String(html ?? "")
    .replace(/@/g, "&#64;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

/**
 * @param {string} html
 * @returns {{ template: string }}
 */
export function renderFoundationsHtml(html) {
  return {
    template: asAngularDocsTemplate(html),
  };
}

/**
 * Angular CSF helper for shared Foundations / Getting Started HTML pages.
 *
 * @param {string} html
 */
export function foundationsDocsStory(html) {
  return {
    parameters: {
      layout: "fullscreen",
      controls: { disable: true },
      actions: { disable: true },
      docs: {
        source: { code: null },
      },
    },
    render: () => renderFoundationsHtml(html),
  };
}
