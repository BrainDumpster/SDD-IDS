/**
 * Storybook: design-spec–generated App Launcher from `lib/react/ids/app-launcher`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy (deterministic child order — root is AppLauncher, not AppLauncherRoot):
 *   IdsAppLauncher (AppLauncher)
 *     IdsAppLauncherTrigger
 *     IdsAppLauncherSurface
 *       IdsAppLauncherProductRegion
 *         IdsAppLauncherProductRowGroup[]
 *           IdsAppLauncherRowDivider?
 *           IdsAppLauncherProductRow
 *             IdsAppLauncherColumnDivider?   (productCount ≥ 3)
 *             IdsAppLauncherProductTile
 *               IdsAppLauncherLabelCluster
 *                 IdsAppLauncherProductIcon?
 *                 IdsAppLauncherProductLabel
 *               IdsAppLauncherTileDividerRail?  (2 products, leading tile)
 *       IdsAppLauncherOptionsRegion?
 *         IdsAppLauncherOptionRow[]
 *         IdsAppLauncherFooterAction?
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/app-launcher/design-spec.md
 */
import React, { type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsAppLauncher,
  IdsAppLauncherColumnDivider,
  IdsAppLauncherLabelCluster,
  IdsAppLauncherOptionsRegion,
  IdsAppLauncherProductIcon,
  IdsAppLauncherProductLabel,
  IdsAppLauncherProductRegion,
  IdsAppLauncherProductRow,
  IdsAppLauncherProductRowGroup,
  IdsAppLauncherProductTile,
  IdsAppLauncherRowDivider,
  IdsAppLauncherSurface,
  IdsAppLauncherTileDividerRail,
  IdsAppLauncherTrigger,
  type IdsAppLauncherOption,
  type IdsAppLauncherProduct,
  type IdsAppLauncherProps,
} from "../../../../lib/react/ids/app-launcher";

const DESIGN_SPEC_PATH = "components/ids/app-launcher/design-spec.md";

const products: IdsAppLauncherProduct[] = [
  { id: "p1", name: "Product Name 1" },
  { id: "p2", name: "Product Name 2" },
  { id: "p3", name: "Product Name 3" },
  { id: "p4", name: "Product Name 4" },
];

const optionsList: IdsAppLauncherOption[] = [
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

const meta: Meta<IdsAppLauncherProps> = {
  title: "Lib Generated/IDS/App Launcher",
  component: IdsAppLauncher,
  parameters: {
    docs: {
      description: {
        component:
          `React IDS App Launcher from \`${DESIGN_SPEC_PATH}\`. ` +
          "Root is `AppLauncher` (`IdsAppLauncher`) — not `AppLauncherRoot`. " +
          "Deterministic anatomy: Trigger → Surface → ProductRegion → ProductRowGroup → " +
          "RowDivider? → ProductRow → ColumnDivider? → ProductTile → LabelCluster → " +
          "OptionsRegion?. Theme: `components/ids-theme.css`. No `@base-ui-components`.",
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
type Story = StoryObj<IdsAppLauncherProps>;

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
      <IdsAppLauncher {...args} />
    </div>
  ),
};

/** Explicit Anatomy slots in Codegen Contract order (same tree the prop API emits). */
export const DeterministicAnatomy: Story = {
  name: "Deterministic Anatomy",
  render: () => (
    <IdsAppLauncher products={products} options={optionsList} panelOnly>
      <IdsAppLauncherSurface>
        <IdsAppLauncherProductRegion />
        <IdsAppLauncherOptionsRegion />
      </IdsAppLauncherSurface>
    </IdsAppLauncher>
  ),
};

export const NestedHierarchyTwoProduct: Story = {
  name: "Nested Hierarchy (2-product rail)",
  render: () => (
    <IdsAppLauncher products={products.slice(0, 2)} panelOnly>
      <IdsAppLauncherSurface>
        <IdsAppLauncherProductRegion>
          <IdsAppLauncherProductRowGroup rowIndex={0}>
            <IdsAppLauncherProductRow>
              <IdsAppLauncherProductTile
                id="p1"
                name="Product Name 1"
                twoProductLayout
                tileDivider="dotted"
              >
                <IdsAppLauncherLabelCluster>
                  <IdsAppLauncherProductIcon />
                  <IdsAppLauncherProductLabel>Product Name 1</IdsAppLauncherProductLabel>
                </IdsAppLauncherLabelCluster>
                <IdsAppLauncherTileDividerRail variant="dotted" />
              </IdsAppLauncherProductTile>
              <IdsAppLauncherProductTile id="p2" name="Product Name 2" twoProductLayout>
                <IdsAppLauncherLabelCluster>
                  <IdsAppLauncherProductIcon />
                  <IdsAppLauncherProductLabel>Product Name 2</IdsAppLauncherProductLabel>
                </IdsAppLauncherLabelCluster>
              </IdsAppLauncherProductTile>
            </IdsAppLauncherProductRow>
          </IdsAppLauncherProductRowGroup>
        </IdsAppLauncherProductRegion>
      </IdsAppLauncherSurface>
    </IdsAppLauncher>
  ),
};

export const NestedHierarchyThreeProduct: Story = {
  name: "Nested Hierarchy (3-product column divider)",
  render: () => (
    <IdsAppLauncher products={products.slice(0, 3)} panelOnly>
      <IdsAppLauncherSurface>
        <IdsAppLauncherProductRegion>
          <IdsAppLauncherProductRowGroup rowIndex={0}>
            <IdsAppLauncherProductRow>
              <IdsAppLauncherProductTile id="p1" name="Product Name 1" />
              <IdsAppLauncherColumnDivider variant="dotted" />
              <IdsAppLauncherProductTile id="p2" name="Product Name 2" />
            </IdsAppLauncherProductRow>
          </IdsAppLauncherProductRowGroup>
          <IdsAppLauncherProductRowGroup rowIndex={1}>
            <IdsAppLauncherRowDivider />
            <IdsAppLauncherProductRow single>
              <IdsAppLauncherProductTile id="p3" name="Product Name 3" />
            </IdsAppLauncherProductRow>
          </IdsAppLauncherProductRowGroup>
        </IdsAppLauncherProductRegion>
      </IdsAppLauncherSurface>
    </IdsAppLauncher>
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
      <IdsAppLauncher products={products.slice(0, 1)} panelOnly />
      <IdsAppLauncher products={products.slice(0, 2)} panelOnly />
      <IdsAppLauncher products={products.slice(0, 3)} panelOnly />
      <IdsAppLauncher products={products} panelOnly />
      <div style={{ gridColumn: "span 2" }}>
        <IdsAppLauncher products={products} options={optionsList} panelOnly />
      </div>
    </div>
  ),
};

export const OptionTextOverflow: Story = {
  name: "Option Text Overflow",
  render: () => (
    <IdsAppLauncher
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
        <IdsAppLauncherProductTile
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
      <IdsAppLauncher {...args} />
    </div>
  ),
};

export const NestedTriggerAndSurface: Story = {
  name: "Nested Trigger And Surface",
  render: () => (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
      <IdsAppLauncher products={products.slice(0, 2)} defaultOpen>
        <IdsAppLauncherTrigger />
        <IdsAppLauncherSurface>
          <IdsAppLauncherProductRegion />
        </IdsAppLauncherSurface>
      </IdsAppLauncher>
    </div>
  ),
};

export const OptionsWithFooter: Story = {
  name: "Options With Footer",
  render: () => (
    <IdsAppLauncher
      products={products}
      options={optionsList}
      footerAction={{ label: "View all apps", onClick: () => undefined }}
      panelOnly
    />
  ),
};
