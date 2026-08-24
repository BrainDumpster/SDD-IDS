import { foundationsDocsStory, sourceMetaHtml } from "./foundations-render.js";

/** @type {import("@storybook/angular").Meta} */
const meta = {
  title: "Foundations/Design tokens",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

const html = `
  <div class="ids-foundations">
    <h1 class="ids-foundations__title">Design tokens</h1>
    <p class="ids-foundations__lede">
      IDS design tokens are CSS custom properties synced from the IDS Variables Library in Figma.
      Use semantic tokens in components; reach for primitives only when building new semantic roles.
    </p>
    ${sourceMetaHtml()}
    <section class="ids-foundations__group">
      <h2 class="ids-foundations__group-title">Token layers</h2>
      <ul class="ids-foundations__list">
        <li><strong>Primitives</strong> — raw palette, opacity, scale, and typography foundations (Figma collection <code>Primitive</code>).</li>
        <li><strong>Semantic</strong> — role-based colors, sizes, and shadow tokens (Figma collections <code>Color Modes</code> and <code>Sizes</code>).</li>
        <li><strong>Components</strong> — shared layout aliases and component-specific shadow aliases consumed by Spec Accurate Design.</li>
        <li><strong>Modes</strong> — how Light and Dark themes apply semantic values at runtime.</li>
      </ul>
    </section>
    <section class="ids-foundations__group">
      <h2 class="ids-foundations__group-title">Usage</h2>
      <p class="ids-foundations__lede">
        Prefer semantic references such as <code>var(--color-background-brand-base)</code>
        instead of primitive hex values. Apply themes with
        <code>data-design-system="ids"</code> and <code>data-theme="light|dark"</code>
        on <code>html</code>/<code>body</code> (Storybook toolbar Theme control).
      </p>
    </section>
  </div>
`;

/** @type {import("@storybook/angular").StoryObj} */
export const Overview = foundationsDocsStory(html);
