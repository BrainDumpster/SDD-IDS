/**
 * Storybook: design-spec–generated Tooltip from `lib/react/ids/tooltip`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy (children):
 *   Tooltip
 *     TooltipTrigger
 *     TooltipPanel
 *       TooltipHeader?
 *       TooltipBody
 *       TooltipClose?   (auto-emitted when closable)
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/tooltip/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  TOOLTIP_DOCS_DESCRIPTION,
  TOOLTIP_SOURCE_CODE,
} from "./ids-tooltip.developer-usage";
import {
  Tooltip,
  TooltipBody,
  TooltipClose,
  TooltipHeader,
  TooltipPanel,
  TooltipTrigger,
  type TooltipProps,
} from "@ids/react/tooltip";
import {
  IdsButton,
  IdsButtonLabel,
} from "@ids/react/button";

const longContent =
  "Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a sed ullamcorper laoreet, lectus arcu.";

/** Story-only args: `title`/`content` feed TooltipHeader/TooltipBody children. */
type TooltipStoryArgs = TooltipProps & {
  title: string;
  content: string;
};

const meta: Meta<TooltipStoryArgs> = {
  tags: ["autodocs"],
  title: "Components/IDS/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: TOOLTIP_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: TOOLTIP_SOURCE_CODE,
      },
    },
  },
  args: {
    side: "top",
    arrowAlign: "start",
    closable: false,
    hugContent: true,
    maxWidth: 244,
    maxHeight: 300,
    title: "Tooltip Title",
    content: longContent,
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    arrowAlign: { control: "select", options: ["start", "center", "end"] },
    closable: { control: "boolean" },
    title: { control: "text", name: "title text" },
    content: { control: "text", name: "body text" },
    // Always true — tooltip always hugs content; `maxWidth` governs sizing instead.
    hugContent: { control: false },
    maxWidth: {
      control: { type: "number", min: 100, max: 500, step: 4 },
      name: "max width (px)",
    },
    maxHeight: {
      control: { type: "number", min: 60, max: 600, step: 10 },
      name: "max height (px)",
    },
    onOpenChange: { action: "onOpenChange" },
    onClose: { action: "onClose" },
  },
};

export default meta;
type Story = StoryObj<TooltipStoryArgs>;

function TriggerButton({ label }: { label: string }) {
  return (
    <IdsButton variant="secondary" size="large">
      <IdsButtonLabel>{label}</IdsButtonLabel>
    </IdsButton>
  );
}

/** Standard tooltip — body only (no header). */
export const NormalNoHeader: Story = {
  name: "Normal / No Header",
  parameters: { controls: { exclude: ["title"] } },
  args: {
    closable: false,
    side: "top",
    arrowAlign: "start",
  },
  render: ({ content, ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger>
        <TriggerButton label="Hover over me" />
      </TooltipTrigger>
      <TooltipPanel>
        <TooltipBody>{content}</TooltipBody>
      </TooltipPanel>
    </Tooltip>
  ),
};

/** Standard tooltip with optional Header. */
export const WithHeader: Story = {
  name: "With Header",
  args: {
    closable: false,
    side: "top",
    arrowAlign: "center",
  },
  render: ({ title, content, ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger>
        <TriggerButton label="Hover over me" />
      </TooltipTrigger>
      <TooltipPanel>
        <TooltipHeader>{title}</TooltipHeader>
        <TooltipBody>{content}</TooltipBody>
      </TooltipPanel>
    </Tooltip>
  ),
};

/** Closable — ContentColumn + CloseAction sibling; stays open until close. */
export const Closable: Story = {
  name: "Closable",
  args: {
    closable: true,
    side: "top",
    arrowAlign: "end",
  },
  render: ({ title, content, ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger>
        <TriggerButton label="Open closable" />
      </TooltipTrigger>
      <TooltipPanel>
        <TooltipHeader>{title}</TooltipHeader>
        <TooltipBody>{content}</TooltipBody>
        <TooltipClose />
      </TooltipPanel>
    </Tooltip>
  ),
};

/** Closable without title — empty Header slot preserved for close alignment. */
export const ClosableNoTitle: Story = {
  name: "Closable / No Title",
  parameters: { controls: { exclude: ["title"] } },
  args: {
    closable: true,
    side: "top",
    arrowAlign: "start",
  },
  render: ({ content, ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger>
        <TriggerButton label="Open closable" />
      </TooltipTrigger>
      <TooltipPanel>
        <TooltipBody>{content}</TooltipBody>
        <TooltipClose />
      </TooltipPanel>
    </Tooltip>
  ),
};

/** Body accepts arbitrary consumer content. */
export const RichContent: Story = {
  name: "Rich Content",
  parameters: { controls: { exclude: ["content"] } },
  args: {
    closable: false,
    side: "right",
    arrowAlign: "center",
    title: "Custom Content",
  },
  render: ({ title, ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger>
        <TriggerButton label="Rich content" />
      </TooltipTrigger>
      <TooltipPanel>
        <TooltipHeader>{title}</TooltipHeader>
        <TooltipBody>
          <div>
            <p style={{ margin: 0 }}>Any content can be rendered here.</p>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              <li>Text</li>
              <li>Lists</li>
              <li>Inline formatting</li>
            </ul>
          </div>
        </TooltipBody>
      </TooltipPanel>
    </Tooltip>
  ),
};

/** All 12 arrow permutations (`side` × `arrowAlign`). */
export const ArrowMatrix: Story = {
  name: "Arrow Matrix",
  parameters: { controls: { exclude: ["title", "content"] } },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
        gap: 20,
        padding: 24,
      }}
    >
      {(["bottom", "top", "right", "left"] as const).flatMap((side) =>
        (["start", "center", "end"] as const).map((align) => (
          <div
            key={`${side}-${align}`}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Tooltip side={side} arrowAlign={align}>
              <TooltipTrigger>
                <TriggerButton label={`${side}-${align}`} />
              </TooltipTrigger>
              <TooltipPanel>
                <TooltipHeader>Tooltip Title</TooltipHeader>
                <TooltipBody>{`${side} - ${align}`}</TooltipBody>
              </TooltipPanel>
            </Tooltip>
          </div>
        )),
      )}
    </div>
  ),
};

/** hugContent — popup width shrinks to content. */
export const HugContent: Story = {
  name: "Hug Content",
  args: {
    hugContent: true,
    maxWidth: 244,
    closable: false,
    side: "bottom",
    arrowAlign: "center",
    title: "Short",
    content: "Compact body",
  },
  render: ({ title, content, ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger>
        <TriggerButton label="Hug width" />
      </TooltipTrigger>
      <TooltipPanel>
        <TooltipHeader>{title}</TooltipHeader>
        <TooltipBody>{content}</TooltipBody>
      </TooltipPanel>
    </Tooltip>
  ),
};
