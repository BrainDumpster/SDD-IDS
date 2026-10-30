/** Developer usage + Docs tab copy for IDS Main Menu/Left (Angular, composition API). */

export const MAIN_MENU_LEFT_DOCS_DESCRIPTION = `
## Overview

Left navigation rail with icon items, expansion, and active states.

## Props

### \`ids-main-menu-left\`

| Input | Type | Default |
|-------|------|---------|
| \`items\` | \`MainMenuLeftPrimaryItem[] \\| null\` | \`null\` |
| \`expanded\` | \`boolean\` | \`MAIN_MENU_LEFT_SPEC_ACCURATE_DEFA…\` |
| \`defaultSelectedItemId\` | \`string \\| null\` | \`MAIN_MENU_LEFT_SPEC_ACCURATE_DEFA…\` |
| \`forceStates\` | \`—\` | \`false\` |
| \`ariaLabel\` | \`—\` | \`MAIN_MENU_LEFT_SPEC_ACCURATE_DEFA…\` |
| \`compositionMode\` | \`—\` | \`false\` |

### \`ids-main-menu-left-item\`

| Input | Type | Default |
|-------|------|---------|
| \`level\` | \`"primary" \\| "secondary"\` | \`"primary"\` |
| \`tooltip\` | \`—\` | \`""\` |
| \`defaultExpanded\` | \`—\` | \`false\` |

### \`ids-main-menu-left-items-adapter\`

| Input | Type | Default |
|-------|------|---------|
| \`railExpanded\` | \`—\` | \`true\` |
| \`forceStates\` | \`—\` | \`false\` |
| \`selectedKey\` | \`string \\| null\` | \`null\` |
| \`expandedChildrenKey\` | \`string \\| null\` | \`null\` |
| \`selectedSecondaryParentKey\` | \`string \\| null\` | \`null\` |
| \`selectedSecondaryKey\` | \`string \\| null\` | \`null\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`expandedChange\` | \`ids-main-menu-left\` | \`boolean\` |
| \`selectedChange\` | \`ids-main-menu-left\` | \`MainMenuLeftSelectionDetail\` |
| \`navigate\` | \`ids-main-menu-left\` | \`ReturnType<typeof buildNavigateTarget\` |
| \`selectedKeyChange\` | \`ids-main-menu-left-items-adapter\` | \`string\` |
| \`expandedChildrenKeyChange\` | \`ids-main-menu-left-items-adapter\` | \`string \\| null\` |
| \`selectedSecondaryParentKeyChange\` | \`ids-main-menu-left-items-adapter\` | \`string \\| null\` |
| \`selectedSecondaryKeyChange\` | \`ids-main-menu-left-items-adapter\` | \`string \\| null\` |
| \`navigate\` | \`ids-main-menu-left-items-adapter\` | \`ReturnType<typeof buildNavigateTarget\` |
| \`selectedChange\` | \`ids-main-menu-left-items-adapter\` | \`MainMenuLeftSelectionDetail\` |

## API

Import \`IDS_MAIN_MENU_LEFT_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/main-menu-left\`).

\`\`\`ts
import { IDS_MAIN_MENU_LEFT_IMPORTS } from "@ids/angular/main-menu-left";
\`\`\`
`.trim();

export const MAIN_MENU_LEFT_COMPOSITION_DEMO_TEMPLATE = `
<ids-main-menu-left
  [compositionMode]="true"
  [expanded]="expanded"
  [defaultSelectedItemId]="defaultSelectedItemId"
  [forceStates]="forceStates"
  [ariaLabel]="ariaLabel"
>
  <ids-main-menu-left-item itemId="dashboard" tooltip="Dashboard">
      <a href="/dashboard">
        <ids-main-menu-left-item-icon shapeName="home" />
        <span class="ids-main-menu-left__primary-label">Dashboard</span>
      </a>
    </ids-main-menu-left-item>

  <ids-main-menu-left-group groupId="infrastructure" [defaultExpanded]="false">
      <ids-main-menu-left-item itemId="infrastructure" tooltip="Infrastructure">
        <a href="/infrastructure">
        <ids-main-menu-left-item-icon shapeName="network-share" />
        <span class="ids-main-menu-left__primary-label">Infrastructure</span>
      </a>
      </ids-main-menu-left-item>
      <ids-main-menu-left-children>
        <ids-main-menu-left-item itemId="secondary-a" level="secondary">
              <a href="/infrastructure/a">Secondary Item</a>
            </ids-main-menu-left-item>
        <ids-main-menu-left-item itemId="secondary-b" level="secondary">
              <a href="/infrastructure/b">Secondary Item</a>
            </ids-main-menu-left-item>
      </ids-main-menu-left-children>
    </ids-main-menu-left-group>

  <ids-main-menu-left-item itemId="protection" tooltip="Protection">
      <a href="/protection">
        <ids-main-menu-left-item-icon shapeName="shield-encrypt-alt" />
        <span class="ids-main-menu-left__primary-label">Protection</span>
      </a>
    </ids-main-menu-left-item>

  <ids-main-menu-left-item itemId="recovery" tooltip="Recovery">
      <a href="/recovery">
        <ids-main-menu-left-item-icon shapeName="arrows-spin" />
        <span class="ids-main-menu-left__primary-label">Recovery</span>
      </a>
    </ids-main-menu-left-item>

  <ids-main-menu-left-item itemId="alerts" tooltip="Alerts and Events">
      <a href="/alerts">
        <ids-main-menu-left-item-icon shapeName="alert-bell" />
        <span class="ids-main-menu-left__primary-label">Alerts and Events</span>
      </a>
    </ids-main-menu-left-item>

  <ids-main-menu-left-item itemId="reports" tooltip="Reports">
      <a href="/reports">
        <ids-main-menu-left-item-icon shapeName="productivity-alt" />
        <span class="ids-main-menu-left__primary-label">Reports</span>
      </a>
    </ids-main-menu-left-item>

  <ids-main-menu-left-item itemId="administration" tooltip="Administration">
      <a href="/administration">
        <ids-main-menu-left-item-icon shapeName="user-settings" />
        <span class="ids-main-menu-left__primary-label">Administration</span>
      </a>
    </ids-main-menu-left-item>

  <ids-main-menu-left-item itemId="jobs" tooltip="Jobs">
      <a href="/jobs">
        <ids-main-menu-left-item-icon shapeName="time-detail" />
        <span class="ids-main-menu-left__primary-label">Jobs</span>
      </a>
    </ids-main-menu-left-item>
</ids-main-menu-left>
`.trim();

export const MAIN_MENU_LEFT_STORY_FRAME_STYLES = `
  .ids-main-menu-left-story-frame {
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    background: var(--color-background-surface-primary);
    min-height: 0;
  }
  .ids-main-menu-left-story-canvas {
    flex: 1;
    min-width: 0;
    padding: 24px;
    color: var(--color-text-gray-neutral-strong);
    font-size: 14px;
  }
  .ids-main-menu-left-story-canvas p { margin: 0; opacity: 0.85; }
  .ids-main-menu-left-state-matrix {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    background: var(--color-background-surface-primary);
  }
`.trim();

export const MAIN_MENU_LEFT_SOURCE_CODE = `// See MAIN_MENU_LEFT_COMPOSITION_DEMO_TEMPLATE in ids-main-menu-left.developer-usage.js`;

export const MAIN_MENU_LEFT_STORY_SOURCE_CODE = MAIN_MENU_LEFT_COMPOSITION_DEMO_TEMPLATE;

export const MAIN_MENU_LEFT_SPEC_ACCURATE_FRAME_TEMPLATE = `
<div class="ids-main-menu-left-story-frame">
  ${MAIN_MENU_LEFT_COMPOSITION_DEMO_TEMPLATE}
  <div class="ids-main-menu-left-story-canvas">
    <p>Main content area — use the rail collapse control to verify <strong>64px</strong> icon-only mode.</p>
  </div>
</div>
`.trim();
