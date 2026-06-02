import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./Link";

const meta: Meta<typeof Link> = {
  title: "Spec Generated/IDS/Link",
  component: Link,
  argTypes: {
    type: { control: "select", options: ["standalone", "inline", "dark-bg"] },
    demoState: { control: "select", options: ["default", "hover", "press", "focus-visible"] },
    showExternalLinkIcon: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const DefaultManual: Story = {
  args: {
    href: "#",
    children: "This is a link",
    type: "standalone",
    demoState: "default",
  },
};

export const WithExternalIconManual: Story = {
  args: {
    href: "https://example.com",
    children: "This is a link",
    type: "standalone",
    demoState: "default",
    showExternalLinkIcon: true,
  },
};

export const DarkBackgroundManual: Story = {
  args: {
    href: "#",
    children: "This is a link",
    type: "dark-bg",
    demoState: "default",
  },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--color-background-controls-brand-base)", padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export const StateMatrixWithIconManual: Story = {
  render: () => (
    <div style={{ background: "var(--color-background-surface-1)", padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", columnGap: 56 }}>
        <h3 style={{ margin: "0 0 20px 0", fontWeight: 400, fontSize: 24, lineHeight: "32px" }}>Standalone</h3>
        <h3 style={{ margin: "0 0 20px 0", fontWeight: 400, fontSize: 24, lineHeight: "32px" }}>Inline</h3>
        <h3 style={{ margin: "0 0 20px 0", fontWeight: 400, fontSize: 24, lineHeight: "32px" }}>Dark Bg</h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 134px", columnGap: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Link href="#" type="standalone" demoState="default">This is a link</Link>
          <Link href="#" type="standalone" demoState="hover">This is a link</Link>
          <Link href="#" type="standalone" demoState="press">This is a link</Link>
          <Link href="#" type="standalone" demoState="focus-visible">This is a link</Link>
          <div style={{ height: 22 }} />
          <Link href="https://example.com" type="standalone" demoState="default" showExternalLinkIcon>This is a link</Link>
          <Link href="https://example.com" type="standalone" demoState="hover" showExternalLinkIcon>This is a link</Link>
          <Link href="https://example.com" type="standalone" demoState="press" showExternalLinkIcon>This is a link</Link>
          <Link href="https://example.com" type="standalone" demoState="focus-visible" showExternalLinkIcon>This is a link</Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Link href="#" type="inline" demoState="default">This is a link</Link>
          <Link href="#" type="inline" demoState="hover">This is a link</Link>
          <Link href="#" type="inline" demoState="press">This is a link</Link>
          <Link href="#" type="inline" demoState="focus-visible">This is a link</Link>
          <div style={{ height: 22 }} />
          <Link href="https://example.com" type="inline" demoState="default" showExternalLinkIcon>This is a link</Link>
          <Link href="https://example.com" type="inline" demoState="hover" showExternalLinkIcon>This is a link</Link>
          <Link href="https://example.com" type="inline" demoState="press" showExternalLinkIcon>This is a link</Link>
          <Link href="https://example.com" type="inline" demoState="focus-visible" showExternalLinkIcon>This is a link</Link>
        </div>
        <div style={{ background: "var(--color-background-controls-brand-base)", padding: "2px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
          <Link href="#" type="dark-bg" demoState="default">This is a link</Link>
          <Link href="#" type="dark-bg" demoState="hover">This is a link</Link>
          <Link href="#" type="dark-bg" demoState="press">This is a link</Link>
          <Link href="#" type="dark-bg" demoState="focus-visible">This is a link</Link>
          <div style={{ height: 22 }} />
          <Link href="https://example.com" type="dark-bg" demoState="default" showExternalLinkIcon>This is a link</Link>
          <Link href="https://example.com" type="dark-bg" demoState="hover" showExternalLinkIcon>This is a link</Link>
          <Link href="https://example.com" type="dark-bg" demoState="press" showExternalLinkIcon>This is a link</Link>
          <Link href="https://example.com" type="dark-bg" demoState="focus-visible" showExternalLinkIcon>This is a link</Link>
        </div>
      </div>
    </div>
  ),
};
