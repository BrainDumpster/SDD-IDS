import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { Button } from "./Button";

const meta: Meta<typeof Card> = {
  title: "Synapse/Card",
  component: Card,
  argTypes: {
    elevated: { control: "boolean" },
    outlined: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  args: {
    title: "Card Title",
    children: (
      <p style={{ margin: 0 }}>
        This is a basic card with a title and body content. Cards are used to
        group related information into a single container.
      </p>
    ),
  },
};

export const Elevated: Story = {
  args: {
    title: "Elevated Card",
    elevated: true,
    children: (
      <p style={{ margin: 0 }}>
        This card uses shadow tokens to create a raised appearance.
      </p>
    ),
  },
};

export const Outlined: Story = {
  args: {
    title: "Outlined Card",
    outlined: true,
    children: (
      <p style={{ margin: 0 }}>
        This card uses a border to define its boundary.
      </p>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    title: "Card with Footer",
    outlined: true,
    children: (
      <p style={{ margin: 0 }}>
        This card includes a footer area for actions or supplementary info.
      </p>
    ),
    footer: (
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button variant="secondary" size="sm">Cancel</Button>
        <Button size="sm">Save</Button>
      </div>
    ),
  },
};

export const NoTitle: Story = {
  args: {
    outlined: true,
    children: (
      <p style={{ margin: 0 }}>
        Cards work without a title too. Just body content.
      </p>
    ),
  },
};

export const Gallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card title="Default">
        <p style={{ margin: 0 }}>No elevation or border.</p>
      </Card>
      <Card title="Elevated" elevated>
        <p style={{ margin: 0 }}>Shadow for depth.</p>
      </Card>
      <Card title="Outlined" outlined>
        <p style={{ margin: 0 }}>Border for structure.</p>
      </Card>
      <Card
        title="Both"
        elevated
        outlined
        footer={<span style={{ fontSize: 12, color: "#757575" }}>Last updated: today</span>}
      >
        <p style={{ margin: 0 }}>Elevated and outlined with footer.</p>
      </Card>
    </div>
  ),
};
