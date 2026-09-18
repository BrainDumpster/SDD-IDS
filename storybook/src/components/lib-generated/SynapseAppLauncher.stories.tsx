/**
 * Storybook: design-spec–generated App Launcher from `lib/react/synapse/app-launcher`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy (deterministic child order — root is AppLauncher, not AppLauncherRoot):
 *   SynapseAppLauncher (AppLauncher)
 *     SynapseAppLauncherTrigger
 *     SynapseAppLauncherSurface
 *       SynapseAppLauncherProductRegion
 *         SynapseAppLauncherProductRowGroup[]
 *           SynapseAppLauncherRowDivider?
 *           SynapseAppLauncherProductRow
 *             SynapseAppLauncherColumnDivider?   (productCount ≥ 3)
 *             SynapseAppLauncherProductTile
 *               SynapseAppLauncherLabelCluster
 *                 SynapseAppLauncherProductIcon?
 *                 SynapseAppLauncherProductLabel
 *               SynapseAppLauncherTileDividerRail?  (2 products, leading tile)
 *       SynapseAppLauncherOptionsRegion?
 *         SynapseAppLauncherOptionRow[]
 *         SynapseAppLauncherFooterAction?
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/app-launcher/design-spec.md
 */
import React, { type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_APP_LAUNCHER_DOCS_DESCRIPTION,
  SYNAPSE_APP_LAUNCHER_SOURCE_CODE,
} from "./synapse-app-launcher.developer-usage";
import {
  SynapseAppLauncher,
  SynapseAppLauncherColumnDivider,
  SynapseAppLauncherLabelCluster,
  SynapseAppLauncherOptionsRegion,
  SynapseAppLauncherProductIcon,
  SynapseAppLauncherProductLabel,
  SynapseAppLauncherProductRegion,
  SynapseAppLauncherProductRow,
  SynapseAppLauncherProductRowGroup,
  SynapseAppLauncherProductTile,
  SynapseAppLauncherRowDivider,
  SynapseAppLauncherSurface,
  SynapseAppLauncherTileDividerRail,
  SynapseAppLauncherTrigger,
  type SynapseAppLauncherOption,
  type SynapseAppLauncherProduct,
  type SynapseAppLauncherProps,
} from "@synapse/react/app-launcher";

const DESIGN_SPEC_PATH = "components/synapse/app-launcher/design-spec.md";

const products: SynapseAppLauncherProduct[] = [
  { id: "p1", name: "Product Name 1" },
  { id: "p2", name: "Product Name 2" },
  { id: "p3", name: "Product Name 3" },
  { id: "p4", name: "Product Name 4" },
];

const optionsList: SynapseAppLauncherOption[] = [
  { id: "o1", label: "Option" },
  { id: "o2", label: "Option" },
  { id: "o3", label: "Option" },
  { id: "o4", label: "Option" },
];

const mastheadFrame: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  background: "var(--color-background-masthead-base)",
  minHeight: 56,
};

const meta: Meta<SynapseAppLauncherProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/App Launcher",
  component: SynapseAppLauncher,
  parameters: {
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_APP_LAUNCHER_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_APP_LAUNCHER_SOURCE_CODE,
      },
    },
  },
  args: {
    products,
    triggerVariant: "default",
    columns: 2,
    sideOffset: 8,
  },
  argTypes: {
    triggerVariant: { control: "radio", options: ["default", "masthead"] },
    panelOnly: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<SynapseAppLauncherProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    products,
    options: optionsList,
    triggerVariant: "masthead",
    sideOffset: 0,
    defaultOpen: true,
  },
  render: (args) => (
    <div style={mastheadFrame}>
      <SynapseAppLauncher {...args} />
    </div>
  ),
};

/** Explicit Anatomy slots in Codegen Contract order (same tree the prop API emits). */
export const DeterministicAnatomy: Story = {
  name: "Deterministic Anatomy",
  render: () => (
    <SynapseAppLauncher products={products} options={optionsList} panelOnly>
      <SynapseAppLauncherSurface>
        <SynapseAppLauncherProductRegion />
        <SynapseAppLauncherOptionsRegion />
      </SynapseAppLauncherSurface>
    </SynapseAppLauncher>
  ),
};

export const NestedHierarchyTwoProduct: Story = {
  name: "Nested Hierarchy (2-product rail)",
  render: () => (
    <SynapseAppLauncher products={products.slice(0, 2)} panelOnly>
      <SynapseAppLauncherSurface>
        <SynapseAppLauncherProductRegion>
          <SynapseAppLauncherProductRowGroup rowIndex={0}>
            <SynapseAppLauncherProductRow>
              <SynapseAppLauncherProductTile
                id="p1"
                name="Product Name 1"
                twoProductLayout
                tileDivider="dotted"
              >
                <SynapseAppLauncherLabelCluster>
                  <SynapseAppLauncherProductIcon />
                  <SynapseAppLauncherProductLabel>Product Name 1</SynapseAppLauncherProductLabel>
                </SynapseAppLauncherLabelCluster>
                <SynapseAppLauncherTileDividerRail variant="dotted" />
              </SynapseAppLauncherProductTile>
              <SynapseAppLauncherProductTile id="p2" name="Product Name 2" twoProductLayout>
                <SynapseAppLauncherLabelCluster>
                  <SynapseAppLauncherProductIcon />
                  <SynapseAppLauncherProductLabel>Product Name 2</SynapseAppLauncherProductLabel>
                </SynapseAppLauncherLabelCluster>
              </SynapseAppLauncherProductTile>
            </SynapseAppLauncherProductRow>
          </SynapseAppLauncherProductRowGroup>
        </SynapseAppLauncherProductRegion>
      </SynapseAppLauncherSurface>
    </SynapseAppLauncher>
  ),
};

export const NestedHierarchyThreeProduct: Story = {
  name: "Nested Hierarchy (3-product column divider)",
  render: () => (
    <SynapseAppLauncher products={products.slice(0, 3)} panelOnly>
      <SynapseAppLauncherSurface>
        <SynapseAppLauncherProductRegion>
          <SynapseAppLauncherProductRowGroup rowIndex={0}>
            <SynapseAppLauncherProductRow>
              <SynapseAppLauncherProductTile id="p1" name="Product Name 1" />
              <SynapseAppLauncherColumnDivider variant="dotted" />
              <SynapseAppLauncherProductTile id="p2" name="Product Name 2" />
            </SynapseAppLauncherProductRow>
          </SynapseAppLauncherProductRowGroup>
          <SynapseAppLauncherProductRowGroup rowIndex={1}>
            <SynapseAppLauncherRowDivider />
            <SynapseAppLauncherProductRow single>
              <SynapseAppLauncherProductTile id="p3" name="Product Name 3" />
            </SynapseAppLauncherProductRow>
          </SynapseAppLauncherProductRowGroup>
        </SynapseAppLauncherProductRegion>
      </SynapseAppLauncherSurface>
    </SynapseAppLauncher>
  ),
};

export const ComponentDetailMatrix: Story = {
  name: "Component Detail Matrix",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 16,
        alignItems: "start",
      }}
    >
      <SynapseAppLauncher products={products.slice(0, 1)} panelOnly />
      <SynapseAppLauncher products={products.slice(0, 2)} panelOnly />
      <SynapseAppLauncher products={products.slice(0, 3)} panelOnly />
      <SynapseAppLauncher products={products} panelOnly />
      <div style={{ gridColumn: "span 2" }}>
        <SynapseAppLauncher products={products} options={optionsList} panelOnly />
      </div>
    </div>
  ),
};

export const OptionTextOverflow: Story = {
  name: "Option Text Overflow",
  render: () => (
    <SynapseAppLauncher
      products={products.slice(0, 2)}
      options={[
        { id: "o1", label: "Option" },
        {
          id: "o2",
          label:
            "This is a very long option label that truncates with an ellipsis instead of wrapping",
        },
        { id: "o3", label: "Option" },
      ]}
      panelOnly
    />
  ),
};

export const TileStateMatrix: Story = {
  name: "Tile State Matrix",
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {(["default", "hover", "press", "focus", "no-icon"] as const).map((state) => (
        <SynapseAppLauncherProductTile
          key={state}
          name={state === "no-icon" ? "No icon" : "Product Name"}
          dataState={state}
          icon={state === "no-icon" ? null : undefined}
        />
      ))}
    </div>
  ),
};

export const DefaultTrigger: Story = {
  name: "Default Trigger",
  args: {
    products,
    triggerVariant: "default",
    defaultOpen: true,
  },
  render: (args) => (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
      <SynapseAppLauncher {...args} />
    </div>
  ),
};

export const NestedTriggerAndSurface: Story = {
  name: "Nested Trigger And Surface",
  render: () => (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
      <SynapseAppLauncher products={products.slice(0, 2)} defaultOpen>
        <SynapseAppLauncherTrigger />
        <SynapseAppLauncherSurface>
          <SynapseAppLauncherProductRegion />
        </SynapseAppLauncherSurface>
      </SynapseAppLauncher>
    </div>
  ),
};

export const OptionsWithFooter: Story = {
  name: "Options With Footer",
  render: () => (
    <SynapseAppLauncher
      products={products}
      options={optionsList}
      footerAction={{ label: "View all apps", onClick: () => undefined }}
      panelOnly
    />
  ),
};
