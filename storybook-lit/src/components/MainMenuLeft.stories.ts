/**
 * Storybook: IDS Lit Main Menu Left from `lib/lit/ids/main-menu-left`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/main-menu-left/design-spec.md
 * API: lib/react/ids/main-menu-left
 * Examples: storybook/src/components/lib-generated/MainMenuLeft.stories.tsx
 *
 * Live Figma: 0bHk3XhrjFhowgFkz9yLr4 — Expanded `11099:56218`, Collapsed `11099:56206`
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/main-menu-left/register.js";
import {
  MAIN_MENU_LEFT_SPEC_DEMO_ITEMS,
  type MainMenuLeftNavigationTarget,
  type MainMenuLeftPrimaryItem,
  type MainMenuLeftSelectionDetail,
} from "@ids/core/main-menu-left";
import {
  MAIN_MENU_LEFT_DOCS_DESCRIPTION,
  MAIN_MENU_LEFT_SOURCE_CODE,
} from "./ids-main-menu-left.developer-usage";

const DESIGN_SPEC_PATH = "components/ids/main-menu-left/design-spec.md";

type MainMenuLeftStoryArgs = {
  items: MainMenuLeftPrimaryItem[];
  expanded: boolean;
  defaultSelectedItemId?: string;
  forceStates: boolean;
  ariaLabel: string;
  onExpandedChange?: (expanded: boolean) => void;
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;
  onSelected?: (detail: MainMenuLeftSelectionDetail) => void;
};

const frameStyle = `
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  background: var(--color-background-surface-primary);
  min-height: 0;
`;

const contentStyle = `
  flex: 1;
  min-width: 0;
  padding: 24px;
  color: var(--color-text-gray-neutral-strong);
  font-size: 14px;
`;

const meta: Meta<MainMenuLeftStoryArgs> = {
  title: "Spec Generated/IDS/Main Menu Left",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          MAIN_MENU_LEFT_DOCS_DESCRIPTION,
          `Source: \`${DESIGN_SPEC_PATH}\`.`,
        ].join("\n\n"),
      },
      source: { code: MAIN_MENU_LEFT_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    items: { control: "object" },
    expanded: { control: "boolean" },
    defaultSelectedItemId: { control: "text" },
    forceStates: { control: "boolean" },
    ariaLabel: { control: "text" },
    onExpandedChange: {
      action: "onExpandedChange",
      description: "(expanded: boolean) => void — also fires ids-expanded-change",
    },
    onNavigate: {
      action: "onNavigate",
      description:
        "(target: MainMenuLeftNavigationTarget) => void — also fires ids-navigate",
    },
    onSelected: {
      action: "onSelected",
      description:
        "(detail: MainMenuLeftSelectionDetail) => void — also fires ids-selected",
    },
  },
  args: {
    expanded: true,
    defaultSelectedItemId: "dashboard",
    forceStates: false,
    ariaLabel: "Main menu left",
    items: [...MAIN_MENU_LEFT_SPEC_DEMO_ITEMS],
  },
};

export default meta;
type Story = StoryObj<MainMenuLeftStoryArgs>;

function renderRail(args: MainMenuLeftStoryArgs, contentNote: string) {
  return html`
    <div style=${frameStyle}>
      <div style="height: 100%; flex-shrink: 0;">
        <ids-main-menu-left
          style="height: 100%;"
          arialabel=${args.ariaLabel}
          defaultselecteditemid=${args.defaultSelectedItemId || nothing}
          .expanded=${Boolean(args.expanded)}
          .forceStates=${Boolean(args.forceStates)}
          .items=${args.items}
          .onExpandedChange=${args.onExpandedChange}
          .onNavigate=${args.onNavigate}
          .onSelected=${args.onSelected}
        ></ids-main-menu-left>
      </div>
      <div style=${contentStyle}>
        <p style="margin: 0; opacity: 0.85;">${contentNote}</p>
      </div>
    </div>
  `;
}

/** Figma `11099:56218` — expanded rail; Dashboard selected. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) =>
    renderRail(
      args,
      "Main content area — use the rail collapse control to verify 64px icon-only mode. Watch the Actions panel for onNavigate / onSelected / onExpandedChange.",
    ),
};

/** Collapsed icon-only rail (Figma `11099:56206`). Hover expands as overlay. */
export const Collapsed: Story = {
  args: { expanded: false },
  render: (args) =>
    renderRail(
      args,
      "Main content area — hover the collapsed rail: it expands as an overlay over this content (with a drop shadow) and collapses on mouse leave.",
    ),
};

/** Primary row with a long label that wraps / truncates. */
export const LongPrimaryLabel: Story = {
  name: "Long Primary Label",
  args: {
    items: MAIN_MENU_LEFT_SPEC_DEMO_ITEMS.map((item) =>
      item.id === "alerts"
        ? {
            ...item,
            name: "Alerts and Events with an unusually long and descriptive label that should wrap to two lines and then truncate",
          }
        : item,
    ),
  },
  render: SpecAccurateDesign.render,
};

/** Secondary rows with long labels under an expanded primary parent. */
export const LongSecondaryLabels: Story = {
  name: "Long Secondary Labels",
  args: {
    items: MAIN_MENU_LEFT_SPEC_DEMO_ITEMS.map((item) =>
      item.id === "infrastructure"
        ? {
            ...item,
            childrenMenu: "expanded" as const,
            children: (item.children ?? []).map((child, index) => ({
              ...child,
              name: `Very long secondary item label ${index + 1} that also wraps to two lines and may truncate if it is too long`,
            })),
          }
        : item,
    ),
  },
  render: SpecAccurateDesign.render,
};

/** Controlled expand/collapse via `expanded` + `onExpandedChange`. */
export const ControlledExpanded: Story = {
  name: "Controlled Expanded",
  render: (args) => {
    const [{ expanded }, updateArgs] = useArgs();
    return html`
      <div style=${frameStyle}>
        <div style="height: 100%; flex-shrink: 0;">
          <ids-main-menu-left
            style="height: 100%;"
            arialabel=${args.ariaLabel}
            defaultselecteditemid=${args.defaultSelectedItemId || nothing}
            .expanded=${Boolean(expanded)}
            .items=${args.items}
            .onNavigate=${args.onNavigate}
            .onSelected=${args.onSelected}
            .onExpandedChange=${(next: boolean) => {
              args.onExpandedChange?.(next);
              updateArgs({ expanded: next });
            }}
          ></ids-main-menu-left>
        </div>
        <div style=${contentStyle}>
          <p style="margin: 0; opacity: 0.85;">
            Controlled rail — expanded=${String(Boolean(expanded))}.
          </p>
        </div>
      </div>
    `;
  },
};

/** Fixed primary-row states for visual QA (`forceStates`, Figma `11099:56244`). */
export const PrimaryStateSnapshotMatrix: Story = {
  name: "Primary State Snapshot Matrix",
  parameters: { controls: { disable: true } },
  render: () => html`
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        height: 100vh;
        box-sizing: border-box;
        background: var(--color-background-surface-primary);
      "
    >
      <ids-main-menu-left
        style="height: 100%;"
        .expanded=${true}
        .forceStates=${true}
        .items=${[
          { id: "default", name: "Default", iconName: "home", state: "default" },
          { id: "hover", name: "Hover", iconName: "home", state: "hover" },
          { id: "press", name: "Press", iconName: "home", state: "press" },
          {
            id: "selected",
            name: "Selected",
            iconName: "home",
            state: "selected",
          },
          {
            id: "default-focus",
            name: "Default focus",
            iconName: "home",
            state: "default-focus",
          },
          {
            id: "selected-focus",
            name: "Selected focus",
            iconName: "home",
            state: "selected-focus",
          },
        ] satisfies MainMenuLeftPrimaryItem[]}
      ></ids-main-menu-left>
    </div>
  `,
};

/** Parent with `children` expanded under `forceStates`. */
export const SecondaryChildrenExpanded: Story = {
  name: "Secondary Children Expanded",
  args: {
    forceStates: true,
    defaultSelectedItemId: undefined,
    items: [
      {
        id: "infrastructure",
        name: "Infrastructure",
        iconName: "network-share",
        state: "selected",
        childrenMenu: "expanded",
        children: [
          { id: "secondary-a", name: "Secondary Item", routeRef: "/infrastructure/a" },
          { id: "secondary-b", name: "Secondary Item", routeRef: "/infrastructure/b" },
        ],
      },
      { id: "dashboard", name: "Dashboard", iconName: "home", state: "default" },
    ] satisfies MainMenuLeftPrimaryItem[],
  },
  render: SpecAccurateDesign.render,
};

/** Mode B: Tree-style nested `ids-main-menu-left-item` (no `.items` array). */
export const DeclarativeMarkup: Story = {
  name: "Declarative Markup",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<ids-main-menu-left
  defaultselecteditemid="dashboard"
  .expanded=\${true}
  .onNavigate=\${(target) => console.log("onNavigate", target)}
  .onSelected=\${(detail) => console.log("onSelected", detail)}
>
  <ids-main-menu-left-item id="dashboard" name="Dashboard" icon-name="home" route-ref="/dashboard"></ids-main-menu-left-item>
  <ids-main-menu-left-item id="infrastructure" name="Infrastructure" icon-name="network-share" route-ref="/infrastructure">
    <ids-main-menu-left-item id="secondary-a" name="Secondary Item" route-ref="/infrastructure/a"></ids-main-menu-left-item>
    <ids-main-menu-left-item id="secondary-b" name="Secondary Item" route-ref="/infrastructure/b"></ids-main-menu-left-item>
  </ids-main-menu-left-item>
  <ids-main-menu-left-item id="protection" name="Protection" icon-name="shield-encrypt-alt" route-ref="/protection"></ids-main-menu-left-item>
</ids-main-menu-left>`,
      },
    },
  },
  render: (args) => html`
    <div style=${frameStyle}>
      <div style="height: 100%; flex-shrink: 0;">
        <ids-main-menu-left
          style="height: 100%;"
          arialabel=${args.ariaLabel}
          defaultselecteditemid="dashboard"
          .expanded=${Boolean(args.expanded)}
          .onExpandedChange=${args.onExpandedChange}
          .onNavigate=${args.onNavigate}
          .onSelected=${args.onSelected}
        >
          <ids-main-menu-left-item
            id="dashboard"
            name="Dashboard"
            icon-name="home"
            route-ref="/dashboard"
          ></ids-main-menu-left-item>
          <ids-main-menu-left-item
            id="infrastructure"
            name="Infrastructure"
            icon-name="network-share"
            route-ref="/infrastructure"
          >
            <ids-main-menu-left-item
              id="secondary-a"
              name="Secondary Item"
              route-ref="/infrastructure/a"
            ></ids-main-menu-left-item>
            <ids-main-menu-left-item
              id="secondary-b"
              name="Secondary Item"
              route-ref="/infrastructure/b"
            ></ids-main-menu-left-item>
          </ids-main-menu-left-item>
          <ids-main-menu-left-item
            id="protection"
            name="Protection"
            icon-name="shield-encrypt-alt"
            route-ref="/protection"
          ></ids-main-menu-left-item>
        </ids-main-menu-left>
      </div>
      <div style=${contentStyle}>
        <p style="margin: 0; opacity: 0.85;">
          Mode B declarative markup — nested ids-main-menu-left-item (no .items).
        </p>
      </div>
    </div>
  `,
};
