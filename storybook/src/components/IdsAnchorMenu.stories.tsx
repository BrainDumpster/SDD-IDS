/**
 * Spec Generated stories — thin wrapper over `lib/react/ids/anchor-menu`.
 * Canonical Lib Generated stories: `lib-generated/AnchorMenu.stories.tsx`
 * Spec: components/ids/anchor-menu/design-spec.md
 */
import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { IdsAnchorMenu } from "../../../lib/react/ids/anchor-menu";

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
      <div style={{ flex: 1, color: "var(--color-text-gray-neutral-strong)" }}>
        {specAccurateItems.map((item) => (
          <h2
            key={item.href}
            id={item.href.replace("#", "")}
            style={{ marginBottom: 120 }}
          >
            {item.label}
          </h2>
        ))}
      </div>
      <IdsAnchorMenu items={[...specAccurateItems]} sticky />
    </div>
  ),
};
