import type { ReactElement } from "react";

/** React CSF helper for shared Foundations HTML pages. */
export function foundationsDocsStory(html: string) {
  return {
    parameters: {
      layout: "fullscreen" as const,
      controls: { disable: true },
      actions: { disable: true },
      docs: {
        source: { code: null },
      },
    },
    render: (): ReactElement => (
      <div dangerouslySetInnerHTML={{ __html: html }} />
    ),
  };
}
