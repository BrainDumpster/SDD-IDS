import type { Meta, StoryObj } from "@storybook/react";
import { Overlay } from "./Overlay";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

const meta: Meta<typeof Overlay> = {
  title: "Synapse/Overlay",
  component: Overlay,
  argTypes: {
    width: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Overlay>;

export const Default: Story = {
  args: {
    trigger: <Button>Open Overlay</Button>,
    title: "Details Panel",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, color: "var(--color-text-neutral)" }}>
          This is a slide-in panel from the right side of the screen.
          It's useful for viewing details or editing forms without leaving the
          current page context.
        </p>
        <TextInput label="Name" placeholder="Enter name" />
        <TextInput label="Description" placeholder="Enter description" />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Button size="sm">Save</Button>
          <Button variant="secondary" size="sm">Cancel</Button>
        </div>
      </div>
    ),
  },
};

export const WidePanel: Story = {
  args: {
    trigger: <Button variant="secondary">Open Wide Panel</Button>,
    title: "Configuration",
    width: "560px",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, color: "var(--color-text-neutral)" }}>
          A wider panel for more complex content layouts.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <TextInput label="First name" placeholder="First" />
          <TextInput label="Last name" placeholder="Last" />
          <TextInput label="Email" placeholder="Email" />
          <TextInput label="Phone" placeholder="Phone" />
        </div>
      </div>
    ),
  },
};

export const NarrowPanel: Story = {
  args: {
    trigger: <Button variant="ghost">Open Narrow</Button>,
    title: "Quick Actions",
    width: "320px",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Button variant="secondary" style={{ justifyContent: "flex-start" }}>
          Export data
        </Button>
        <Button variant="secondary" style={{ justifyContent: "flex-start" }}>
          Import data
        </Button>
        <Button variant="secondary" style={{ justifyContent: "flex-start" }}>
          Download report
        </Button>
      </div>
    ),
  },
};
