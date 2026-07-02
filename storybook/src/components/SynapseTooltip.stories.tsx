import type { ReactNode } from "react";
import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import {
  TOOLTIP_ARROW_ALIGNS,
  TOOLTIP_SIDES,
} from "../../../component-contracts/ids/tooltip.contract";
import {
  SYNAPSE_TOOLTIP_CLOSE_CONTENT_GAP_TOKEN,
  SYNAPSE_TOOLTIP_CLOSE_ICON_SHAPE,
  SYNAPSE_TOOLTIP_CLOSE_ICON_SIZE_PX,
  SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS,
  SYNAPSE_TOOLTIP_DESIGN_SPEC_PATH,
  SYNAPSE_TOOLTIP_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_TOOLTIP_MAIN_NODE_ID,
  SYNAPSE_TOOLTIP_SAMPLE_BODY,
  SYNAPSE_TOOLTIP_SAMPLE_TITLE,
  SYNAPSE_TOOLTIP_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_TOOLTIP_SPEC_ACCURATE_VARIANT_NODE_ID,
} from "../spec-contracts/synapse-tooltip.contract";
import {
  TOOLTIP_DOCS_CANVAS_STYLE,
  TOOLTIP_MATRIX_CELL_STYLE,
  TOOLTIP_MATRIX_GRID_STYLE,
  TOOLTIP_STORY_CANVAS_STYLE,
} from "./ids-tooltip.developer-usage";
import {
  SynapseTooltip,
  SynapseTooltipBody,
  SynapseTooltipTitle,
} from "./SynapseTooltip";

const SYNAPSE_TOOLTIP_PLACEMENTS = TOOLTIP_SIDES.flatMap((side) =>
  TOOLTIP_ARROW_ALIGNS.map((align) => ({
    key: `${side}-${align}`,
    side,
    align,
  }))
);

type PlaygroundArgs = {
  side: (typeof TOOLTIP_SIDES)[number];
  arrowAlign: (typeof TOOLTIP_ARROW_ALIGNS)[number];
  closable: boolean;
  title: string;
  content: string;
  triggerLabel: string;
  tooltipClosed?: (reason: string) => void;
};

function SynapseTooltipTrigger({ children }: { children: ReactNode }) {
  return (
    <button type="button" className="sbSynapseTooltipTrigger">
      {children}
    </button>
  );
}

function TooltipStoryStyles() {
  return (
    <style>{`
      .sbSynapseTooltipTrigger {
        padding: 7px 14px;
        border: 1px solid var(--color-border-accessible);
        background: var(--color-background-component);
        color: var(--color-text-neutral-strong);
        border-radius: 2px;
        font-size: 14px;
        cursor: default;
      }
      .sbSynapseTooltipCanvas {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
        justify-content: center;
        padding: 32px;
        overflow: visible;
      }
      .sbSynapseTooltipRadiusEvidence {
        display: grid;
        gap: 6px;
        justify-items: center;
        font-size: 12px;
        color: var(--color-text-neutral);
      }
      .sbSynapseTooltipRadiusSwatch {
        width: 120px;
        height: 48px;
        border: 1px solid var(--color-border-accessible);
        background: var(--color-background-surface-2);
        border-radius: var(--tooltip-control-radius);
      }
    `}</style>
  );
}

const meta: Meta<typeof SynapseTooltip> = {
  title: "Spec Generated/Synapse/Tooltip",
  component: SynapseTooltip,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      story: { inline: true },
      description: {
        component: [
          `Spec-driven Synapse Tooltip (IDS-fork composition API). Source: \`${SYNAPSE_TOOLTIP_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline layout/anatomy: \`${SYNAPSE_TOOLTIP_IDS_BASELINE_SPEC_PATH}\` (Figma \`${SYNAPSE_TOOLTIP_SPEC_ACCURATE_NODE_ID}\`).`,
          `Synapse programme delta: \`${SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS}\` → 8px panel radius (Figma \`${SYNAPSE_TOOLTIP_MAIN_NODE_ID}\`).`,
          `Closable layout inherits IDS: \`${SYNAPSE_TOOLTIP_CLOSE_CONTENT_GAP_TOKEN}\` reserve + \`${SYNAPSE_TOOLTIP_CLOSE_ICON_SHAPE}\` at ${SYNAPSE_TOOLTIP_CLOSE_ICON_SIZE_PX}px via shared Icon.`,
          "Composition: `SynapseTooltip` + `SynapseTooltipTitle` + `SynapseTooltipBody`. Theme: `components/synapse-theme.css`.",
        ].join(" "),
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
type Story = StoryObj<typeof SynapseTooltip>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story: `Figma variant \`${SYNAPSE_TOOLTIP_SPEC_ACCURATE_VARIANT_NODE_ID}\` within \`${SYNAPSE_TOOLTIP_SPEC_ACCURATE_NODE_ID}\` — composition with \`SynapseTooltipTitle\` + \`SynapseTooltipBody\`.`,
      },
    },
  },
  render: (args) => (
    <>
      <TooltipStoryStyles />
      <div className="sbSynapseTooltipCanvas" style={TOOLTIP_DOCS_CANVAS_STYLE}>
        <SynapseTooltip
          side={args.side}
          arrowAlign={args.arrowAlign}
          closable={args.closable}
          onClose={(reason) => args.tooltipClosed?.(reason)}
        >
          <SynapseTooltipTrigger>{args.triggerLabel}</SynapseTooltipTrigger>
          {args.title ? <SynapseTooltipTitle>{args.title}</SynapseTooltipTitle> : null}
          <SynapseTooltipBody>{args.content}</SynapseTooltipBody>
        </SynapseTooltip>
        <div className="sbSynapseTooltipRadiusEvidence">
          <span>
            Synapse panel radius: <code>{SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS}</code>
          </span>
          <div className="sbSynapseTooltipRadiusSwatch" aria-hidden />
        </div>
      </div>
    </>
  ),
  args: {
    side: "top",
    arrowAlign: "start",
    closable: false,
    title: SYNAPSE_TOOLTIP_SAMPLE_TITLE,
    content: SYNAPSE_TOOLTIP_SAMPLE_BODY,
    triggerLabel: "Hover over me",
  } satisfies PlaygroundArgs,
};

export const NormalNoHeader: Story = {
  name: "Normal / No Header",
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      <TooltipStoryStyles />
      <div style={TOOLTIP_STORY_CANVAS_STYLE}>
        <SynapseTooltip side="top" arrowAlign="start">
          <SynapseTooltipTrigger>Hover over me</SynapseTooltipTrigger>
          <SynapseTooltipBody>{SYNAPSE_TOOLTIP_SAMPLE_BODY}</SynapseTooltipBody>
        </SynapseTooltip>
      </div>
    </>
  ),
};

export const WithHeader: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      <TooltipStoryStyles />
      <div style={TOOLTIP_STORY_CANVAS_STYLE}>
        <SynapseTooltip side="top" arrowAlign="center">
          <SynapseTooltipTrigger>Hover over me</SynapseTooltipTrigger>
          <SynapseTooltipTitle>{SYNAPSE_TOOLTIP_SAMPLE_TITLE}</SynapseTooltipTitle>
          <SynapseTooltipBody>{SYNAPSE_TOOLTIP_SAMPLE_BODY}</SynapseTooltipBody>
        </SynapseTooltip>
      </div>
    </>
  ),
};

export const Closable: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: `Closable IDS-fork layout: body wraps before close column (\`${SYNAPSE_TOOLTIP_CLOSE_CONTENT_GAP_TOKEN}\` reserve); close uses \`${SYNAPSE_TOOLTIP_CLOSE_ICON_SHAPE}\` at ${SYNAPSE_TOOLTIP_CLOSE_ICON_SIZE_PX}px via Icon.`,
      },
    },
  },
  render: () => (
    <>
      <TooltipStoryStyles />
      <div style={TOOLTIP_STORY_CANVAS_STYLE}>
        <SynapseTooltip
          side="top"
          arrowAlign="end"
          closable
          onClose={(reason) => {
            // eslint-disable-next-line no-console
            console.log("[Synapse Tooltip] closed", reason);
          }}
        >
          <SynapseTooltipTrigger>Hover over me</SynapseTooltipTrigger>
          <SynapseTooltipTitle>{SYNAPSE_TOOLTIP_SAMPLE_TITLE}</SynapseTooltipTitle>
          <SynapseTooltipBody>{SYNAPSE_TOOLTIP_SAMPLE_BODY}</SynapseTooltipBody>
        </SynapseTooltip>
      </div>
    </>
  ),
};

export const ClosableNoTitle: Story = {
  name: "Closable / No Title",
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      <TooltipStoryStyles />
      <div style={TOOLTIP_STORY_CANVAS_STYLE}>
        <SynapseTooltip side="top" arrowAlign="start" closable>
          <SynapseTooltipTrigger>Hover over me</SynapseTooltipTrigger>
          <SynapseTooltipBody>{SYNAPSE_TOOLTIP_SAMPLE_BODY}</SynapseTooltipBody>
        </SynapseTooltip>
      </div>
    </>
  ),
};

export const RichContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      <TooltipStoryStyles />
      <div style={TOOLTIP_STORY_CANVAS_STYLE}>
        <SynapseTooltip side="right" arrowAlign="center">
          <SynapseTooltipTrigger>Rich content</SynapseTooltipTrigger>
          <SynapseTooltipTitle>Custom Content</SynapseTooltipTitle>
          <SynapseTooltipBody>
            <p style={{ margin: 0 }}>Any content can be rendered here.</p>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              <li>Text</li>
              <li>Lists</li>
              <li>Inline formatting</li>
            </ul>
          </SynapseTooltipBody>
        </SynapseTooltip>
      </div>
    </>
  ),
};

export const ArrowMatrix: Story = {
  parameters: {
    controls: { disable: true },
    layout: "fullscreen",
  },
  render: () => (
    <>
      <TooltipStoryStyles />
      <div style={TOOLTIP_MATRIX_GRID_STYLE}>
        {SYNAPSE_TOOLTIP_PLACEMENTS.map((placement) => (
          <div key={placement.key} style={TOOLTIP_MATRIX_CELL_STYLE}>
            <SynapseTooltip side={placement.side} arrowAlign={placement.align} closable>
              <SynapseTooltipTrigger>{placement.key}</SynapseTooltipTrigger>
              <SynapseTooltipTitle>{SYNAPSE_TOOLTIP_SAMPLE_TITLE}</SynapseTooltipTitle>
              <SynapseTooltipBody>
                {placement.side} - {placement.align}
              </SynapseTooltipBody>
            </SynapseTooltip>
          </div>
        ))}
      </div>
    </>
  ),
};

export const Playground: Story = {
  parameters: { controls: { disable: false } },
  render: (args) => (
    <>
      <TooltipStoryStyles />
      <div style={TOOLTIP_STORY_CANVAS_STYLE}>
        <SynapseTooltip
          side={args.side}
          arrowAlign={args.arrowAlign}
          closable={args.closable}
          onClose={(reason) => args.tooltipClosed?.(reason)}
        >
          <SynapseTooltipTrigger>{args.triggerLabel}</SynapseTooltipTrigger>
          {args.title ? <SynapseTooltipTitle>{args.title}</SynapseTooltipTitle> : null}
          <SynapseTooltipBody>{args.content}</SynapseTooltipBody>
        </SynapseTooltip>
      </div>
    </>
  ),
  args: {
    side: "top",
    arrowAlign: "start",
    closable: false,
    title: SYNAPSE_TOOLTIP_SAMPLE_TITLE,
    content: SYNAPSE_TOOLTIP_SAMPLE_BODY,
    triggerLabel: "Hover over me",
  } satisfies PlaygroundArgs,
};
