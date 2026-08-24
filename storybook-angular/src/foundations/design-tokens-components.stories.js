import {
  foundationsDocsStory,
  renderNameValueGroups,
  sourceMetaHtml,
  tokens,
} from "./foundations-render.js";

/** @type {import("@storybook/angular").Meta} */
const meta = {
  title: "Foundations/Design tokens",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

const html = renderNameValueGroups(tokens.components, {
  title: "Components",
  lede:
    "Component-oriented tokens from the IDS theme — shared layout aliases and component-specific shadow aliases used across Spec Accurate Design components.",
  metaHtml: sourceMetaHtml(),
});

/** @type {import("@storybook/angular").StoryObj} */
export const Components = foundationsDocsStory(html);
