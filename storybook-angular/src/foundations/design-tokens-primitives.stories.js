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

const html = renderNameValueGroups(tokens.primitives, {
  title: "Primitives",
  lede:
    "Primitive tokens are the raw foundation values from the IDS Figma <strong>Primitive</strong> collection. They do not change between light and dark modes. Semantic tokens reference these values.",
  metaHtml: sourceMetaHtml(),
});

/** @type {import("@storybook/angular").StoryObj} */
export const Primitives = foundationsDocsStory(html);
