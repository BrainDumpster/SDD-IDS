/**
 * Angular CSF helper for shared Foundations HTML pages.
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
    render: () => ({
      template: html,
    }),
  };
}
