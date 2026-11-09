/**
 * Developer usage copy for IDS Lit Accordion (edf-core API + design-spec visuals).
 */
export const ACCORDION_DOCS_DESCRIPTION = `
## Overview

Lit web components for IDS Accordion. Element tags and primary props/events match **edf-core**;
visual tokens and keyboard behaviour follow \`components/ids/accordion/design-spec.md\`.

## Theme (required — global, not per-component)

Load IDS tokens once at the app root, then set light/dark attributes:

\`\`\`ts
import "@ids/lit/ids-theme.css"; // → components/ids-theme.css
import { applyIdsTheme } from "@ids/lit/theme";

applyIdsTheme({ theme: "light" }); // or "dark"
// Sets data-design-system="ids" + data-theme on <html>/<body>
\`\`\`

## Assets (icons / fonts / images)

All media resolves from the repo **\`assets/\`** folder (served as \`/assets\` in Storybook):

| Kind | Path |
|------|------|
| Icons | \`assets/icons/<slug>.svg\` via \`idsIconUrl(slug)\` / \`<ids-icon shape="…">\` |
| Images | \`assets/images/<file>\` via \`idsImageUrl(file)\` |
| Fonts | \`assets/fonts/<file>\` via \`idsFontUrl(file)\` |

Override public base when needed: \`window.__IDS_ASSETS_BASE__ = "/custom/assets"\`.

Storybook: use the **Theme** toolbar (Light / Dark). Components stay reusable because
styles only reference \`var(--…)\` — they never embed theme CSS in the shadow root.

## Composition

\`\`\`html
<ids-accordion>
  <ids-accordion-panel value="section1" active>
    <ids-accordion-title>Title</ids-accordion-title>
    <ids-accordion-content>Body</ids-accordion-content>
  </ids-accordion-panel>
</ids-accordion>
\`\`\`

## Props

### \`ids-accordion\`

| Prop | Type | Default |
|------|------|---------|
| \`multiplePanelOpen\` (\`idsMultiplePanelOpen\`) | \`boolean\` | \`false\` |
| \`multiple\` | \`boolean\` | alias of \`multiplePanelOpen\` |
| \`chevronPosition\` | \`"left" \\| "right"\` | \`"left"\` |

### \`ids-accordion-panel\`

| Prop | Type | Default |
|------|------|---------|
| \`active\` | \`boolean\` | \`false\` |
| \`accordionPanelDisabled\` (\`idsAccordionPanelDisabled\`) | \`boolean\` | \`false\` |
| \`value\` | \`string\` | optional stable id |

## Events

| Event | On | Payload |
|-------|-----|---------|
| \`onToggleContent\` | panel (bubbles) | \`{ panel }\` |
| \`value-change\` | root | \`{ openValues: string[] }\` |
`.trim();

export const ACCORDION_SOURCE_CODE = `<ids-accordion chevron-position="left">
  <ids-accordion-panel value="section1" active>
    <ids-accordion-title>Network configuration</ids-accordion-title>
    <ids-accordion-content>
      Configure network policies and service endpoints for this workspace.
    </ids-accordion-content>
  </ids-accordion-panel>
  <ids-accordion-panel value="section2">
    <ids-accordion-title>Security controls</ids-accordion-title>
    <ids-accordion-content>
      Manage access rules, authentication options, and audit controls.
    </ids-accordion-content>
  </ids-accordion-panel>
  <ids-accordion-panel value="section3" accordionPanelDisabled>
    <ids-accordion-title>Integrations</ids-accordion-title>
    <ids-accordion-content>
      Connect external systems and event pipelines.
    </ids-accordion-content>
  </ids-accordion-panel>
</ids-accordion>`;
