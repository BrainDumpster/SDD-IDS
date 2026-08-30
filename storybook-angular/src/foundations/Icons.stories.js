import { idsAssetUrl } from "../../../lib/shared/ids-assets-base.js";
import {
  ICONS_GALLERY_ARGS,
  ICONS_GALLERY_ARG_TYPES,
  renderIconsGalleryHtml,
  selectIcons,
  tokens,
} from "../../../storybook-shared/foundations/foundations-render.js";
import { foundationsDocsStory } from "./foundations-angular.js";

/**
 * Thin Angular CSF over shared Icons gallery HTML
 * (`storybook-shared/foundations/foundations-render.js`).
 * Same gallery as React `Icons.stories.tsx`.
 */

/** @type {import("@storybook/angular").Meta} */
const meta = {
  title: "Foundations/Icons",
  parameters: {
    layout: "fullscreen",
  },
  argTypes: ICONS_GALLERY_ARG_TYPES,
  args: ICONS_GALLERY_ARGS,
};

export default meta;

/** @type {import("@storybook/angular").StoryObj} */
export const Gallery = {
  name: "Gallery",
  render: (args) => {
    const selected = selectIcons(tokens.icons || [], args);
    const html = renderIconsGalleryHtml({
      ...selected,
      resolveIconUrl: (slug) => idsAssetUrl(`icons/${slug}.svg`),
      componentHint: "<code>ids-icon</code> (<code>shapeName</code>)",
    });
    return foundationsDocsStory(html).render();
  },
};
