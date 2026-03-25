import type { Meta, StoryObj } from "@storybook/react";
import { LeftNav } from "./LeftNav";

const meta: Meta<typeof LeftNav> = {
  title: "Synapse/LeftNav",
  component: LeftNav,
  argTypes: {
    collapsed: { control: "boolean" },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof LeftNav>;

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8L8 2L14 8V14H10V10H6V14H2V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="8" width="3" height="6" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6.5" y="4" width="3" height="10" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="3" height="12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1V3M8 13V15M1 8H3M13 8H15M3 3L4.5 4.5M11.5 11.5L13 13M3 13L4.5 11.5M11.5 4.5L13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 2H10L13 5V14H4V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 2V5H13" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 14C2 11.5 4.5 10 8 10C11.5 10 14 11.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const groups = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/", icon: <HomeIcon />, active: true },
      { label: "Analytics", href: "/analytics", icon: <ChartIcon /> },
      { label: "Reports", href: "/reports", icon: <FileIcon /> },
    ],
  },
  {
    title: "Management",
    collapsible: true,
    items: [
      { label: "Users", href: "/users", icon: <UserIcon /> },
      { label: "Settings", href: "/settings", icon: <GearIcon /> },
    ],
  },
];

export const Expanded: Story = {
  args: {
    groups,
    collapsed: false,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, display: "flex" }}>
        <Story />
        <div style={{ flex: 1, padding: 16, color: "var(--color-text-neutral)" }}>
          Page content area
        </div>
      </div>
    ),
  ],
};

export const CollapsedRail: Story = {
  args: {
    groups,
    collapsed: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, display: "flex" }}>
        <Story />
        <div style={{ flex: 1, padding: 16, color: "var(--color-text-neutral)" }}>
          Page content area
        </div>
      </div>
    ),
  ],
};
