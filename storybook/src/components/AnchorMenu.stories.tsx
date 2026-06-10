import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { IdsAnchorMenu } from "./IdsAnchorMenu";

const meta: Meta<typeof IdsAnchorMenu> = {
  title: "Spec Generated/IDS/AnchorMenu",
  component: IdsAnchorMenu,
};

export default meta;
type Story = StoryObj<typeof IdsAnchorMenu>;

export const FiveSections: Story = {
  args: {
    items: [
      { label: "Overview", href: "#overview", active: true },
      { label: "Installation", href: "#installation" },
      { label: "Usage", href: "#usage" },
      { label: "API Reference", href: "#api-reference" },
      { label: "Examples", href: "#examples" },
    ],
  },
};

export const MiddleActive: Story = {
  args: {
    items: [
      { label: "Overview", href: "#overview" },
      { label: "Installation", href: "#installation" },
      { label: "Usage", href: "#usage", active: true },
      { label: "API Reference", href: "#api-reference" },
      { label: "Examples", href: "#examples" },
    ],
  },
};

export const WithPageContent: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, padding: 24 }}>
      <div style={{ flex: 1, color: "var(--color-text-neutral-strong)" }}>
        <h2 id="overview" style={{ marginBottom: 120 }}>Overview</h2>
        <h2 id="installation" style={{ marginBottom: 120 }}>Installation</h2>
        <h2 id="usage" style={{ marginBottom: 120 }}>Usage</h2>
        <h2 id="api-reference" style={{ marginBottom: 120 }}>API Reference</h2>
        <h2 id="examples" style={{ marginBottom: 120 }}>Examples</h2>
      </div>
      <IdsAnchorMenu
        items={[
          { label: "Overview", href: "#overview", active: true },
          { label: "Installation", href: "#installation" },
          { label: "Usage", href: "#usage" },
          { label: "API Reference", href: "#api-reference" },
          { label: "Examples", href: "#examples" },
        ]}
      />
    </div>
  ),
};
