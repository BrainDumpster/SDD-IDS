/**
 * Storybook: IDS Lit Main Menu Top from `lib/lit/ids/main-menu-top`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/main-menu-top/design-spec.md
 * API: storybook/src/components/MainMenuTop*.tsx
 *      (`lib/react/ids/main-menu-top` is not present — used Storybook React + design-spec)
 * Examples: storybook-generated/ids/src/components/MainMenuTop.stories.tsx
 *
 * Live Figma: 0bHk3XhrjFhowgFkz9yLr4 — Main `10189:30280`, Element `11099:56576`,
 * Use cases `42136:57443` (MCP verified 2026-11-13)
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "@ids/core/main-menu-top/register.js";
import {
  MAIN_MENU_TOP_SPEC_DEMO_ITEMS,
  type MainMenuTopItem,
  type MainMenuTopSelectDetail,
  type MainMenuTopSize,
} from "@ids/core/main-menu-top";
import {
  MAIN_MENU_TOP_COMPOSABLE_SOURCE_CODE,
  MAIN_MENU_TOP_DARK_SOURCE_CODE,
  MAIN_MENU_TOP_DOCS_DESCRIPTION,
  MAIN_MENU_TOP_DROPDOWN_SOURCE_CODE,
  MAIN_MENU_TOP_SMALL_SOURCE_CODE,
  MAIN_MENU_TOP_SOURCE_CODE,
  MAIN_MENU_TOP_SUBMENU_LEFT_SOURCE_CODE,
  MAIN_MENU_TOP_SUBMENU_RIGHT_SOURCE_CODE,
  MAIN_MENU_TOP_WITHOUT_DROPDOWN_SOURCE_CODE,
} from "./ids-main-menu-top.developer-usage";

const DESIGN_SPEC_PATH = "components/ids/main-menu-top/design-spec.md";
const FIGMA_SPEC_ACCURATE_NODE = "10189:30280";

type MainMenuTopStoryArgs = {
  items: MainMenuTopItem[];
  selectedId?: string;
  defaultSelectedId?: string;
  size: MainMenuTopSize;
  ariaLabel: string;
  onMenuItemSelect?: (detail: MainMenuTopSelectDetail) => void;
};

const storageMenuOptions: NonNullable<MainMenuTopItem["menuOptions"]> = [
  { id: "containers", label: "Storage Containers" },
  { id: "volumes", label: "Volumes" },
  {
    id: "nested",
    label: "Option",
    kind: "submenu",
    children: [
      { id: "sub-a", label: "Sub Option A" },
      { id: "sub-b", label: "Sub Option B" },
    ],
  },
  { id: "pools", label: "Pools" },
  { id: "tiers", label: "Tiers" },
];

const jobsMenuOptions: NonNullable<MainMenuTopItem["menuOptions"]> = [
  { id: "running", label: "Running" },
  { id: "scheduled", label: "Scheduled" },
  {
    id: "nested",
    label: "Option",
    kind: "submenu",
    children: [
      { id: "sub-a", label: "Sub Option A" },
      { id: "sub-b", label: "Sub Option B" },
    ],
  },
  { id: "history", label: "History" },
];

function storySource(code: string) {
  return { docs: { source: { code, language: "html" as const } } };
}

const meta: Meta<MainMenuTopStoryArgs> = {
  title: "Spec Generated/IDS/Main Menu Top",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "shown" },
      description: {
        component: [
          MAIN_MENU_TOP_DOCS_DESCRIPTION,
          `Source: \`${DESIGN_SPEC_PATH}\`.`,
        ].join("\n\n"),
      },
    },
  },
  argTypes: {
    items: { control: "object" },
    selectedId: { control: "text" },
    defaultSelectedId: { control: "text" },
    size: { control: "select", options: ["Large", "Small"] },
    ariaLabel: { control: "text" },
    onMenuItemSelect: {
      action: "onMenuItemSelect",
      description:
        "(detail: MainMenuTopSelectDetail) => void — also fires ids-menu-item-select",
    },
  },
  args: {
    items: [...MAIN_MENU_TOP_SPEC_DEMO_ITEMS],
    defaultSelectedId: "top-2",
    size: "Large",
    ariaLabel: "Main menu top",
  },
};

export default meta;
type Story = StoryObj<MainMenuTopStoryArgs>;

function frameStyle(maxWidth = 1496): string {
  return `
    width: 100%;
    max-width: ${maxWidth}px;
    padding: 16px;
    background: var(--color-background-surface-primary);
    box-sizing: border-box;
  `;
}

function renderMenu(args: MainMenuTopStoryArgs, maxWidth = 1496) {
  return html`
    <div style=${frameStyle(maxWidth)}>
      <ids-main-menu-top
        arialabel=${args.ariaLabel}
        size=${args.size}
        defaultselectedid=${args.defaultSelectedId || nothing}
        selectedid=${args.selectedId || nothing}
        .items=${args.items}
        .onMenuItemSelect=${args.onMenuItemSelect}
      ></ids-main-menu-top>
    </div>
  `;
}

/** Figma `10189:30280` — eight Large items, second selected, chevron affordance only. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  parameters: {
    layout: "fullscreen",
    docs: {
      source: { code: MAIN_MENU_TOP_SOURCE_CODE, language: "html" },
      description: {
        story: [
          `Figma \`${FIGMA_SPEC_ACCURATE_NODE}\` (MainMenu-Top-Main): eight Large items,`,
          "`Menu Option` + `home` icon + chevron affordance (`dropdown: true`, no `menuOptions`).",
          "Second item selected (`defaultSelectedId: top-2`) — underline only (no flyout in this frame).",
        ].join(" "),
      },
    },
  },
  render: (args) => renderMenu(args),
};

/** Figma `42136:57463` — open Storage menu without top underline until option select. */
export const DropdownNotSelected: Story = {
  name: "Dropdown Not Selected",
  parameters: storySource(MAIN_MENU_TOP_DROPDOWN_SOURCE_CODE),
  render: (args) =>
    renderMenu({
      ...args,
      defaultSelectedId: undefined,
      items: [
        { id: "dash", name: "Dashboard", iconName: "dashboard", dropdown: true },
        {
          id: "storage",
          name: "Storage",
          iconName: "storage-volume",
          dropdown: true,
          menuOptions: storageMenuOptions,
        },
        {
          id: "recovery",
          name: "Recovery",
          iconName: "arrows-spin",
          dropdown: true,
        },
      ],
    }),
};

/** Figma `42136:57467` — Storage with functional menu. */
export const DropdownSelectedOpen: Story = {
  name: "Dropdown Selected Open",
  parameters: storySource(MAIN_MENU_TOP_DROPDOWN_SOURCE_CODE),
  render: (args) =>
    renderMenu({
      ...args,
      defaultSelectedId: undefined,
      items: [
        { id: "dash", name: "Dashboard", iconName: "dashboard", dropdown: true },
        {
          id: "storage",
          name: "Storage",
          iconName: "storage-volume",
          dropdown: true,
          menuOptions: storageMenuOptions,
        },
        {
          id: "recovery",
          name: "Recovery",
          iconName: "arrows-spin",
          dropdown: true,
        },
      ],
    }),
};

/** Figma `42136:57503` — submenu prefers opens-right. */
export const SubmenuOpensRight: Story = {
  name: "Submenu Opens Right",
  parameters: storySource(MAIN_MENU_TOP_SUBMENU_RIGHT_SOURCE_CODE),
  render: (args) =>
    renderMenu({
      ...args,
      defaultSelectedId: undefined,
      items: [
        { id: "dash", name: "Dashboard", iconName: "dashboard" },
        {
          id: "storage",
          name: "Storage",
          iconName: "storage-volume",
          dropdown: true,
          menuOptions: storageMenuOptions,
        },
        { id: "jobs", name: "Jobs", iconName: "time-detail", dropdown: true },
      ],
    }),
};

/** Figma `42136:57471` — right-edge Jobs menu; submenu flips left. */
export const SubmenuOpensLeft: Story = {
  name: "Submenu Opens Left",
  parameters: {
    layout: "fullscreen",
    ...storySource(MAIN_MENU_TOP_SUBMENU_LEFT_SOURCE_CODE),
  },
  render: (args) => html`
    <div style="display:flex;justify-content:flex-end;padding:16px;">
      ${renderMenu(
        {
          ...args,
          defaultSelectedId: undefined,
          items: [
            { id: "dash", name: "Dashboard", iconName: "dashboard" },
            { id: "reports", name: "Reports", iconName: "chart-lines" },
            {
              id: "jobs",
              name: "Jobs",
              iconName: "time-detail",
              dropdown: true,
              menuOptions: jobsMenuOptions,
            },
          ],
        },
        720,
      )}
    </div>
  `,
};

/** Mode B: Tree-style nested child components (no `.items` array). */
export const ComposableStructure: Story = {
  name: "Composable Structure",
  parameters: storySource(MAIN_MENU_TOP_COMPOSABLE_SOURCE_CODE),
  render: (args) => html`
    <div style=${frameStyle()}>
      <ids-main-menu-top
        arialabel=${args.ariaLabel}
        size=${args.size}
        .onMenuItemSelect=${args.onMenuItemSelect}
      >
        <ids-main-menu-top-item
          id="dash"
          name="Dashboard"
          icon-name="dashboard"
        ></ids-main-menu-top-item>
        <ids-main-menu-top-item
          id="storage"
          name="Storage"
          icon-name="storage-volume"
          dropdown
        >
          <ids-main-menu-top-menu>
            <ids-main-menu-top-menu-item
              id="containers"
              label="Storage Containers"
            ></ids-main-menu-top-menu-item>
            <ids-main-menu-top-menu-group label="Management">
              <ids-main-menu-top-menu-item
                id="volumes"
                label="Volumes"
              ></ids-main-menu-top-menu-item>
              <ids-main-menu-top-submenu id="nested" label="Option">
                <ids-main-menu-top-menu-item
                  id="sub-a"
                  label="Sub Option A"
                ></ids-main-menu-top-menu-item>
                <ids-main-menu-top-menu-item
                  id="sub-b"
                  label="Sub Option B"
                ></ids-main-menu-top-menu-item>
              </ids-main-menu-top-submenu>
            </ids-main-menu-top-menu-group>
            <ids-main-menu-top-menu-item
              id="pools"
              label="Pools"
            ></ids-main-menu-top-menu-item>
          </ids-main-menu-top-menu>
        </ids-main-menu-top-item>
        <ids-main-menu-top-item
          id="jobs"
          name="Jobs"
          icon-name="time-detail"
          dropdown
        >
          <ids-main-menu-top-menu>
            <ids-main-menu-top-menu-item
              id="running"
              label="Running"
            ></ids-main-menu-top-menu-item>
            <ids-main-menu-top-submenu id="nested" label="Option">
              <ids-main-menu-top-menu-item
                id="sub-a"
                label="Sub Option A"
              ></ids-main-menu-top-menu-item>
            </ids-main-menu-top-submenu>
          </ids-main-menu-top-menu>
        </ids-main-menu-top-item>
      </ids-main-menu-top>
    </div>
  `,
};

export const SmallSize: Story = {
  name: "Small Size",
  parameters: storySource(MAIN_MENU_TOP_SMALL_SOURCE_CODE),
  render: (args) =>
    renderMenu({
      ...args,
      size: "Small",
      defaultSelectedId: "top-2",
      items: MAIN_MENU_TOP_SPEC_DEMO_ITEMS.slice(0, 4),
    }),
};

export const WithoutDropdown: Story = {
  name: "Without Dropdown",
  parameters: storySource(MAIN_MENU_TOP_WITHOUT_DROPDOWN_SOURCE_CODE),
  render: (args) =>
    renderMenu({
      ...args,
      defaultSelectedId: "top-1",
      items: MAIN_MENU_TOP_SPEC_DEMO_ITEMS.slice(0, 4).map((item) => ({
        ...item,
        dropdown: false,
      })),
    }),
};

export const DarkTheme: Story = {
  name: "Dark Theme",
  parameters: storySource(MAIN_MENU_TOP_DARK_SOURCE_CODE),
  render: (args) => html`
    <div
      data-theme="dark"
      style="padding:16px;background:var(--color-background-surface-primary);"
    >
      ${renderMenu({
        ...args,
        defaultSelectedId: undefined,
        items: [
          { id: "dash", name: "Dashboard", iconName: "dashboard" },
          {
            id: "storage",
            name: "Storage",
            iconName: "storage-volume",
            dropdown: true,
            menuOptions: storageMenuOptions,
          },
          { id: "jobs", name: "Jobs", iconName: "time-detail", dropdown: true },
        ],
      })}
    </div>
  `,
};
