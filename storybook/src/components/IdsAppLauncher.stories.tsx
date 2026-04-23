import type { Meta, StoryObj } from "@storybook/react";
import { AppLauncher } from "./AppLauncher";

const meta: Meta<typeof AppLauncher> = {
  title: "IDS/App Launcher",
  component: AppLauncher,
  args: {
    triggerVariant: "masthead",
    sideOffset: 0,
    columns: 2,
  },
};

export default meta;
type Story = StoryObj<typeof AppLauncher>;

export const UsageMastheadAttached: Story = {
  args: {
    products: [
      { id: "p1", name: "Product Name 1", href: "#" },
      { id: "p2", name: "Product Name 2", href: "#" },
      { id: "p3", name: "Product Name 3", href: "#" },
      { id: "p4", name: "Product Name 4", href: "#" },
    ],
    options: [
      { id: "o1", label: "Option" },
      { id: "o2", label: "Option" },
      { id: "o3", label: "Option" },
      { id: "o4", label: "Option" },
    ],
  },
};

export const ComponentDetailMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12 }}>1 Product</div>
        <AppLauncher products={[{ id: "p1", name: "Product Name 1", href: "#" }]} />
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12 }}>2 Products</div>
        <AppLauncher
          products={[
            { id: "p1", name: "Product Name 1", href: "#" },
            { id: "p2", name: "Product Name 2", href: "#" },
          ]}
        />
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12 }}>3 Products</div>
        <AppLauncher
          products={[
            { id: "p1", name: "Product Name 1", href: "#" },
            { id: "p2", name: "Product Name 2", href: "#" },
            { id: "p3", name: "Product Name 3", href: "#" },
          ]}
        />
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12 }}>4 Products</div>
        <AppLauncher
          products={[
            { id: "p1", name: "Product Name 1", href: "#" },
            { id: "p2", name: "Product Name 2", href: "#" },
            { id: "p3", name: "Product Name 3", href: "#" },
            { id: "p4", name: "Product Name 4", href: "#" },
          ]}
        />
      </div>
      <div style={{ gridColumn: "span 2" }}>
        <div style={{ marginBottom: 8, fontSize: 12 }}>8 Products + Options</div>
        <AppLauncher
          products={[
            { id: "p1", name: "Product Name 1", href: "#" },
            { id: "p2", name: "Product Name 2", href: "#" },
            { id: "p3", name: "Product Name 3", href: "#" },
            { id: "p4", name: "Product Name 4", href: "#" },
            { id: "p5", name: "Product Name 5", href: "#" },
            { id: "p6", name: "Product Name 6", href: "#" },
            { id: "p7", name: "Product Name 7", href: "#" },
            { id: "p8", name: "Product Name 8", href: "#" },
          ]}
          options={[
            { id: "o1", label: "Option" },
            { id: "o2", label: "Option" },
            { id: "o3", label: "Option" },
            { id: "o4", label: "Option" },
          ]}
        />
      </div>
    </div>
  ),
};

export const ElementStatesReference: Story = {
  args: {
    products: [
      { id: "default", name: "Product Name", href: "#" },
      { id: "hover", name: "Product Name", href: "#" },
      { id: "press", name: "Product Name", href: "#" },
      { id: "no-icon", name: "Product Name", href: "#", icon: null },
    ],
    triggerVariant: "default",
    sideOffset: 8,
  },
};
