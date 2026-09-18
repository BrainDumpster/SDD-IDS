/**
 * Storybook: design-spec–generated Tooltip from `lib/react/synapse/tooltip`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy (children):
 *   Tooltip
 *     SynapseTooltipTrigger
 *     SynapseTooltipPanel
 *       SynapseTooltipHeader?
 *       SynapseTooltipBody
 *       SynapseTooltipClose?   (auto-emitted when closable)
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/tooltip/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_TOOLTIP_DOCS_DESCRIPTION,
  SYNAPSE_TOOLTIP_SOURCE_CODE,
} from "./synapse-tooltip.developer-usage";
import {
  SynapseTooltip,
  SynapseTooltipBody,
  SynapseTooltipClose,
  SynapseTooltipHeader,
  SynapseTooltipPanel,
  SynapseTooltipTrigger,
  type SynapseTooltipProps,
} from "@synapse/react/tooltip";
import {
  SynapseButton,
  SynapseButtonLabel,
} from "@synapse/react/button";

const longContent =
  "Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a sed ullamcorper laoreet, lectus arcu.";

const meta: Meta<SynapseTooltipProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Tooltip",
  component: SynapseTooltip,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_TOOLTIP_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_TOOLTIP_SOURCE_CODE,
      },
    },
  },
  args: {
    side: "top",
    arrowAlign: "start",
    closable: false,
    hugContent: true,
    maxWidth: 244,
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    arrowAlign: { control: "select", options: ["start", "center", "end"] },
    closable: { control: "boolean" },
    // Always true — tooltip always hugs content; `maxWidth` governs sizing instead.
    hugContent: { control: false },
    maxWidth: {
      control: { type: "number", min: 100, max: 500, step: 4 },
      name: "max width (px)",
    },
    onOpenChange: { action: "onOpenChange" },
    onClose: { action: "onClose" },
  },
};

export default meta;
type Story = StoryObj<SynapseTooltipProps>;

function TriggerButton({ label }: { label: string }) {
  return (
    <SynapseButton variant="secondary" size="large">
      <SynapseButtonLabel>{label}</SynapseButtonLabel>
    </SynapseButton>
  );
}

/** Standard tooltip — body only (no header). */
export const NormalNoHeader: Story = {
  name: "Normal / No Header",
  args: {
    closable: false,
    side: "top",
    arrowAlign: "start",
  },
  render: (args) => (
    <SynapseTooltip {...args}>
      <SynapseTooltipTrigger>
        <TriggerButton label="Hover over me" />
      </SynapseTooltipTrigger>
      <SynapseTooltipPanel>
        <SynapseTooltipBody>{longContent}</SynapseTooltipBody>
      </SynapseTooltipPanel>
    </SynapseTooltip>
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
  render: (args) => (
    <SynapseTooltip {...args}>
      <SynapseTooltipTrigger>
        <TriggerButton label="Hover over me" />
      </SynapseTooltipTrigger>
      <SynapseTooltipPanel>
        <SynapseTooltipHeader>Tooltip Title</SynapseTooltipHeader>
        <SynapseTooltipBody>{longContent}</SynapseTooltipBody>
      </SynapseTooltipPanel>
    </SynapseTooltip>
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
  render: (args) => (
    <SynapseTooltip {...args}>
      <SynapseTooltipTrigger>
        <TriggerButton label="Open closable" />
      </SynapseTooltipTrigger>
      <SynapseTooltipPanel>
        <SynapseTooltipHeader>Tooltip Title</SynapseTooltipHeader>
        <SynapseTooltipBody>{longContent}</SynapseTooltipBody>
        <SynapseTooltipClose />
      </SynapseTooltipPanel>
    </SynapseTooltip>
  ),
};

/** Closable without title — empty Header slot preserved for close alignment. */
export const ClosableNoTitle: Story = {
  name: "Closable / No Title",
  args: {
    closable: true,
    side: "top",
    arrowAlign: "start",
  },
  render: (args) => (
    <SynapseTooltip {...args}>
      <SynapseTooltipTrigger>
        <TriggerButton label="Open closable" />
      </SynapseTooltipTrigger>
      <SynapseTooltipPanel>
        <SynapseTooltipBody>{longContent}</SynapseTooltipBody>
        <SynapseTooltipClose />
      </SynapseTooltipPanel>
    </SynapseTooltip>
  ),
};

/** Body accepts arbitrary consumer content. */
export const RichContent: Story = {
  name: "Rich Content",
  args: {
    closable: false,
    side: "right",
    arrowAlign: "center",
  },
  render: (args) => (
    <SynapseTooltip {...args}>
      <SynapseTooltipTrigger>
        <TriggerButton label="Rich content" />
      </SynapseTooltipTrigger>
      <SynapseTooltipPanel>
        <SynapseTooltipHeader>Custom Content</SynapseTooltipHeader>
        <SynapseTooltipBody>
          <div>
            <p style={{ margin: 0 }}>Any content can be rendered here.</p>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              <li>Text</li>
              <li>Lists</li>
              <li>Inline formatting</li>
            </ul>
          </div>
        </SynapseTooltipBody>
      </SynapseTooltipPanel>
    </SynapseTooltip>
  ),
};

/** All 12 arrow permutations (`side` × `arrowAlign`). */
export const ArrowMatrix: Story = {
  name: "Arrow Matrix",
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
            <SynapseTooltip side={side} arrowAlign={align}>
              <SynapseTooltipTrigger>
                <TriggerButton label={`${side}-${align}`} />
              </SynapseTooltipTrigger>
              <SynapseTooltipPanel>
                <SynapseTooltipHeader>Tooltip Title</SynapseTooltipHeader>
                <SynapseTooltipBody>{`${side} - ${align}`}</SynapseTooltipBody>
              </SynapseTooltipPanel>
            </SynapseTooltip>
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
  },
  render: (args) => (
    <SynapseTooltip {...args}>
      <SynapseTooltipTrigger>
        <TriggerButton label="Hug width" />
      </SynapseTooltipTrigger>
      <SynapseTooltipPanel>
        <SynapseTooltipHeader>Short</SynapseTooltipHeader>
        <SynapseTooltipBody>Compact body</SynapseTooltipBody>
      </SynapseTooltipPanel>
    </SynapseTooltip>
  ),
};
