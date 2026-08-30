import type { Meta, StoryObj } from "@storybook/react";
import { DESIGN_TOKEN_PAGES } from "../../../storybook-shared/foundations/foundations-render.js";
import { foundationsDocsStory } from "./foundations-react";

/**
 * Thin React CSF over shared Foundations HTML
 * (`storybook-shared/foundations/foundations-render.js`).
 */
const meta = {
  title: "Foundations/Design tokens",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Overview: Story = foundationsDocsStory(DESIGN_TOKEN_PAGES.overview());
export const Modes: Story = foundationsDocsStory(DESIGN_TOKEN_PAGES.modes());
export const Primitives: Story = foundationsDocsStory(DESIGN_TOKEN_PAGES.primitives());
export const Semantic: Story = foundationsDocsStory(DESIGN_TOKEN_PAGES.semantic());
export const Components: Story = foundationsDocsStory(DESIGN_TOKEN_PAGES.components());
