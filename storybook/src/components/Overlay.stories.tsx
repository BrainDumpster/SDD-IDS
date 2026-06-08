import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Overlay } from "./Overlay";
import { IdsButton } from "./IdsButton";
import { IdsTextBox } from "./IdsTextBox";

const meta: Meta<typeof Overlay> = {
  title: "Spec Generated/Synapse/Overlay",
  component: Overlay,
  argTypes: {
    width: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Overlay>;

export const Default: Story = {
  args: {
    trigger: <IdsButton>Open Overlay</IdsButton>,
    title: "Details Panel",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, color: "var(--color-text-neutral)" }}>
          This is a slide-in panel from the right side of the screen.
          It's useful for viewing details or editing forms without leaving the
          current page context.
        </p>
        <IdsTextBox placeholder="Enter name" ariaLabel="Name" />
        <IdsTextBox placeholder="Enter description" ariaLabel="Description" />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <IdsButton size="sm">Save</IdsButton>
          <IdsButton variant="secondary" size="sm">Cancel</IdsButton>
        </div>
      </div>
    ),
  },
};

export const WidePanel: Story = {
  args: {
    trigger: <IdsButton variant="secondary">Open Wide Panel</IdsButton>,
    title: "Configuration",
    width: "560px",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, color: "var(--color-text-neutral)" }}>
          A wider panel for more complex content layouts.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <IdsTextBox placeholder="First" ariaLabel="First name" />
          <IdsTextBox placeholder="Last" ariaLabel="Last name" />
          <IdsTextBox placeholder="Email" ariaLabel="Email" />
          <IdsTextBox placeholder="Phone" ariaLabel="Phone" />
        </div>
      </div>
    ),
  },
};

export const NarrowPanel: Story = {
  args: {
    trigger: <IdsButton variant="ghost">Open Narrow</IdsButton>,
    title: "Quick Actions",
    width: "320px",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <IdsButton variant="secondary" style={{ justifyContent: "flex-start" }}>
          Export data
        </IdsButton>
        <IdsButton variant="secondary" style={{ justifyContent: "flex-start" }}>
          Import data
        </IdsButton>
        <IdsButton variant="secondary" style={{ justifyContent: "flex-start" }}>
          Download report
        </IdsButton>
      </div>
    ),
  },
};
