import type { Meta, StoryObj } from "@storybook/react";
import { MainMenuLeft } from "./MainMenuLeft";

const baseItems = [
  {
    id: "home",
    label: "Dashboard",
    iconName: "home",
    href: "/dashboard",
    routeRef: "dashboard.home",
    secondaryMenu: "expanded" as const,
    secondaryItems: [
      { id: "s1", label: "Secondary Item", href: "/dashboard/one", routeRef: "dashboard.one" },
      { id: "s2", label: "Secondary Item", href: "/dashboard/two", routeRef: "dashboard.two" },
      { id: "s3", label: "Secondary Item", href: "/dashboard/three", routeRef: "dashboard.three" },
      { id: "s4", label: "Secondary Item", href: "/dashboard/four", routeRef: "dashboard.four" },
    ],
  },
  {
    id: "recommendation",
    label: "Recommendations",
    iconName: "light-bulb",
    href: "/recommendations",
    routeRef: "recommendations",
    secondaryMenu: "collapsed" as const,
  },
  {
    id: "workspace",
    label: "Workspace",
    iconName: "grid-square-9",
    href: "/workspace",
    routeRef: "workspace",
    secondaryMenu: "collapsed" as const,
    secondaryItems: [{ id: "w1", label: "Secondary Item", href: "/workspace/item", routeRef: "workspace.item" }],
  },
  {
    id: "favorites",
    label: "Favorites",
    iconName: "star-fav",
    href: "/favorites",
    routeRef: "favorites",
    secondaryMenu: "collapsed" as const,
    secondaryItems: [{ id: "f1", label: "Secondary Item", href: "/favorites/item", routeRef: "favorites.item" }],
  },
  {
    id: "recent",
    label: "Recent",
    iconName: "time-clock",
    href: "/recent",
    routeRef: "recent",
    secondaryMenu: "collapsed" as const,
    secondaryItems: [{ id: "r1", label: "Secondary Item", href: "/recent/item", routeRef: "recent.item" }],
  },
  {
    id: "category",
    label: "Category",
    iconName: "folder-closed",
    href: "/category",
    routeRef: "category",
    secondaryMenu: "collapsed" as const,
    secondaryItems: [{ id: "c1", label: "Secondary Item", href: "/category/item", routeRef: "category.item" }],
  },
];

const meta: Meta<typeof MainMenuLeft> = {
  title: "Synapse/Main Menu - Left",
  component: MainMenuLeft,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof MainMenuLeft>;

export const Expanded: Story = {
  args: {
    expanded: true,
    items: baseItems,
  },
};

export const Collapsed: Story = {
  args: {
    expanded: false,
    items: baseItems,
  },
};

export const PrimaryStates: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(250px, 1fr))", gap: 16 }}>
      <MainMenuLeft
        expanded
        forceStates
        items={[{ id: "a", label: "Dashboard", iconName: "home", state: "default", secondaryMenu: "collapsed", secondaryItems: [{ id: "a1", label: "Secondary Item" }] }]}
      />
      <MainMenuLeft
        expanded
        forceStates
        items={[{ id: "b", label: "Dashboard", iconName: "home", state: "hover", secondaryMenu: "collapsed", secondaryItems: [{ id: "b1", label: "Secondary Item" }] }]}
      />
      <MainMenuLeft
        expanded
        forceStates
        items={[{ id: "c", label: "Dashboard", iconName: "home", state: "press", secondaryMenu: "collapsed", secondaryItems: [{ id: "c1", label: "Secondary Item" }] }]}
      />
      <MainMenuLeft
        expanded
        forceStates
        items={[{ id: "d", label: "Dashboard", iconName: "home", state: "selected", secondaryMenu: "expanded", secondaryItems: [{ id: "d1", label: "Secondary Item" }] }]}
      />
      <MainMenuLeft
        expanded
        forceStates
        items={[{ id: "e", label: "Dashboard", iconName: "home", state: "default-focus", secondaryMenu: "collapsed", secondaryItems: [{ id: "e1", label: "Secondary Item" }] }]}
      />
      <MainMenuLeft
        expanded
        forceStates
        items={[{ id: "f", label: "Dashboard", iconName: "home", state: "selected-focus", secondaryMenu: "expanded", secondaryItems: [{ id: "f1", label: "Secondary Item" }] }]}
      />
    </div>
  ),
};

