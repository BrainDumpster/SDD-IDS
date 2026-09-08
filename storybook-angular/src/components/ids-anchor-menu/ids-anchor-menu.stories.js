import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import { ANCHOR_MENU_SPEC_ACCURATE_DEFAULTS } from "../../../compiled/component-contracts/ids/anchor-menu.contract.js";
import { IdsAnchorMenuComponent } from "../../../compiled/lib/angular/ids/anchor-menu/ids-anchor-menu.component.js";
import { IDS_ANCHOR_MENU_IMPORTS } from "../../../compiled/lib/angular/ids/anchor-menu/index.js";
import {
  ANCHOR_MENU_COMPOSITION_DEMO_TEMPLATE,
  ANCHOR_MENU_DOCS_DESCRIPTION,
  ANCHOR_MENU_SOURCE_CODE,
  ANCHOR_MENU_STORY_SOURCE_CODE,
  ANCHOR_MENU_WITH_HEADER_TEMPLATE,
} from "./ids-anchor-menu.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsAnchorMenuComponent>} */
const meta = {
  title: "Components/IDS/Anchor Menu",
  component: IdsAnchorMenuComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_ANCHOR_MENU_IMPORTS],
    }),
  ],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: ANCHOR_MENU_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: ANCHOR_MENU_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    sticky: { control: "boolean" },
    title: { control: "text" },
    itemClick: { action: "itemClick" },
  },
};

export default meta;

/** Figma \`AnchorMenu-Example\` (\`11955:229709\`): six sections, Overview selected, Header hidden. */
/** @type {import("@storybook/angular").StoryObj<IdsAnchorMenuComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Spec Accurate Design: Figma `11955:229709` — six section items, Overview active, header omitted.",
      },
      source: {
        type: "code",
        language: "html",
        code: ANCHOR_MENU_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      itemClick: (href) => {
        args.itemClick?.(href);
      },
    },
    template: ANCHOR_MENU_COMPOSITION_DEMO_TEMPLATE,
  }),
  args: {
    title: ANCHOR_MENU_SPEC_ACCURATE_DEFAULTS.title,
    sticky: ANCHOR_MENU_SPEC_ACCURATE_DEFAULTS.sticky,
  },
};

/** Spec composition with optional \`ids-anchor-menu-header\` (default title \`On this page\`). */
/** @type {import("@storybook/angular").StoryObj<IdsAnchorMenuComponent>} */
export const WithHeader = {
  render: (args) => ({
    props: {
      ...args,
      itemClick: (href) => {
        args.itemClick?.(href);
      },
    },
    template: ANCHOR_MENU_WITH_HEADER_TEMPLATE,
  }),
  args: {
    title: ANCHOR_MENU_SPEC_ACCURATE_DEFAULTS.title,
    sticky: ANCHOR_MENU_SPEC_ACCURATE_DEFAULTS.sticky,
  },
};

/** Long label: wraps to 2 lines, truncates with ellipsis, and shows tooltip when truncated. */
/** @type {import("@storybook/angular").StoryObj<IdsAnchorMenuComponent>} */
export const LongLabel = {
  name: "Long Label",
  render: (args) => ({
    props: {
      ...args,
      itemClick: (href) => {
        args.itemClick?.(href);
      },
    },
    template: `
      <ids-anchor-menu [title]="title" [sticky]="sticky">
        <ids-anchor-menu-item label="Overview" href="#overview"></ids-anchor-menu-item>
        <ids-anchor-menu-item label="Types and classifications of anchor menu patterns" href="#types"></ids-anchor-menu-item>
        <ids-anchor-menu-item label="A deliberately extremely long anchor menu section title that overflows the two-line clamp and shows an ellipsis on the third line" href="#anatomy" [active]="true"></ids-anchor-menu-item>
        <ids-anchor-menu-item label="Usage Rules" href="#usage-rules"></ids-anchor-menu-item>
        <ids-anchor-menu-item label="States and Colors" href="#states-and-colors"></ids-anchor-menu-item>
        <ids-anchor-menu-item label="Redlines" href="#redlines"></ids-anchor-menu-item>
      </ids-anchor-menu>
    `,
  }),
  args: {
    title: ANCHOR_MENU_SPEC_ACCURATE_DEFAULTS.title,
    sticky: ANCHOR_MENU_SPEC_ACCURATE_DEFAULTS.sticky,
  },
};
