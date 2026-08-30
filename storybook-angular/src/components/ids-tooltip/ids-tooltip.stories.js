import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  TOOLTIP_DEMO_BODY,
  TOOLTIP_SPEC_ACCURATE_DEFAULTS,
  TOOLTIP_SIDES,
  TOOLTIP_ARROW_ALIGNS,
} from "../../../compiled/component-contracts/ids/tooltip.contract.js";
import { IdsTooltipComponent } from "../../../compiled/lib/angular/ids/tooltip/ids-tooltip.component.js";
import { IDS_TOOLTIP_IMPORTS } from "../../../compiled/lib/angular/ids/tooltip/index.js";
import {
  TOOLTIP_COMPOSITION_DEMO_TEMPLATE,
  TOOLTIP_DOCS_CANVAS_TEMPLATE,
  TOOLTIP_DOCS_DESCRIPTION,
  TOOLTIP_SOURCE_CODE,
  TOOLTIP_STORY_SOURCE_CODE,
} from "./ids-tooltip.developer-usage.js";

const TOOLTIP_STORY_DECORATORS = [
  applicationConfig({
    providers: [provideZoneChangeDetection()],
  }),
  moduleMetadata({
    imports: [...IDS_TOOLTIP_IMPORTS],
  }),
];

const TOOLTIP_PLACEMENTS = TOOLTIP_SIDES.flatMap((side) =>
  TOOLTIP_ARROW_ALIGNS.map((align) => ({
    key: `${side}-${align}`,
    side,
    align,
  })),
);

/** @type {import("@storybook/angular").Meta<IdsTooltipComponent>} */
const meta = {
  title: "Components/IDS/Tooltip",
  component: IdsTooltipComponent,
  tags: ["autodocs"],
  decorators: TOOLTIP_STORY_DECORATORS,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      story: {
        inline: true,
      },
      description: { component: TOOLTIP_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: TOOLTIP_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    side: { control: "select", options: [...TOOLTIP_SIDES] },
    arrowAlign: { control: "select", options: [...TOOLTIP_ARROW_ALIGNS] },
    align: { control: "select", options: [...TOOLTIP_ARROW_ALIGNS] },
    closable: { control: "boolean" },
    title: { control: "text" },
    content: { control: "text" },
    triggerLabel: { control: "text", name: "trigger label" },
    tooltipClosed: { action: "closed" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsTooltipComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Spec Accurate Design: top · start · standard hover tooltip — composition with trigger, panel, header/title, body, and arrow.",
      },
      source: {
        type: "code",
        language: "html",
        code: TOOLTIP_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      onClose: (reason) => args.tooltipClosed?.(reason),
    },
    template: TOOLTIP_DOCS_CANVAS_TEMPLATE,
  }),
  args: {
    side: TOOLTIP_SPEC_ACCURATE_DEFAULTS.side,
    arrowAlign: TOOLTIP_SPEC_ACCURATE_DEFAULTS.arrowAlign,
    closable: TOOLTIP_SPEC_ACCURATE_DEFAULTS.closable,
    title: TOOLTIP_SPEC_ACCURATE_DEFAULTS.title,
    content: TOOLTIP_SPEC_ACCURATE_DEFAULTS.content,
    triggerLabel: "Hover over me",
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsTooltipComponent>} */
export const NormalNoHeader = {
  name: "Normal / No Header",
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; min-height: 180px; align-items: center; justify-content: center; padding: 32px; overflow: visible;">
        <ids-tooltip side="top" arrowAlign="start">
          <ids-tooltip-trigger>
            <ids-button variant="secondary" size="lg">Hover over me</ids-button>
          </ids-tooltip-trigger>
          <ids-tooltip-panel>
            <ids-tooltip-body>${TOOLTIP_DEMO_BODY}</ids-tooltip-body>
            <ids-tooltip-arrow />
          </ids-tooltip-panel>
        </ids-tooltip>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTooltipComponent>} */
export const WithHeader = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; min-height: 180px; align-items: center; justify-content: center; padding: 32px; overflow: visible;">
        <ids-tooltip side="top" arrowAlign="center">
          <ids-tooltip-trigger>
            <ids-button variant="secondary" size="lg">Hover over me</ids-button>
          </ids-tooltip-trigger>
          <ids-tooltip-panel>
            <ids-tooltip-header>
              <ids-tooltip-title>Tooltip Title</ids-tooltip-title>
            </ids-tooltip-header>
            <ids-tooltip-body>${TOOLTIP_DEMO_BODY}</ids-tooltip-body>
            <ids-tooltip-arrow />
          </ids-tooltip-panel>
        </ids-tooltip>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTooltipComponent>} */
export const Closable = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      onClose: (reason) => {
        // eslint-disable-next-line no-console
        console.log("[IDS Tooltip] closed", reason);
      },
    },
    template: `
      <div style="display: flex; min-height: 180px; align-items: center; justify-content: center; padding: 32px; overflow: visible;">
        <ids-tooltip side="top" arrowAlign="end" [closable]="true" (closed)="onClose($event)">
          <ids-tooltip-trigger>
            <ids-button variant="secondary" size="lg">Hover over me</ids-button>
          </ids-tooltip-trigger>
          <ids-tooltip-panel>
            <ids-tooltip-header>
              <ids-tooltip-title>Tooltip Title</ids-tooltip-title>
            </ids-tooltip-header>
            <ids-tooltip-body>${TOOLTIP_DEMO_BODY}</ids-tooltip-body>
            <ids-tooltip-close />
            <ids-tooltip-arrow />
          </ids-tooltip-panel>
        </ids-tooltip>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTooltipComponent>} */
export const ClosableNoTitle = {
  name: "Closable / No Title",
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; min-height: 180px; align-items: center; justify-content: center; padding: 32px; overflow: visible;">
        <ids-tooltip side="top" arrowAlign="start" [closable]="true">
          <ids-tooltip-trigger>
            <ids-button variant="secondary" size="lg">Hover over me</ids-button>
          </ids-tooltip-trigger>
          <ids-tooltip-panel>
            <ids-tooltip-header></ids-tooltip-header>
            <ids-tooltip-body>${TOOLTIP_DEMO_BODY}</ids-tooltip-body>
            <ids-tooltip-close />
            <ids-tooltip-arrow />
          </ids-tooltip-panel>
        </ids-tooltip>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTooltipComponent>} */
export const RichContent = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; min-height: 180px; align-items: center; justify-content: center; padding: 32px; overflow: visible;">
        <ids-tooltip side="right" arrowAlign="center">
          <ids-tooltip-trigger>
            <ids-button variant="secondary" size="lg">Rich content</ids-button>
          </ids-tooltip-trigger>
          <ids-tooltip-panel>
            <ids-tooltip-header>
              <ids-tooltip-title>Custom Content</ids-tooltip-title>
            </ids-tooltip-header>
            <ids-tooltip-body>
            <p style="margin: 0;">Any content can be rendered here.</p>
            <ul style="margin: 8px 0 0; padding-left: 18px;">
              <li>Text</li>
              <li>Lists</li>
              <li>Inline formatting</li>
            </ul>
            </ids-tooltip-body>
            <ids-tooltip-arrow />
          </ids-tooltip-panel>
        </ids-tooltip>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTooltipComponent>} */
export const ArrowMatrix = {
  parameters: {
    controls: { disable: true },
    layout: "fullscreen",
  },
  render: () => ({
    props: {
      placements: TOOLTIP_PLACEMENTS,
    },
    template: `
      <div
        style="
          display: grid;
          grid-template-columns: repeat(3, minmax(220px, 1fr));
          gap: 20px;
          padding: 24px;
          min-width: 720px;
          box-sizing: border-box;
          overflow: visible;
        "
      >
        @for (placement of placements; track placement.key) {
          <div style="display: flex; justify-content: center; padding: 48px 8px; overflow: visible;">
            <ids-tooltip
              [side]="placement.side"
              [arrowAlign]="placement.align"
              [closable]="true"
            >
              <ids-tooltip-trigger>
                <ids-button variant="secondary" size="lg">{{ placement.key }}</ids-button>
              </ids-tooltip-trigger>
              <ids-tooltip-panel>
                <ids-tooltip-header>
                  <ids-tooltip-title>Tooltip Title</ids-tooltip-title>
                </ids-tooltip-header>
                <ids-tooltip-body>{{ placement.side }} - {{ placement.align }}</ids-tooltip-body>
                <ids-tooltip-close />
                <ids-tooltip-arrow />
              </ids-tooltip-panel>
            </ids-tooltip>
          </div>
        }
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTooltipComponent>} */
export const Playground = {
  parameters: { controls: { disable: false } },
  render: (args) => ({
    props: {
      ...args,
      onClose: (reason) => args.tooltipClosed?.(reason),
    },
    template: TOOLTIP_COMPOSITION_DEMO_TEMPLATE,
  }),
  args: {
    side: TOOLTIP_SPEC_ACCURATE_DEFAULTS.side,
    arrowAlign: TOOLTIP_SPEC_ACCURATE_DEFAULTS.arrowAlign,
    closable: TOOLTIP_SPEC_ACCURATE_DEFAULTS.closable,
    title: TOOLTIP_SPEC_ACCURATE_DEFAULTS.title,
    content: TOOLTIP_SPEC_ACCURATE_DEFAULTS.content,
    triggerLabel: "Hover over me",
  },
};
