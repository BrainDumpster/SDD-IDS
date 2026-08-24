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
  Tooltip,
  TooltipBody,
  TooltipClose,
  TooltipHeader,
  TooltipPanel,
  TooltipTrigger,
  type TooltipProps,
} from "../../../../lib/react/ids/tooltip";
import {
  IdsButton,
  IdsButtonLabel,
} from "../../../../lib/react/ids/button";

const longContent =
  "Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a sed ullamcorper laoreet, lectus arcu.";

const meta: Meta<TooltipProps> = {
  title: "Components/IDS/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React IDS Tooltip from `components/ids/tooltip/design-spec.md`. " +
          "Anatomy: Tooltip → Trigger / Panel → Header? / Body / Close?. " +
          "Arrow always rendered (12 side×align permutations). " +
          "Theme: `components/ids-theme.css`.",
      },
    },
  },
  args: {
    side: "top",
    arrowAlign: "start",
    closable: false,
    hugContent: false,
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    arrowAlign: { control: "select", options: ["start", "center", "end"] },
    closable: { control: "boolean" },
    hugContent: { control: "boolean" },
    onOpenChange: { action: "onOpenChange" },
    onClose: { action: "onClose" },
  },
};

export default meta;
type Story = StoryObj<TooltipProps>;

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
  args: {
    closable: false,
    side: "top",
    arrowAlign: "start",
  },
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger>
        <TriggerButton label="Hover over me" />
      </TooltipTrigger>
      <TooltipPanel>
        <TooltipBody>{longContent}</TooltipBody>
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
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger>
        <TriggerButton label="Hover over me" />
      </TooltipTrigger>
      <TooltipPanel>
        <TooltipHeader>Tooltip Title</TooltipHeader>
        <TooltipBody>{longContent}</TooltipBody>
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
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger>
        <TriggerButton label="Open closable" />
      </TooltipTrigger>
      <TooltipPanel>
        <TooltipHeader>Tooltip Title</TooltipHeader>
        <TooltipBody>{longContent}</TooltipBody>
        <TooltipClose />
      </TooltipPanel>
    </Tooltip>
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
    <Tooltip {...args}>
      <TooltipTrigger>
        <TriggerButton label="Open closable" />
      </TooltipTrigger>
      <TooltipPanel>
        <TooltipBody>{longContent}</TooltipBody>
        <TooltipClose />
      </TooltipPanel>
    </Tooltip>
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
    <Tooltip {...args}>
      <TooltipTrigger>
        <TriggerButton label="Rich content" />
      </TooltipTrigger>
      <TooltipPanel>
        <TooltipHeader>Custom Content</TooltipHeader>
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
    closable: false,
    side: "bottom",
    arrowAlign: "center",
  },
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger>
        <TriggerButton label="Hug width" />
      </TooltipTrigger>
      <TooltipPanel>
        <TooltipHeader>Short</TooltipHeader>
        <TooltipBody>Compact body</TooltipBody>
      </TooltipPanel>
    </Tooltip>
  ),
};
