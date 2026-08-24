import { foundationsDocsStory } from "./foundations-render.js";

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
    <h1 class="ids-foundations__title">Modes</h1>
    <p class="ids-foundations__lede">
      IDS supports Light and Dark color modes. Semantic tokens from the Figma
      <strong>Color Modes</strong> collection resolve to different values per mode while
      Primitive tokens stay constant.
    </p>
    <div class="ids-foundations__modes">
      <article class="ids-foundations__mode-card">
        <h3>Light</h3>
        <p>
          Default mode. Set <code>data-theme="light"</code> (or omit dark).
          Semantic colors come from the light block in <code>components/ids-theme.css</code>.
        </p>
      </article>
      <article class="ids-foundations__mode-card">
        <h3>Dark</h3>
        <p>
          Set <code>data-theme="dark"</code> on <code>html</code>/<code>body</code>
          with <code>data-design-system="ids"</code>. Only semantic (and some shadow) values override;
          primitives and sizes remain shared.
        </p>
      </article>
    </div>
    <section class="ids-foundations__group" style="margin-top:32px">
      <h2 class="ids-foundations__group-title">Storybook</h2>
      <p class="ids-foundations__lede">
        Use the toolbar <strong>Theme</strong> control to switch Light/Dark while browsing
        Spec Accurate Design stories. Semantic token tables under
        <em>Foundations → Design tokens → Semantic</em> list both resolved values side by side.
      </p>
    </section>
  </div>
`;

/** @type {import("@storybook/angular").StoryObj} */
export const Modes = foundationsDocsStory(html);
