import {
  foundationsDocsStory,
  renderSemanticGroups,
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

const html = renderSemanticGroups(tokens.semantic, {
  title: "Semantic",
  lede:
    "Semantic color tokens from the IDS Figma <strong>Color Modes</strong> collection, plus <strong>Sizes</strong> and <strong>Shadows</strong>. Role-based values resolve differently in Light and Dark where applicable.",
  metaHtml: sourceMetaHtml(),
});

/** @type {import("@storybook/angular").StoryObj} */
export const Semantic = foundationsDocsStory(html);
