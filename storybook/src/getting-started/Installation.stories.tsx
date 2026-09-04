import type { Meta, StoryObj } from "@storybook/react";
import { renderReactInstallationHtml } from "../../../storybook-shared/getting-started/installation-render.js";
import { foundationsDocsStory } from "../foundations/foundations-react";

/**
 * Getting Started → Installation (React).
 * Content: `storybook-shared/getting-started/installation-render.js`.
 */
const meta = {
  title: "Getting Started",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Installation: Story = foundationsDocsStory(
  renderReactInstallationHtml(),
);
