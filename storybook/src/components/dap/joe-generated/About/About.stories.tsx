import type { Meta, StoryObj } from "@storybook/react";
import "../tokens.css";
import About from "./About";

/**
 * Joe-Generated About — uses only:
 * - storybook/src/components/dap/joe-generated/About/About.tsx
 * - storybook/src/components/dap/joe-generated/About/About.css (imported by About.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 */
const meta: Meta<typeof About> = {
  title: "Spec Generated/DAP/Joe-Generated/About",
  component: About,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Joe-generated DAP About. Implementation: `storybook/src/components/dap/joe-generated/About/About.tsx` + `About.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/About/about.mdx`.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "modal",
        "inline",
        "minimal",
        "detailed",
        "branded",
        "with-updates",
        "with-support",
      ],
    },
    onClose: { action: "onClose" },
  },
  args: {
    appName: "Application",
    version: "1.0.0",
    description: "Application description",
    systemInfo: "",
    legalText: "© 2024 Company. All rights reserved.",
    links: [],
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof About>;

export const Default: Story = {};

export const WithLinksAndSystemInfo: Story = {
  args: {
    appName: "Application",
    version: "1.0.0",
    description: "Application description",
    systemInfo: "Platform details for this build.",
    legalText: "© 2024 Company. All rights reserved.",
    links: [
      { label: "Documentation", href: "https://example.com/docs" },
      { label: "Support", href: "https://example.com/support" },
    ],
    variant: "detailed",
  },
};

export const Modal: Story = {
  args: {
    variant: "modal",
    onClose: () => undefined,
  },
};

export const Minimal: Story = {
  args: {
    variant: "minimal",
  },
};

export const Branded: Story = {
  args: {
    variant: "branded",
    logoSlug: "logo-dell-circle-color",
  },
};
