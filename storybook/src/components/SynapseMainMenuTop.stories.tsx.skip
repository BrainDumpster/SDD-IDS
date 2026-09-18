/* Components — Synapse Main Menu Top (IDS-fork) */
import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React, { type ComponentProps } from "react";
import {
  MainMenuTop,
  MainMenuTopItem,
  MainMenuTopMenu,
  MainMenuTopMenuGroup,
  MainMenuTopMenuItem,
  MainMenuTopSubmenu,
  type MainMenuTopSelectDetail,
} from "./MainMenuTop";
import {
  SYNAPSE_MAIN_MENU_TOP_DESIGN_SPEC_PATH,
  SYNAPSE_MAIN_MENU_TOP_DROPDOWN_SAMPLE_NODE_ID,
  SYNAPSE_MAIN_MENU_TOP_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_MAIN_MENU_TOP_MAIN_NODE_ID,
  SYNAPSE_MAIN_MENU_TOP_MASTHEAD_USAGE_NODE_ID,
} from "../spec-contracts/synapse-main-menu-top.contract";

const onMenuItemSelect = (detail: MainMenuTopSelectDetail) => {
  console.log("onMenuItemSelect", detail);
};

const specAccurateItems = Array.from({ length: 8 }, (_, i) => ({
  id: `top-${i + 1}`,
  name: "Menu Option",
  iconName: "home",
  dropdown: true,
}));

const specAccurateArgs: ComponentProps<typeof MainMenuTop> = {
  items: specAccurateItems,
  defaultSelectedId: "top-2",
  size: "Large",
  onMenuItemSelect,
};

const storageMenuOptions = [
  { id: "containers", label: "Storage Containers" },
  { id: "volumes", label: "Volumes" },
  {
    id: "nested",
    label: "Option",
    kind: "submenu" as const,
    children: [
      { id: "sub-a", label: "Sub Option A" },
      { id: "sub-b", label: "Sub Option B" },
    ],
  },
  { id: "pools", label: "Pools" },
  { id: "tiers", label: "Tiers" },
];

const jobsMenuOptions = [
  { id: "running", label: "Running" },
  { id: "scheduled", label: "Scheduled" },
  {
    id: "nested",
    label: "Option",
    kind: "submenu" as const,
    children: [
      { id: "sub-a", label: "Sub Option A" },
      { id: "sub-b", label: "Sub Option B" },
    ],
  },
  { id: "history", label: "History" },
];

const meta: Meta<typeof MainMenuTop> = {
  title: "Components/Synapse/Main Menu Top",
  component: MainMenuTop,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Main Menu Top (IDS-fork). Source: \`${SYNAPSE_MAIN_MENU_TOP_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_MAIN_MENU_TOP_IDS_BASELINE_SPEC_PATH}\`.`,
          `Primary story: Figma \`${SYNAPSE_MAIN_MENU_TOP_MAIN_NODE_ID}\` (same assembly node as IDS).`,
          `Programme deltas: hover/menu-open keep neutral-strong text/icon; dropdown menus use Synapse \`--dropdown-menu-radius\` (sample \`${SYNAPSE_MAIN_MENU_TOP_DROPDOWN_SAMPLE_NODE_ID}\`).`,
          `Masthead composition reference: \`${SYNAPSE_MAIN_MENU_TOP_MASTHEAD_USAGE_NODE_ID}\`.`,
          "Theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof MainMenuTop>;

function Frame(props: ComponentProps<typeof MainMenuTop> & { maxWidth?: number }) {
  const { maxWidth = 1496, ...rest } = props;
  return (
    <div
      style={{
        padding: 16,
        background: "var(--color-background-surface-1)",
        width: "100%",
        maxWidth,
        marginLeft: maxWidth < 1496 ? "auto" : undefined,
      }}
    >
      <MainMenuTop onMenuItemSelect={onMenuItemSelect} {...rest} />
    </div>
  );
}

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: [
          `Figma \`${SYNAPSE_MAIN_MENU_TOP_MAIN_NODE_ID}\`: eight Large items,`,
          "`Menu Option` + `home` + chevron (`dropdown: true`, no `menuOptions`).",
          "Second item selected (`defaultSelectedId: top-2`). Hover uses neutral-strong label (Synapse delta).",
        ].join(" "),
      },
    },
  },
  render: (args) => (
    <div
      style={{
        width: "100%",
        maxWidth: 1496,
        padding: 16,
        background: "var(--color-background-surface-1)",
        boxSizing: "border-box",
      }}
    >
      <MainMenuTop onMenuItemSelect={onMenuItemSelect} {...args} />
    </div>
  ),
  args: specAccurateArgs,
};

export const DropdownNotSelected: Story = {
  name: "Dropdown Not Selected",
  render: () => (
    <Frame
      items={[
        { id: "dash", name: "Dashboard", iconName: "dashboard", dropdown: true },
        {
          id: "storage",
          name: "Storage",
          iconName: "storage-volume",
          dropdown: true,
          menuOptions: storageMenuOptions,
        },
        { id: "recovery", name: "Recovery", iconName: "arrows-spin", dropdown: true },
      ]}
    />
  ),
};

export const DropdownSelectedOpen: Story = {
  name: "Dropdown Selected Open",
  render: () => (
    <Frame
      items={[
        { id: "dash", name: "Dashboard", iconName: "dashboard", dropdown: true },
        {
          id: "storage",
          name: "Storage",
          iconName: "storage-volume",
          dropdown: true,
          menuOptions: storageMenuOptions,
        },
        { id: "recovery", name: "Recovery", iconName: "arrows-spin", dropdown: true },
      ]}
    />
  ),
};

export const SubmenuOpensRight: Story = {
  name: "Submenu Opens Right",
  render: () => (
    <Frame
      items={[
        { id: "dash", name: "Dashboard", iconName: "dashboard" },
        {
          id: "storage",
          name: "Storage",
          iconName: "storage-volume",
          dropdown: true,
          menuOptions: storageMenuOptions,
        },
        { id: "jobs", name: "Jobs", iconName: "time-detail", dropdown: true },
      ]}
    />
  ),
};

export const SubmenuOpensLeft: Story = {
  name: "Submenu Opens Left",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
      <Frame
        maxWidth={720}
        items={[
          { id: "dash", name: "Dashboard", iconName: "dashboard" },
          { id: "reports", name: "Reports", iconName: "chart-lines" },
          {
            id: "jobs",
            name: "Jobs",
            iconName: "time-detail",
            dropdown: true,
            menuOptions: jobsMenuOptions,
          },
        ]}
      />
    </div>
  ),
};

export const ComposableStructure: Story = {
  name: "Composable Structure",
  render: () => (
    <Frame>
      <MainMenuTop onMenuItemSelect={onMenuItemSelect}>
        <MainMenuTopItem id="dash" name="Dashboard" iconName="dashboard" />
        <MainMenuTopItem id="storage" name="Storage" iconName="storage-volume" dropdown>
          <MainMenuTopMenu>
            <MainMenuTopMenuItem id="containers" label="Storage Containers" />
            <MainMenuTopMenuGroup label="Management">
              <MainMenuTopMenuItem id="volumes" label="Volumes" />
              <MainMenuTopSubmenu id="nested" label="Option">
                <MainMenuTopMenuItem id="sub-a" label="Sub Option A" />
                <MainMenuTopMenuItem id="sub-b" label="Sub Option B" />
              </MainMenuTopSubmenu>
            </MainMenuTopMenuGroup>
            <MainMenuTopMenuItem id="pools" label="Pools" />
          </MainMenuTopMenu>
        </MainMenuTopItem>
        <MainMenuTopItem id="jobs" name="Jobs" iconName="time-detail" dropdown>
          <MainMenuTopMenu>
            <MainMenuTopMenuItem id="running" label="Running" />
            <MainMenuTopSubmenu id="nested" label="Option">
              <MainMenuTopMenuItem id="sub-a" label="Sub Option A" />
            </MainMenuTopSubmenu>
          </MainMenuTopMenu>
        </MainMenuTopItem>
      </MainMenuTop>
    </Frame>
  ),
};

export const SmallSize: Story = {
  name: "Small Size",
  render: () => (
    <Frame
      items={specAccurateItems.slice(0, 4)}
      defaultSelectedId="top-2"
      size="Small"
    />
  ),
};

export const WithoutDropdown: Story = {
  name: "Without Dropdown",
  render: () => (
    <Frame
      items={specAccurateItems.slice(0, 4).map((item) => ({ ...item, dropdown: false }))}
      defaultSelectedId="top-1"
    />
  ),
};

export const DarkTheme: Story = {
  name: "Dark Theme",
  render: () => (
    <div data-theme="dark" style={{ padding: 16, background: "var(--color-background-surface-1)" }}>
      <Frame
        items={[
          { id: "dash", name: "Dashboard", iconName: "dashboard" },
          {
            id: "storage",
            name: "Storage",
            iconName: "storage-volume",
            dropdown: true,
            menuOptions: storageMenuOptions,
          },
          { id: "jobs", name: "Jobs", iconName: "time-detail", dropdown: true },
        ]}
      />
    </div>
  ),
};
