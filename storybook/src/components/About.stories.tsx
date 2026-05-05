import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { About } from "./About";
import { Button } from "./Button";
import logoDelltech from "../../../assets/icons/logo-delltech-horiz.svg";

const meta: Meta<typeof About> = {
  title: "Synapse/About",
  component: About,
};

export default meta;
type Story = StoryObj<typeof About>;

export const Default: Story = {
  render: () => (
    <About
      trigger={<Button variant="secondary">About Synapse</Button>}
      productTitle="Synapse"
      versionLabel="Version 2.4.1"
      logoSrc={logoDelltech}
      copyrightText="Copyright © 2026 Dell Inc. or its subsidiaries. All Rights Reserved. Dell Technologies, Dell and other trademarks are trademarks of Dell Inc. or its subsidiaries. Other trademarks may be trademarks of their respective owners."
    />
  ),
};

/** Product name + version only; no logo or copyright block. */
export const Minimal: Story = {
  render: () => (
    <About
      trigger={<Button variant="tertiary">About</Button>}
      productTitle="Synapse"
      versionLabel="Version 2.4.1"
    />
  ),
};

export const ControlledFromParent: Story = {
  render: function Controlled() {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open About (controlled)
        </Button>
        <About
          open={open}
          onOpenChange={setOpen}
          productTitle="Synapse"
          versionLabel="Version 2.4.1"
          logoSrc={logoDelltech}
          copyrightText="Short copyright line.\n\nSecond paragraph."
        />
      </div>
    );
  },
};

export const LongCopyrightScroll: Story = {
  render: () => (
    <About
      trigger={<Button>Open About (long copyright)</Button>}
      productTitle="Synapse"
      versionLabel="Version 2.4.1"
      logoSrc={logoDelltech}
      copyrightText={Array.from(
        { length: 12 },
        (_, i) =>
          `Paragraph ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
      ).join("\n\n")}
    />
  ),
};
