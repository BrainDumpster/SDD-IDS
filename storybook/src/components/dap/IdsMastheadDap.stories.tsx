import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { IdsMastheadDap } from "./IdsMastheadDap";
import { MASTHEAD_DAP_DEFAULTS } from "../../spec-contracts/ids-masthead-dap.contract";

const meta: Meta<typeof IdsMastheadDap> = {
  title: "IDS/DAP/Masthead",
  component: IdsMastheadDap,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof IdsMastheadDap>;

export const Default: Story = {
  args: {
    ...MASTHEAD_DAP_DEFAULTS,
  },
  render: (args) => {
    const [lastAction, setLastAction] = useState("No selection yet");

    return (
      <div style={{ background: "var(--color-background-surface-1)", minHeight: 360 }}>
        <IdsMastheadDap
          {...args}
          onHelpSelect={(label) => setLastAction(`Help: ${label}`)}
          onLauncherProductSelect={(productId) => setLastAction(`Launcher Product: ${productId}`)}
          onLauncherOptionSelect={(optionId) => setLastAction(`Launcher Option: ${optionId}`)}
        />
        <div
          style={{
            padding: "16px 24px",
            color: "var(--color-text-neutral-strong)",
            fontSize: "var(--font-size-body-2)",
            lineHeight: "var(--font-line-height-line-height-20)",
          }}
        >
          Last interaction: {lastAction}
        </div>
      </div>
    );
  },
};
