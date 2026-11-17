/** Developer usage + Docs tab copy for IDS Lit Main Menu Top. */

export const MAIN_MENU_TOP_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-main-menu-top\` — horizontal top navigation from
\`components/ids/main-menu-top/design-spec.md\`.

**Composable Mode B (preferred):** nest \`ids-main-menu-top-item\` /
\`ids-main-menu-top-menu\` / \`ids-main-menu-top-menu-item\` /
\`ids-main-menu-top-menu-group\` / \`ids-main-menu-top-submenu\` (Tree-style).

**Mode A:** \`.items\` (\`MainMenuTopItem[]\`) — when non-empty, slotted Mode B
is ignored.

API aligned with Storybook React \`MainMenuTop\`
(\`storybook/src/components/MainMenuTop*.tsx\`). Icons via Lit \`ids-icon\`.

Live Figma (file \`0bHk3XhrjFhowgFkz9yLr4\`): Main \`10189:30280\`,
Element \`11099:56576\`, Use cases \`42136:57443\`.

## Composition

\`\`\`html
<ids-main-menu-top defaultselectedid="dash" size="Large">
  <ids-main-menu-top-item id="dash" name="Dashboard" icon-name="dashboard"></ids-main-menu-top-item>
  <ids-main-menu-top-item id="storage" name="Storage" icon-name="storage-volume" dropdown>
    <ids-main-menu-top-menu>
      <ids-main-menu-top-menu-item id="containers" label="Storage Containers"></ids-main-menu-top-menu-item>
      <ids-main-menu-top-menu-group label="Management">
        <ids-main-menu-top-menu-item id="volumes" label="Volumes"></ids-main-menu-top-menu-item>
        <ids-main-menu-top-submenu id="nested" label="Option">
          <ids-main-menu-top-menu-item id="sub-a" label="Sub Option A"></ids-main-menu-top-menu-item>
        </ids-main-menu-top-submenu>
      </ids-main-menu-top-menu-group>
    </ids-main-menu-top-menu>
  </ids-main-menu-top-item>
</ids-main-menu-top>
\`\`\`

## Props (\`ids-main-menu-top\`)

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`items\` | — (property) | \`MainMenuTopItem[]\` | \`[]\` |
| \`selectedId\` | \`selectedid\` | \`string?\` | — |
| \`defaultSelectedId\` | \`defaultselectedid\` | \`string?\` | — |
| \`size\` | \`size\` | \`"Large" \\| "Small"\` | \`"Large"\` |
| \`ariaLabel\` | \`arialabel\` | \`string\` | \`"Main menu top"\` |
| \`onMenuItemSelect\` | — (property) | \`(detail: MainMenuTopSelectDetail) => void\` | — |

## Events

| Event | Callback prop | Detail |
|-------|---------------|--------|
| \`ids-menu-item-select\` / \`onMenuItemSelect\` | \`onMenuItemSelect\` | \`MainMenuTopSelectDetail\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

/** Spec Accurate Design — Figma `10189:30280`. */
export const MAIN_MENU_TOP_SOURCE_CODE = `<ids-main-menu-top
  defaultselectedid="top-2"
  size="Large"
  .items=\${Array.from({ length: 8 }, (_, i) => ({
    id: \`top-\${i + 1}\`,
    name: "Menu Option",
    iconName: "home",
    dropdown: true,
  }))}
  .onMenuItemSelect=\${(detail) => console.log("onMenuItemSelect", detail)}
></ids-main-menu-top>`;

export const MAIN_MENU_TOP_DROPDOWN_SOURCE_CODE = `<ids-main-menu-top
  size="Large"
  .items=\${[
    { id: "dash", name: "Dashboard", iconName: "dashboard", dropdown: true },
    {
      id: "storage",
      name: "Storage",
      iconName: "storage-volume",
      dropdown: true,
      menuOptions: [
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
      ],
    },
    { id: "recovery", name: "Recovery", iconName: "arrows-spin", dropdown: true },
  ]}
  .onMenuItemSelect=\${(detail) => console.log("onMenuItemSelect", detail)}
></ids-main-menu-top>`;

export const MAIN_MENU_TOP_SUBMENU_RIGHT_SOURCE_CODE = `<ids-main-menu-top
  size="Large"
  .items=\${[
    { id: "dash", name: "Dashboard", iconName: "dashboard" },
    {
      id: "storage",
      name: "Storage",
      iconName: "storage-volume",
      dropdown: true,
      menuOptions: [
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
      ],
    },
    { id: "jobs", name: "Jobs", iconName: "time-detail", dropdown: true },
  ]}
  .onMenuItemSelect=\${(detail) => console.log("onMenuItemSelect", detail)}
></ids-main-menu-top>`;

export const MAIN_MENU_TOP_SUBMENU_LEFT_SOURCE_CODE = `<div style="display:flex;justify-content:flex-end;padding:16px;">
  <ids-main-menu-top
    size="Large"
    .items=\${[
      { id: "dash", name: "Dashboard", iconName: "dashboard" },
      { id: "reports", name: "Reports", iconName: "chart-lines" },
      {
        id: "jobs",
        name: "Jobs",
        iconName: "time-detail",
        dropdown: true,
        menuOptions: [
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
        ],
      },
    ]}
    .onMenuItemSelect=\${(detail) => console.log("onMenuItemSelect", detail)}
  ></ids-main-menu-top>
</div>`;

export const MAIN_MENU_TOP_COMPOSABLE_SOURCE_CODE = `<ids-main-menu-top
  size="Large"
  .onMenuItemSelect=\${(detail) => console.log("onMenuItemSelect", detail)}
>
  <ids-main-menu-top-item id="dash" name="Dashboard" icon-name="dashboard"></ids-main-menu-top-item>
  <ids-main-menu-top-item id="storage" name="Storage" icon-name="storage-volume" dropdown>
    <ids-main-menu-top-menu>
      <ids-main-menu-top-menu-item id="containers" label="Storage Containers"></ids-main-menu-top-menu-item>
      <ids-main-menu-top-menu-group label="Management">
        <ids-main-menu-top-menu-item id="volumes" label="Volumes"></ids-main-menu-top-menu-item>
        <ids-main-menu-top-submenu id="nested" label="Option">
          <ids-main-menu-top-menu-item id="sub-a" label="Sub Option A"></ids-main-menu-top-menu-item>
          <ids-main-menu-top-menu-item id="sub-b" label="Sub Option B"></ids-main-menu-top-menu-item>
        </ids-main-menu-top-submenu>
      </ids-main-menu-top-menu-group>
      <ids-main-menu-top-menu-item id="pools" label="Pools"></ids-main-menu-top-menu-item>
    </ids-main-menu-top-menu>
  </ids-main-menu-top-item>
  <ids-main-menu-top-item id="jobs" name="Jobs" icon-name="time-detail" dropdown>
    <ids-main-menu-top-menu>
      <ids-main-menu-top-menu-item id="running" label="Running"></ids-main-menu-top-menu-item>
      <ids-main-menu-top-submenu id="nested" label="Option">
        <ids-main-menu-top-menu-item id="sub-a" label="Sub Option A"></ids-main-menu-top-menu-item>
      </ids-main-menu-top-submenu>
    </ids-main-menu-top-menu>
  </ids-main-menu-top-item>
</ids-main-menu-top>`;

export const MAIN_MENU_TOP_SMALL_SOURCE_CODE = `<ids-main-menu-top
  defaultselectedid="top-2"
  size="Small"
  .items=\${Array.from({ length: 4 }, (_, i) => ({
    id: \`top-\${i + 1}\`,
    name: "Menu Option",
    iconName: "home",
    dropdown: true,
  }))}
  .onMenuItemSelect=\${(detail) => console.log("onMenuItemSelect", detail)}
></ids-main-menu-top>`;

export const MAIN_MENU_TOP_WITHOUT_DROPDOWN_SOURCE_CODE = `<ids-main-menu-top
  defaultselectedid="top-1"
  size="Large"
  .items=\${Array.from({ length: 4 }, (_, i) => ({
    id: \`top-\${i + 1}\`,
    name: "Menu Option",
    iconName: "home",
    dropdown: false,
  }))}
  .onMenuItemSelect=\${(detail) => console.log("onMenuItemSelect", detail)}
></ids-main-menu-top>`;

export const MAIN_MENU_TOP_DARK_SOURCE_CODE = `<div data-theme="dark" style="padding:16px;background:var(--color-background-surface-primary);">
  <ids-main-menu-top
    size="Large"
    .items=\${[
      { id: "dash", name: "Dashboard", iconName: "dashboard" },
      {
        id: "storage",
        name: "Storage",
        iconName: "storage-volume",
        dropdown: true,
        menuOptions: [
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
        ],
      },
      { id: "jobs", name: "Jobs", iconName: "time-detail", dropdown: true },
    ]}
    .onMenuItemSelect=\${(detail) => console.log("onMenuItemSelect", detail)}
  ></ids-main-menu-top>
</div>`;
