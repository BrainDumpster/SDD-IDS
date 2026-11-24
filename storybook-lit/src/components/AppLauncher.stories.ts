/**
 * Storybook: IDS Lit App Launcher from `lib/lit/ids/app-launcher`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/app-launcher/design-spec.md
 * API: lib/react/ids/app-launcher · storybook/src/components/lib-generated/AppLauncher.stories.tsx
 *
 * Live Figma verified 2026-11-10 (file `0bHk3XhrjFhowgFkz9yLr4`):
 *   usage products+options `42266:95081`; 4p `13231:123908`; 2p `13231:124200`;
 *   tile default `13231:109520`.
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/app-launcher/register.js";
import type {
  IdsAppLauncherOption,
  IdsAppLauncherProduct,
} from "@ids/core/app-launcher";
import {
  APP_LAUNCHER_DOCS_DESCRIPTION,
  APP_LAUNCHER_SOURCE_CODE,
} from "./ids-app-launcher.developer-usage";

const products: IdsAppLauncherProduct[] = [
  { id: "p1", name: "Product Name 1", shape: "shield-encrypt-alt" },
  { id: "p2", name: "Product Name 2", shape: "app-window" },
  { id: "p3", name: "Product Name 3", shape: "app-group-vm" },
  { id: "p4", name: "Product Name 4", shape: "appic-dp-cloud-blue" },
];

const optionsList: IdsAppLauncherOption[] = [
  { id: "o1", label: "Option" },
  { id: "o2", label: "Option" },
  { id: "o3", label: "Option" },
  { id: "o4", label: "Option" },
];

const mastheadFrame = (content: unknown) => html`
  <div
    style="display: flex; justify-content: flex-end; background: var(--color-background-masthead-base); min-height: 56px;"
  >
    ${content}
  </div>
`;

const meta: Meta = {
  title: "Spec Generated/IDS/App Launcher",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "shown" },
      description: { component: APP_LAUNCHER_DOCS_DESCRIPTION },
      source: { code: APP_LAUNCHER_SOURCE_CODE, language: "html" },
    },
  },
  args: {
    triggerVariant: "default",
    columns: 2,
    sideOffset: 8,
    useIdsOptionTooltip: false,
    panelOnly: false,
    products,
  },
  argTypes: {
    triggerVariant: { control: "radio", options: ["default", "masthead"] },
    panelOnly: { control: "boolean" },
    useIdsOptionTooltip: {
      control: "boolean",
      description:
        "Truncated option labels: false → native title; true → ids-tooltip.",
    },
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — masthead + 4 products + options (`42266:95081`). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    triggerVariant: "masthead",
    sideOffset: 0,
    defaultOpen: true,
    products,
    options: optionsList,
  },
  render: (args) =>
    mastheadFrame(html`
      <ids-app-launcher
        triggervariant=${args.triggerVariant as string}
        sideoffset=${args.sideOffset as number}
        ?defaultopen=${Boolean(args.defaultOpen)}
        .products=${args.products as IdsAppLauncherProduct[]}
        .options=${(args.options as IdsAppLauncherOption[]) ?? optionsList}
      ></ids-app-launcher>
    `),
};

export const LongNames: Story = {
  name: "Long Names",
  render: () => html`
    <ids-app-launcher
      panelonly
      .products=${[
        { id: "ln1", name: "Short label", icon: null },
        {
          id: "ln2",
          name: "Text-only tile with a two-line name",
          icon: null,
        },
        {
          id: "ln3",
          name: "A very long text-only product name that cannot fit within three lines so it becomes a full-width rectangle tile",
          icon: null,
        },
        {
          id: "ln4",
          name: "Icon tile whose name is far too long to fit on a single line",
        },
        { id: "ln5", name: "Product Name 5" },
        { id: "ln6", name: "Product Name 6" },
      ] as IdsAppLauncherProduct[]}
    ></ids-app-launcher>
  `,
};

export const ComponentDetailMatrix: Story = {
  name: "Component Detail Matrix",
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: start;"
    >
      <ids-app-launcher
        panelonly
        .products=${products.slice(0, 1)}
      ></ids-app-launcher>
      <ids-app-launcher
        panelonly
        .products=${products.slice(0, 2)}
      ></ids-app-launcher>
      <ids-app-launcher
        panelonly
        .products=${products.slice(0, 3)}
      ></ids-app-launcher>
      <ids-app-launcher panelonly .products=${products}></ids-app-launcher>
      <div style="grid-column: span 2">
        <ids-app-launcher
          panelonly
          .products=${products}
          .options=${optionsList}
        ></ids-app-launcher>
      </div>
    </div>
  `,
};

export const OptionTextOverflow: Story = {
  name: "Option Text Overflow",
  render: () => html`
    <ids-app-launcher
      panelonly
      useidsoptiontooltip
      .products=${products}
      .options=${[
        { id: "o1", label: "Option" },
        {
          id: "o2",
          label:
            "This is a very long option label that truncates with an ellipsis instead of wrapping",
        },
        { id: "o3", label: "Option" },
        { id: "o4", label: "Option" },
        { id: "o5", label: "Option" },
        { id: "o6", label: "Option" },
      ] as IdsAppLauncherOption[]}
    ></ids-app-launcher>
  `,
};

export const TileStateMatrix: Story = {
  name: "Tile State Matrix",
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      ${(["default", "hover", "press", "focus", "no-icon"] as const).map(
        (state) => html`
          <ids-app-launcher-product-tile
            name=${state === "no-icon" ? "No icon" : "Product Name"}
            datastate=${state}
            ?omiticon=${state === "no-icon"}
          ></ids-app-launcher-product-tile>
        `,
      )}
    </div>
  `,
};

export const DefaultTrigger: Story = {
  name: "Default Trigger",
  args: {
    products,
    triggerVariant: "default",
    defaultOpen: true,
  },
  render: (args) => html`
    <div style="display: flex; justify-content: flex-end; padding: 16px;">
      <ids-app-launcher
        triggervariant=${args.triggerVariant as string}
        ?defaultopen=${Boolean(args.defaultOpen)}
        .products=${args.products as IdsAppLauncherProduct[]}
      ></ids-app-launcher>
    </div>
  `,
};

export const OptionsWithFooter: Story = {
  name: "Options With Footer",
  render: () => html`
    <ids-app-launcher
      panelonly
      .products=${products}
      .options=${optionsList}
      .footerAction=${{ label: "View all apps" }}
    ></ids-app-launcher>
  `,
};

/** Per-tile icon shapes via `shape` (or `iconSlug`). Option rows have no leading icon. */
export const PerItemIconShapes: Story = {
  name: "Per Item Icon Shapes",
  render: () => html`
    <ids-app-launcher
      panelonly
      .products=${[
        { id: "p1", name: "Protect", shape: "shield-encrypt-alt" },
        { id: "p2", name: "Apps", shape: "app-window" },
        { id: "p3", name: "VMs", shape: "app-group-vm" },
        { id: "p4", name: "Cloud", shape: "appic-dp-cloud-blue" },
      ] as IdsAppLauncherProduct[]}
      .options=${[
        { id: "o1", label: "Directory" },
        { id: "o2", label: "Alerts" },
        { id: "o3", label: "Settings" },
      ] as IdsAppLauncherOption[]}
    ></ids-app-launcher>
  `,
};
