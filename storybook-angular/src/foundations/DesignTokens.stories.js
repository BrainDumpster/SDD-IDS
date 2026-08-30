import { DESIGN_TOKEN_PAGES } from "../../../storybook-shared/foundations/foundations-render.js";
import { foundationsDocsStory } from "./foundations-angular.js";

/**
 * Thin Angular CSF over shared Foundations HTML
 * (`storybook-shared/foundations/foundations-render.js`).
 * Same pages as React `DesignTokens.stories.tsx`.
 */

/** @type {import("@storybook/angular").Meta} */
const meta = {
  title: "Foundations/Design tokens",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj} */
export const Overview = foundationsDocsStory(DESIGN_TOKEN_PAGES.overview());
/** @type {import("@storybook/angular").StoryObj} */
export const Modes = foundationsDocsStory(DESIGN_TOKEN_PAGES.modes());
/** @type {import("@storybook/angular").StoryObj} */
export const Primitives = foundationsDocsStory(DESIGN_TOKEN_PAGES.primitives());
/** @type {import("@storybook/angular").StoryObj} */
export const Semantic = foundationsDocsStory(DESIGN_TOKEN_PAGES.semantic());
/** @type {import("@storybook/angular").StoryObj} */
export const Components = foundationsDocsStory(DESIGN_TOKEN_PAGES.components());
