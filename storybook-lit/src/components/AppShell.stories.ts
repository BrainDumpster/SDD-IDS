/**
 * Storybook: IDS Lit App Shell from `lib/lit/ids/app-shell`
 *
 * Projection-first: shell = layout + page chrome; Masthead / Main Menu / Footer
 * are slotted with their own component props.
 *
 * Spec: components/ids/app-shell/design-spec.md
 * Live Figma: `43478:46307` (1920), `43478:90925` (1366)
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html, type TemplateResult } from "lit";
import "@ids/core/app-shell/register.js";
import "@ids/core/masthead/register.js";
import "@ids/core/main-menu-left/register.js";
import "@ids/core/footer/register.js";
import "@ids/core/app-launcher/register.js";
import "@ids/core/icon/register.js";
import {
  resolveMenuExpandedDefault,
  type AppShellPage,
  type IdsAppShellBreakpointPreset,
} from "@ids/core/app-shell/register.js";
import type { MainMenuLeftPrimaryItem } from "@ids/core/main-menu-left";
import type { IdsAppLauncherProduct } from "@ids/core/app-launcher";
import {
  APP_SHELL_DOCS_DESCRIPTION,
  APP_SHELL_SOURCE_CODE,
} from "./ids-app-shell.developer-usage";

type AppShellArgs = {
  breakpointPreset: IdsAppShellBreakpointPreset;
  showPageDescription: boolean;
  persistMenuExpanded: boolean;
  menuExpanded: boolean;
  mastheadProductName: string;
};

const sampleProducts: IdsAppLauncherProduct[] = [
  { id: "p1", name: "Product Name 1" },
  { id: "p2", name: "Product Name 2" },
];

/** Spec Accurate menu tree — Main Menu Left sample (not an App Shell prop). */
const specAccurateMenuItems: MainMenuLeftPrimaryItem[] = [
  { id: "dashboard", name: "Dashboard", iconName: "home", routeRef: "/dashboard" },
  {
    id: "infrastructure",
    name: "Infrastructure",
    iconName: "network-share",
    routeRef: "/infrastructure",
    childrenMenu: "collapsed",
    children: [
      { id: "infra-a", name: "Clusters", routeRef: "/infrastructure/clusters" },
      { id: "infra-b", name: "Storage", routeRef: "/infrastructure/storage" },
    ],
  },
  { id: "protection", name: "Protection", iconName: "shield-encrypt-alt", routeRef: "/protection" },
  { id: "recovery", name: "Recovery", iconName: "arrows-spin", routeRef: "/recovery" },
  { id: "alerts", name: "Alerts and Events", iconName: "alert-bell", routeRef: "/alerts" },
  { id: "reports", name: "Reports", iconName: "productivity-alt", routeRef: "/reports" },
  {
    id: "administration",
    name: "Administration",
    iconName: "user-settings",
    routeRef: "/administration",
  },
  { id: "jobs", name: "Jobs", iconName: "time-detail", routeRef: "/jobs" },
];

const SPEC_PAGE_DESCRIPTION =
  "This subtitle is meant for instructional text that outlines the purpose of this page. It's advisable to include such text unless the page is a dashboard or self-explanatory.";

function pagePanel(title: string): TemplateResult {
  return html`
    <ids-app-shell-page-panel title=${`${title} content`}>
      <p style="margin:0">
        Body content for <strong>${title}</strong> — swap this slot with product
        views.
      </p>
    </ids-app-shell-page-panel>
  `;
}

const SPEC_PAGES: AppShellPage[] = specAccurateMenuItems.map((item) => ({
  id: item.id ?? item.name ?? "page",
  title: item.name ?? "Page Title",
  description: SPEC_PAGE_DESCRIPTION,
  content: pagePanel(item.name ?? "Page"),
}));

const frameStyle =
  "height:100vh;width:100%;overflow:auto;box-sizing:border-box;background:var(--color-background-surface-primary);";

function projectedMasthead(productName: string) {
  return html`
    <ids-masthead slot="masthead" productname=${productName}>
      <ids-icon
        slot="logo"
        shape="shield-cloud"
        variant="img"
        size="32"
        title="Product logo"
      ></ids-icon>
      <ids-masthead-action-button-container slot="icons">
        <ids-masthead-action-icon-button
          arialabel="Search"
          iconslug="search-16"
        ></ids-masthead-action-icon-button>
        <ids-masthead-action-icon-button
          arialabel="Alerts, 3 unread"
          iconslug="alert-bell-16"
          badgecount="3"
          badgetype="critical"
        ></ids-masthead-action-icon-button>
        <ids-masthead-action-icon-button
          arialabel="Jobs queue, 2 active"
          iconslug="jobs-queue-stack"
          badgecount="2"
          badgetype="success"
        ></ids-masthead-action-icon-button>
        <ids-masthead-action-icon-button
          arialabel="Settings"
          iconslug="setting-gear-16"
        ></ids-masthead-action-icon-button>
        <ids-masthead-action-icon-button
          arialabel="Help"
          iconslug="help-circ-16"
        ></ids-masthead-action-icon-button>
      </ids-masthead-action-button-container>
      <ids-app-launcher
        slot="app-launcher"
        triggervariant="masthead"
        sideoffset="0"
        .products=${sampleProducts}
      ></ids-app-launcher>
      <ids-masthead-avatar
        slot="avatar"
        initials="DT"
        arialabel="User settings"
      ></ids-masthead-avatar>
    </ids-masthead>
  `;
}

function projectedMainMenu(expanded: boolean) {
  return html`
    <ids-main-menu-left
      slot="main-menu"
      .items=${specAccurateMenuItems}
      .expanded=${expanded}
      defaultselecteditemid="dashboard"
    ></ids-main-menu-left>
  `;
}

const projectedFooter = html`
  <ids-footer
    slot="footer"
    hostname="short_name_first_domain_name"
    swid="ELMCR00222GBPB"
    currentdatetime="Tue, 2023-04-23 12:30 AM"
    timezonelabel="Eastern Time (US & Canada)"
  ></ids-footer>
`;

function renderAppShell(args: AppShellArgs) {
  const expanded =
    args.menuExpanded ??
    resolveMenuExpandedDefault(args.breakpointPreset, {
      persistMenuExpanded: args.persistMenuExpanded,
    });
  return html`
    <div style=${frameStyle}>
      <ids-app-shell
        breakpointpreset=${args.breakpointPreset}
        defaultpageid="dashboard"
        .persistMenuExpanded=${args.persistMenuExpanded}
        .showPageDescription=${args.showPageDescription}
        .pages=${SPEC_PAGES}
      >
        ${projectedMasthead(args.mastheadProductName)}
        ${projectedMainMenu(expanded)} ${projectedFooter}
      </ids-app-shell>
    </div>
  `;
}

const meta: Meta<AppShellArgs> = {
  title: "Spec Generated/IDS/App Shell",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: { component: APP_SHELL_DOCS_DESCRIPTION },
      source: { code: APP_SHELL_SOURCE_CODE, language: "html" },
      story: { inline: false, height: "640px" },
    },
  },
  argTypes: {
    breakpointPreset: {
      control: "select",
      options: ["fluid", "1920", "1600", "1366", "1024"],
    },
    showPageDescription: { control: "boolean" },
    persistMenuExpanded: { control: "boolean" },
    menuExpanded: {
      control: "boolean",
      name: "main-menu.expanded (projected)",
    },
    mastheadProductName: {
      control: "text",
      name: "masthead.productName (projected)",
    },
  },
  args: {
    breakpointPreset: "1920",
    showPageDescription: true,
    persistMenuExpanded: false,
    menuExpanded: true,
    mastheadProductName: "Product Name",
  },
};

export default meta;
type Story = StoryObj<AppShellArgs>;

/** Figma `Screen size=1920` — `43478:46307`. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    breakpointPreset: "1920",
    menuExpanded: true,
  },
  render: (args) => renderAppShell(args),
};

export const ConvenienceProps: Story = {
  name: "Convenience props",
  tags: ["!autodocs"],
  args: {
    breakpointPreset: "fluid",
    menuExpanded: true,
  },
  render: (args) => renderAppShell(args),
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  tags: ["!autodocs"],
  args: {
    breakpointPreset: "fluid",
    menuExpanded: true,
  },
  render: (args) => renderAppShell(args),
};

/** Figma `Screen size=1366` — `43478:90925`. */
export const CollapsedMenu1366: Story = {
  name: "Collapsed Menu (1366)",
  tags: ["!autodocs"],
  args: {
    breakpointPreset: "1366",
    menuExpanded: false,
  },
  render: (args) => renderAppShell(args),
};

export const Breakpoint1024: Story = {
  name: "Breakpoint 1024",
  tags: ["!autodocs"],
  args: {
    breakpointPreset: "1024",
    menuExpanded: false,
  },
  render: (args) => renderAppShell(args),
};

export const ComposedHeaderActions: Story = {
  name: "Composed header actions",
  tags: ["!autodocs"],
  args: {
    breakpointPreset: "fluid",
    menuExpanded: true,
  },
  render: (args) => html`
    <div style=${frameStyle}>
      <ids-app-shell
        breakpointpreset=${args.breakpointPreset}
        defaultpageid="dashboard"
        .pages=${SPEC_PAGES}
      >
        <ids-masthead slot="masthead" productname=${args.mastheadProductName}>
          <ids-icon
            slot="logo"
            shape="shield-cloud"
            variant="img"
            size="32"
          ></ids-icon>
          <ids-masthead-action-button-container slot="icons">
            <ids-masthead-action-icon-button
              arialabel="What's New, 5 new"
              iconslug="alert-bell-16"
              badgecount="5"
              badgetype="critical"
            ></ids-masthead-action-icon-button>
            <ids-masthead-action-icon-button
              arialabel="Settings"
              iconslug="setting-gear-16"
            ></ids-masthead-action-icon-button>
          </ids-masthead-action-button-container>
          <ids-app-launcher
            slot="app-launcher"
            triggervariant="masthead"
            .products=${sampleProducts}
          ></ids-app-launcher>
          <ids-masthead-avatar
            slot="avatar"
            initials="DT"
            arialabel="User settings"
          ></ids-masthead-avatar>
        </ids-masthead>
        ${projectedMainMenu(args.menuExpanded)} ${projectedFooter}
      </ids-app-shell>
    </div>
  `,
};

export const NavigationDemo: Story = {
  name: "Navigation Demo",
  tags: ["!autodocs"],
  args: {
    breakpointPreset: "fluid",
    menuExpanded: true,
  },
  render: (args) => {
    let lastPage = "dashboard";
    const statusId = "ids-app-shell-nav-demo-status";
    const updateStatus = () => {
      const el = document.getElementById(statusId);
      if (el) el.textContent = `Active page: ${lastPage}`;
    };
    return html`
      <div style="${frameStyle}position:relative">
        <ids-app-shell
          breakpointpreset=${args.breakpointPreset}
          defaultpageid="dashboard"
          .pages=${SPEC_PAGES}
          .onPageChange=${(pageId: string) => {
            lastPage = pageId;
            updateStatus();
          }}
        >
          ${projectedMasthead(args.mastheadProductName)}
          ${projectedMainMenu(args.menuExpanded)} ${projectedFooter}
        </ids-app-shell>
        <div
          id=${statusId}
          style="position:fixed;bottom:40px;right:16px;z-index:10;padding:8px 12px;font-size:12px;background:var(--color-background-surface-component);border:1px solid var(--color-border-gray-neutral-base);border-radius:4px;pointer-events:none"
        >
          Active page: ${lastPage}
        </div>
      </div>
    `;
  },
};
