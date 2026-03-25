import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Synapse/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const ThreeColumns: Story = {
  args: {
    links: [
      [
        { label: "Documentation", href: "/docs" },
        { label: "Tutorials", href: "/tutorials" },
        { label: "API Reference", href: "/api" },
        { label: "Changelog", href: "/changelog" },
      ],
      [
        { label: "Community", href: "/community" },
        { label: "Support", href: "/support" },
        { label: "GitHub", href: "https://github.com" },
        { label: "Discussions", href: "/discussions" },
      ],
      [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Settings", href: "/cookies" },
        { label: "Accessibility", href: "/accessibility" },
      ],
    ],
    copyright: "\u00a9 2026 Synapse Design System. All rights reserved.",
  },
};

export const SingleColumn: Story = {
  args: {
    links: [
      [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Contact", href: "/contact" },
      ],
    ],
    copyright: "\u00a9 2026 Synapse",
  },
};

export const CopyrightOnly: Story = {
  args: {
    copyright: "\u00a9 2026 Synapse Design System. All rights reserved.",
  },
};
