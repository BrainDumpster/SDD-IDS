import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { Button } from "./Button";

const meta: Meta<typeof Tooltip> = {
  title: "Synapse/Tooltip",
  component: Tooltip,
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="secondary">{String(args.children ?? "Trigger")}</Button>
    </Tooltip>
  ),
  args: {
    title: "Tooltip Title",
    content: "Tooltip content",
    side: "bottom",
    align: "start",
    showArrow: true,
    dismissible: false,
    children: "Trigger",
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
    showArrow: { control: "boolean" },
    dismissible: { control: "boolean" },
    title: { control: "text" },
    content: { control: "text" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const NoTitle: Story = {
  args: {
    content:
      "Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a sed ullamcorper laoreet, lectus arcu.",
    side: "bottom",
    align: "start",
    title: "",
    dismissible: false,
    showArrow: true,
    children: "Hover over me",
  },
};

export const WithTitle: Story = {
  args: {
    title: "Tooltip Title",
    content:
      "Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a sed ullamcorper laoreet, lectus arcu.",
    side: "bottom",
    align: "start",
    dismissible: false,
    showArrow: true,
    children: "With Title",
  },
};

export const Dismissible: Story = {
  args: {
    title: "Tooltip Title",
    dismissible: true,
    content: "Unlike standard tooltip behavior, this dismissible tooltip remains open until manually closed.",
    side: "bottom",
    align: "start",
    showArrow: true,
    children: "Dismissible",
  },
};

export const ArrowMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(220px, 1fr))", gap: 20, padding: 24 }}>
      {(["bottom", "top", "right", "left"] as const).flatMap((side) =>
        (["start", "center", "end"] as const).map((align) => (
          <div key={`${side}-${align}`} style={{ display: "flex", justifyContent: "center" }}>
            <Tooltip
              title="Tooltip Title"
              content={`${side} - ${align}`}
              side={side}
              align={align}
              showArrow
            >
              <Button variant="secondary">{`${side}-${align}`}</Button>
            </Tooltip>
          </div>
        ))
      )}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    title: "Tooltip Title",
    content: "Tooltip content",
    side: "bottom",
    align: "start",
    showArrow: true,
    dismissible: false,
    children: "Trigger",
  },
};
