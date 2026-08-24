/** Developer usage + Docs tab copy for IDS Main Menu/Left (Angular, composition API). */

export const MAIN_MENU_LEFT_DOCS_DESCRIPTION = `
IDS Main Menu/Left — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/main-menu-left/design-spec.md\`  
**Contract:** \`component-contracts/ids/main-menu-left.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-main-menu-left [compositionMode]
  [ids-main-menu-left-logo]?
  ids-main-menu-left-item | ids-main-menu-left-group
    ids-main-menu-left-item (primary)
      <a routerLink> | <a href>
        ids-main-menu-left-item-icon
        label
    ids-main-menu-left-children
      ids-main-menu-left-item (secondary, level="secondary")
        <a routerLink> | <a href> label
\`\`\`

Import \`IDS_MAIN_MENU_LEFT_IMPORTS\` from \`ids-main-menu-left.imports.ts\`.

### Root (\`ids-main-menu-left\`)

| Input | Notes |
|-------|-------|
| \`compositionMode\` | \`true\` — render projected items/groups (preferred for Storybook) |
| \`items\` | Legacy data tree (omit when using composition) |
| \`expanded\` / \`defaultSelectedItemId\` / \`forceStates\` | Same as spec |

| Output | Notes |
|--------|-------|
| \`expandedChange\` | Rail collapse footer |
| \`selectedChange\` | Active row changed |
| \`navigate\` | Optional host hook (link hosts handle routing when projected) |

### Item (\`ids-main-menu-left-item\`)

| Input | Notes |
|-------|-------|
| \`itemId\` | Stable selection key (required) |
| \`level\` | \`primary\` (default) or \`secondary\` |
| \`forceState\` | Storybook matrix only |

Project **one** interactive host per item: \`<a href>\`, \`<a routerLink>\`, or \`<button type="button">\`.

### Group (\`ids-main-menu-left-group\`)

| Input | Notes |
|-------|-------|
| \`groupId\` | Expansion + selection parent key |
| \`defaultExpanded\` | Pins children open when \`forceStates\` (maps to \`childrenMenu\`) |
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
