import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { Button } from "../Button";
import { IdsDapSidePanel } from "./IdsDapSidePanel";
import { IDS_DAP_SIDE_PANEL_DESIGN_SPEC_PATH, DAP_SIDE_PANEL_DEFAULTS } from "../../spec-contracts/ids-dap-side-panel.contract";

const meta: Meta<typeof IdsDapSidePanel> = {
  title: "DAP/Side Panel",
  component: IdsDapSidePanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Spec-driven DAP Side Panel aligned to \`${IDS_DAP_SIDE_PANEL_DESIGN_SPEC_PATH}\` (MCP node \`46813:263408\`).`,
      },
    },
  },
  args: {
    ...DAP_SIDE_PANEL_DEFAULTS,
  },
};

export default meta;
type Story = StoryObj<typeof IdsDapSidePanel>;

export const ResponsiveDrawer: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    const properties = useMemo(
      () => [
        { key: "Health State", value: "Healthy", iconSlug: "status-ok-circ-solid-16" },
        { key: "Last Update", value: "1 days, 2 hours, 57 minutes" },
        { key: "Virtual Machines", value: "2", iconSlug: "virtual-machine", emphasize: true },
        { key: "Virtual Machines", value: "2", iconSlug: "virtual-machine", emphasize: true },
        { key: "Virtual Machines", value: "2", iconSlug: "virtual-machine", emphasize: true },
        { key: "Virtual Machines", value: "2", iconSlug: "virtual-machine", emphasize: true },
        { key: "Item", value: "-" },
      ],
      []
    );

    const tags = useMemo(
      () => [
        "Tag:Value",
        "Tag:Value",
        "Tag:Value",
        "Tag:Value",
        "Tag:Valueeeeeee",
        "Tag:Value",
        "Tag:Valueeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "Tag:Value",
        "Tag:Valueeeeeee",
      ],
      []
    );

    return (
      <div style={{ height: "100vh", background: "var(--color-background-surface-1)" }}>
        <div style={{ padding: 16, borderBottom: "1px solid var(--color-border-light)", background: "var(--color-background-component)" }}>
          <Button onClick={() => setOpen((v) => !v)}>{open ? "Close Side Panel" : "Open Side Panel"}</Button>
        </div>

        <div style={{ display: "flex", height: "calc(100vh - 65px)", width: "100%" }}>
          <main
            style={{
              flex: "1 1 auto",
              minWidth: 0,
              transition: "width 220ms ease",
              padding: 24,
              boxSizing: "border-box",
              overflow: "auto",
              background: "var(--color-background-surface-1)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Application Body</h2>
            <p>
              This area shrinks responsively when the side panel opens, matching the push-drawer behavior.
            </p>
            <div style={{ height: 1200, border: "1px dashed var(--color-border-light)", padding: 16 }}>
              Sample app content block for responsive behavior validation.
            </div>
          </main>

          <IdsDapSidePanel
            {...args}
            open={open}
            properties={properties}
            tags={tags}
            onOpenChange={setOpen}
          />
        </div>
      </div>
    );
  },
};
