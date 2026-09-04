import { renderAngularInstallationHtml } from "../../../storybook-shared/getting-started/installation-render.js";
import { foundationsDocsStory } from "../foundations/foundations-angular.js";

/**
 * Getting Started → Installation (Angular).
 * Content: `storybook-shared/getting-started/installation-render.js`.
 */

/** @type {import("@storybook/angular").Meta} */
const meta = {
  title: "Getting Started",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj} */
export const Installation = foundationsDocsStory(
  renderAngularInstallationHtml(),
);
