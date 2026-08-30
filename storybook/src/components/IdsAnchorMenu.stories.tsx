import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { IdsAnchorMenu } from "./IdsAnchorMenu";

/** Figma `AnchorMenu-Example` (`11955:229709`) — first section selected. */
const specAccurateItems = [
  { label: "Overview", href: "#overview", active: true },
  { label: "Types", href: "#types" },
  { label: "Anatomy", href: "#anatomy" },
  { label: "Usage Rules", href: "#usage-rules" },
  { label: "States and Colors", href: "#states-and-colors" },
  { label: "Redlines", href: "#redlines" },
] as const;

const meta: Meta<typeof IdsAnchorMenu> = {
  title: "Spec Generated/IDS/Anchor Menu",
  component: IdsAnchorMenu,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof IdsAnchorMenu>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    items: [...specAccurateItems],
  },
};

export const MiddleActive: Story = {
  args: {
    items: specAccurateItems.map((item, index) => ({
      ...item,
      active: index === 2,
    })),
  },
};

export const WithPageContent: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, padding: 24 }}>
      <div style={{ flex: 1, color: "var(--color-text-neutral-strong)" }}>
        {specAccurateItems.map((item) => (
          <section
            key={item.href}
            id={item.href.replace("#", "")}
            style={{ minHeight: 500, paddingBottom: 120 }}
          >
            <h2 style={{ marginBottom: 24 }}>{item.label}</h2>
            <p>Sample content for {item.label} section.</p>
          </section>
        ))}
      </div>
      <div style={{ position: "sticky", top: 24, alignSelf: "flex-start" }}>
        <IdsAnchorMenu items={[...specAccurateItems]} />
      </div>
    </div>
  ),
};

export const LongLabels: Story = {
  name: "Long Labels",
  args: {
    items: [
      { label: "Overview", href: "#overview" },
      { label: "Types and classifications of anchor menu patterns", href: "#types" },
      { label: "A deliberately extremely long anchor menu section title that overflows the two-line clamp and shows an ellipsis on the third line", href: "#anatomy", active: true },
      { label: "Usage Rules", href: "#usage-rules" },
      { label: "States and Colors", href: "#states-and-colors" },
      { label: "Redlines", href: "#redlines" },
    ],
  },
};
