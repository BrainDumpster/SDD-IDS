import React, { useState } from "react";
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AppLauncherProductTile,
} from "../../../../storybook/src/components/AppLauncher";
import { SynapseAppLauncher } from "../../../../storybook/src/components/SynapseAppLauncher";
import tileStyles from "../../../../storybook/src/components/AppLauncher.module.css";
import {
  SYNAPSE_APP_LAUNCHER_DESIGN_SPEC_PATH,
  SYNAPSE_APP_LAUNCHER_ELEMENT_NODE_ID,
  SYNAPSE_APP_LAUNCHER_MAIN_NODE_ID,
  SYNAPSE_APP_LAUNCHER_PRODUCT_COUNT_NODES,
  SYNAPSE_APP_LAUNCHER_SAMPLE_PRODUCT_NAME,
  SYNAPSE_APP_LAUNCHER_SURFACE_WIDTH_TWO_PX,
  SYNAPSE_APP_LAUNCHER_TILE_STATE_NODES,
} from "../../../../storybook/src/spec-contracts/synapse-app-launcher.contract";

const specProducts = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `product-${index + 1}`,
    name: SYNAPSE_APP_LAUNCHER_SAMPLE_PRODUCT_NAME,
    onSelect: () => undefined,
  }));

const twoProductArgs = {
  products: specProducts(2),
  columns: 2,
  sideOffset: 8,
};

const meta: Meta<typeof SynapseAppLauncher> = {
  title: "Spec Generated/Synapse/App Launcher",
  component: SynapseAppLauncher,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse App Launcher (IDS contract). Source: \`${SYNAPSE_APP_LAUNCHER_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **2 products** (Figma \`${SYNAPSE_APP_LAUNCHER_PRODUCT_COUNT_NODES.two}\`, ${SYNAPSE_APP_LAUNCHER_SURFACE_WIDTH_TWO_PX}px).`,
          `Tile states: \`${SYNAPSE_APP_LAUNCHER_ELEMENT_NODE_ID}\`.`,
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  args: twoProductArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseAppLauncher>;

function LauncherCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 24,
        background: "var(--color-background-surface-1)",
        minHeight: 200,
      }}
    >
      {children}
    </div>
  );
}

/** Figma `13231:124200` — 2 products, IDS internal dotted tile rail on leading tile (`13231:109518`, 110px / 7px inset), `298×127`. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <LauncherCanvas>
      <SynapseAppLauncher {...args} panelOnly />
    </LauncherCanvas>
  ),
  args: twoProductArgs,
};

/** Figma `13231:123761` — product count layouts. */
export const ProductCountMatrix: Story = {
  name: "Product Count Matrix",
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 24,
        padding: 24,
        background: "var(--color-background-surface-1)",
        alignItems: "flex-start",
      }}
    >
      {[1, 2, 3, 4, 8].map((count) => (
        <div key={count} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span
            style={{
              fontSize: "var(--font-size-body-2)",
              color: "var(--color-text-neutral)",
            }}
          >
            {count} product{count === 1 ? "" : "s"} — Figma{" "}
            {SYNAPSE_APP_LAUNCHER_PRODUCT_COUNT_NODES[
              count === 1
                ? "one"
                : count === 2
                  ? "two"
                  : count === 3
                    ? "three"
                    : count === 4
                      ? "four"
                      : "eight"
            ]}
          </span>
          <SynapseAppLauncher products={specProducts(count)} panelOnly />
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" },
};

/** Figma `13231:109521` — tile Default / Hover / Press / Focus. */
export const TileStateMatrix: Story = {
  name: "Tile State Matrix",
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: 24,
        background: "var(--color-background-surface-1)",
        flexWrap: "wrap",
      }}
    >
      {(
        [
          ["default", undefined],
          ["hover", "hover"],
          ["press", "press"],
          ["focus", "focus"],
        ] as const
      ).map(([label, state]) => (
        <div key={label} style={{ textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "var(--font-size-body-2)",
              color: "var(--color-text-neutral)",
            }}
          >
            {label} — {SYNAPSE_APP_LAUNCHER_TILE_STATE_NODES[label]}
          </p>
          <AppLauncherProductTile
            name={SYNAPSE_APP_LAUNCHER_SAMPLE_PRODUCT_NAME}
            tileClassName={[tileStyles.programmeSynapseTile, tileStyles.appTileTwoProduct]
              .filter(Boolean)
              .join(" ")}
            tileDivider="dotted"
            demoState={state}
          />
        </div>
      ))}
    </div>
  ),
};

/** Masthead trigger + open panel (Synapse masthead contract). */
export const MastheadTrigger: Story = {
  name: "Masthead Trigger",
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <LauncherCanvas>
        <div
          style={{
            display: "inline-flex",
            background: "var(--color-background-masthead-brand-base)",
          }}
        >
          <SynapseAppLauncher
            {...twoProductArgs}
            triggerVariant="masthead"
            sideOffset={0}
            open={open}
            onOpenChange={setOpen}
          />
        </div>
      </LauncherCanvas>
    );
  },
};
