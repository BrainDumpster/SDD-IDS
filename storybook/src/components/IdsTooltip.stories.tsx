import type { ReactNode } from "react";
import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import {
  TOOLTIP_ARROW_ALIGNS,
  TOOLTIP_DEMO_BODY,
  TOOLTIP_SIDES,
  TOOLTIP_SPEC_ACCURATE_DEFAULTS,
} from "../../../component-contracts/ids/tooltip.contract";
import { Button } from "./Button";
import {
  TOOLTIP_DOCS_CANVAS_STYLE,
  TOOLTIP_DOCS_DESCRIPTION,
  TOOLTIP_MATRIX_CELL_STYLE,
  TOOLTIP_MATRIX_GRID_STYLE,
  TOOLTIP_STORY_CANVAS_STYLE,
  TOOLTIP_STORY_SOURCE_CODE,
} from "./ids-tooltip.developer-usage";
import {
  IdsTooltip,
  IdsTooltipArrow,
  IdsTooltipBody,
  IdsTooltipClose,
  IdsTooltipHeader,
  IdsTooltipPanel,
  IdsTooltipTitle,
  IdsTooltipTrigger,
} from "./IdsTooltip";

const TOOLTIP_PLACEMENTS = TOOLTIP_SIDES.flatMap((side) =>
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

function compositionSlots(options: {
  trigger: ReactNode;
  title?: ReactNode;
  body: ReactNode;
  closable?: boolean;
  emptyHeader?: boolean;
}) {
  return (
    <>
      <IdsTooltipTrigger>{options.trigger}</IdsTooltipTrigger>
      <IdsTooltipPanel>
        {options.title != null ? (
          <IdsTooltipHeader>
            <IdsTooltipTitle>{options.title}</IdsTooltipTitle>
          </IdsTooltipHeader>
        ) : options.emptyHeader ? (
          <IdsTooltipHeader />
        ) : null}
        <IdsTooltipBody>{options.body}</IdsTooltipBody>
        {options.closable ? <IdsTooltipClose /> : null}
        <IdsTooltipArrow />
      </IdsTooltipPanel>
    </>
  );
}

const meta: Meta<typeof IdsTooltip> = {
  title: "Spec Generated/IDS/Tooltip",
  component: IdsTooltip,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      story: { inline: true },
      description: { component: TOOLTIP_DOCS_DESCRIPTION },
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
type Story = StoryObj<typeof IdsTooltip>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Spec Accurate Design: top · start · standard hover tooltip — composition with trigger, panel, header/title, body, and arrow.",
      },
      source: {
        type: "code",
        language: "tsx",
        code: TOOLTIP_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => (
    <div style={TOOLTIP_DOCS_CANVAS_STYLE}>
      <IdsTooltip
        side={args.side}
        arrowAlign={args.arrowAlign}
        closable={args.closable}
        onClose={(reason) => args.tooltipClosed?.(reason)}
      >
        {compositionSlots({
          trigger: (
            <Button variant="secondary" size="lg">
              {args.triggerLabel}
            </Button>
          ),
          title: args.title || undefined,
          body: args.content,
          closable: args.closable,
        })}
      </IdsTooltip>
    </div>
  ),
  args: {
    side: TOOLTIP_SPEC_ACCURATE_DEFAULTS.side,
    arrowAlign: TOOLTIP_SPEC_ACCURATE_DEFAULTS.arrowAlign,
    closable: TOOLTIP_SPEC_ACCURATE_DEFAULTS.closable,
    title: TOOLTIP_SPEC_ACCURATE_DEFAULTS.title,
    content: TOOLTIP_SPEC_ACCURATE_DEFAULTS.content,
    triggerLabel: "Hover over me",
  } satisfies PlaygroundArgs,
};

export const NormalNoHeader: Story = {
  name: "Normal / No Header",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={TOOLTIP_STORY_CANVAS_STYLE}>
      <IdsTooltip side="top" arrowAlign="start">
        {compositionSlots({
          trigger: (
            <Button variant="secondary" size="lg">
              Hover over me
            </Button>
          ),
          body: TOOLTIP_DEMO_BODY,
        })}
      </IdsTooltip>
    </div>
  ),
};

export const WithHeader: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={TOOLTIP_STORY_CANVAS_STYLE}>
      <IdsTooltip side="top" arrowAlign="center">
        {compositionSlots({
          trigger: (
            <Button variant="secondary" size="lg">
              Hover over me
            </Button>
          ),
          title: "Tooltip Title",
          body: TOOLTIP_DEMO_BODY,
        })}
      </IdsTooltip>
    </div>
  ),
};

export const Closable: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={TOOLTIP_STORY_CANVAS_STYLE}>
      <IdsTooltip
        side="top"
        arrowAlign="end"
        closable
        onClose={(reason) => {
          // eslint-disable-next-line no-console
          console.log("[IDS Tooltip] closed", reason);
        }}
      >
        {compositionSlots({
          trigger: (
            <Button variant="secondary" size="lg">
              Hover over me
            </Button>
          ),
          title: "Tooltip Title",
          body: TOOLTIP_DEMO_BODY,
          closable: true,
        })}
      </IdsTooltip>
    </div>
  ),
};

export const ClosableNoTitle: Story = {
  name: "Closable / No Title",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={TOOLTIP_STORY_CANVAS_STYLE}>
      <IdsTooltip side="top" arrowAlign="start" closable>
        {compositionSlots({
          trigger: (
            <Button variant="secondary" size="lg">
              Hover over me
            </Button>
          ),
          body: TOOLTIP_DEMO_BODY,
          closable: true,
          emptyHeader: true,
        })}
      </IdsTooltip>
    </div>
  ),
};

export const RichContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={TOOLTIP_STORY_CANVAS_STYLE}>
      <IdsTooltip side="right" arrowAlign="center">
        {compositionSlots({
          trigger: (
            <Button variant="secondary" size="lg">
              Rich content
            </Button>
          ),
          title: "Custom Content",
          body: (
            <>
              <p style={{ margin: 0 }}>Any content can be rendered here.</p>
              <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                <li>Text</li>
                <li>Lists</li>
                <li>Inline formatting</li>
              </ul>
            </>
          ),
        })}
      </IdsTooltip>
    </div>
  ),
};

export const ArrowMatrix: Story = {
  parameters: {
    controls: { disable: true },
    layout: "fullscreen",
  },
  render: () => (
    <div style={TOOLTIP_MATRIX_GRID_STYLE}>
      {TOOLTIP_PLACEMENTS.map((placement) => (
        <div key={placement.key} style={TOOLTIP_MATRIX_CELL_STYLE}>
          <IdsTooltip side={placement.side} arrowAlign={placement.align} closable>
            {compositionSlots({
              trigger: (
                <Button variant="secondary" size="lg">
                  {placement.key}
                </Button>
              ),
              title: "Tooltip Title",
              body: `${placement.side} - ${placement.align}`,
              closable: true,
            })}
          </IdsTooltip>
        </div>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  parameters: { controls: { disable: false } },
  render: (args) => (
    <div style={TOOLTIP_STORY_CANVAS_STYLE}>
      <IdsTooltip
        side={args.side}
        arrowAlign={args.arrowAlign}
        closable={args.closable}
        onClose={(reason) => args.tooltipClosed?.(reason)}
      >
        {compositionSlots({
          trigger: (
            <Button variant="secondary" size="lg">
              {args.triggerLabel}
            </Button>
          ),
          title: args.title || undefined,
          body: args.content,
          closable: args.closable,
        })}
      </IdsTooltip>
    </div>
  ),
  args: {
    side: TOOLTIP_SPEC_ACCURATE_DEFAULTS.side,
    arrowAlign: TOOLTIP_SPEC_ACCURATE_DEFAULTS.arrowAlign,
    closable: TOOLTIP_SPEC_ACCURATE_DEFAULTS.closable,
    title: TOOLTIP_SPEC_ACCURATE_DEFAULTS.title,
    content: TOOLTIP_SPEC_ACCURATE_DEFAULTS.content,
    triggerLabel: "Hover over me",
  } satisfies PlaygroundArgs,
};
