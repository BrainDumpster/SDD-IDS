import type { Meta, StoryObj } from "@storybook/react";
import { idsAssetUrl } from "../../../lib/shared/ids-assets-base.js";
import {
  ICONS_GALLERY_ARGS,
  ICONS_GALLERY_ARG_TYPES,
  renderIconsGalleryHtml,
  selectIcons,
  tokens,
} from "../../../storybook-shared/foundations/foundations-render.js";

/**
 * Thin React CSF over shared Icons gallery HTML
 * (`storybook-shared/foundations/foundations-render.js`).
 */
const meta = {
  title: "Foundations/Icons",
  parameters: {
    layout: "fullscreen",
  },
  argTypes: ICONS_GALLERY_ARG_TYPES,
  args: ICONS_GALLERY_ARGS,
} satisfies Meta<{ filter: string; limit: number }>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  name: "Gallery",
  render: (args) => {
    const selected = selectIcons(tokens.icons || [], args);
    const html = renderIconsGalleryHtml({
      ...selected,
      resolveIconUrl: (slug) => idsAssetUrl(`icons/${slug}.svg`),
      componentHint: "<code>IdsIcon</code> (<code>shapeName</code>)",
    });
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  },
};
