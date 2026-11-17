/** Developer usage + Docs tab copy for IDS Lit App Shell. */

export const APP_SHELL_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-app-shell\` — **layout shell only** from \`components/ids/app-shell/design-spec.md\`.

Project child components with their own APIs (do not pass Masthead / Main Menu / Footer props on the shell):

\`\`\`
ids-app-shell
  slot=masthead     → ids-masthead (+ its slots/props)
  slot=main-menu    → ids-main-menu-left (+ items, expanded, …)
  (owned) page header + body content from pages[]
  slot=footer       → ids-footer (+ hostname, swid, …)
\`\`\`

## Named slots

| Slot | Project |
|------|---------|
| \`masthead\` | \`ids-masthead\` |
| \`main-menu\` | \`ids-main-menu-left\` |
| \`footer\` | \`ids-footer\` |
| \`body\` | Optional override of \`pages[].content\` |

## Shell-owned props

| Prop | Binding | Notes |
|------|---------|-------|
| \`pages\` | \`.pages=\` | \`AppShellPage[]\` — title / description / content |
| \`activePageId\` / \`defaultPageId\` | attrs | Controlled / uncontrolled page |
| \`showPageDescription\` | property | Hide description text only |
| \`focusManagementOnNavigate\` | property | Focus page title on route change |
| \`pageTitleLevel\` | \`pagetitlelevel\` | \`1\` \\| \`2\` |
| \`breakpointPreset\` | \`breakpointpreset\` | \`fluid\` \\| \`1920\` \\| \`1600\` \\| \`1366\` \\| \`1024\` |
| \`persistMenuExpanded\` | property | Persist Main Menu toggle to \`ids.app-shell.menuExpanded\` |

Shell constants (\`app-shell.constants.ts\`) hold only shell types/helpers — not menu/footer demo data. Use \`resolveMenuExpandedDefault(breakpointPreset)\` (or \`shell.menuExpandedDefault\`) when binding projected \`.expanded\` on \`ids-main-menu-left\`.

## Events

| Event | Detail |
|-------|--------|
| \`page-change\` / \`onPageChange\` | \`{ pageId, page }\` — also follows bubbled \`ids-navigate\` from Main Menu |

Masthead / Main Menu / Footer events stay on those components.

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const APP_SHELL_SOURCE_CODE = `import "@ids/core/app-shell/register.js";
import "@ids/core/masthead/register.js";
import "@ids/core/main-menu-left/register.js";
import "@ids/core/footer/register.js";
import { html } from "lit";
import { resolveMenuExpandedDefault } from "@ids/core/app-shell";

html\`
  <ids-app-shell
    breakpointpreset="1920"
    defaultpageid="dashboard"
    .pages=\${pages}
  >
    <ids-masthead slot="masthead" productname="Product Name">
      <ids-icon slot="logo" shape="shield-cloud" variant="img" size="32"></ids-icon>
      <!-- header actions / app-launcher / avatar as masthead slots -->
    </ids-masthead>

    <ids-main-menu-left
      slot="main-menu"
      .items=\${menuItems}
      .expanded=\${resolveMenuExpandedDefault("1920")}
      defaultselecteditemid="dashboard"
    ></ids-main-menu-left>

    <ids-footer
      slot="footer"
      hostname="short_name_first_domain_name"
      swid="ELMCR00222GBPB"
      currentdatetime="Tue, 2023-04-23 12:30 AM"
      timezonelabel="Eastern Time (US & Canada)"
    ></ids-footer>
  </ids-app-shell>
\`;`;
