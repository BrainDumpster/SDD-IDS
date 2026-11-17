/** Developer usage + Docs tab copy for IDS Lit Breadcrumb. */

export const BREADCRUMB_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-breadcrumb\` — navigation trail from \`components/ids/breadcrumb/design-spec.md\`.

API aligned with Storybook React \`IdsBreadcrumb\`
(\`storybook/src/components/IdsBreadcrumb.tsx\`; there is no \`lib/react/ids/breadcrumb\`).

Uses Lit \`ids-link\` (standalone) for trail items and the overflow ellipsis.
When \`items.length > maxVisibleItems\` (default 3), the trail shows first + last
with an ellipsis that opens a Dropdown-SingleSelect-style overflow menu of the
hidden links. Optional \`currentPage\` renders Header 5 below the trail.

## Props

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`items\` | — (property) | \`{ label: string; href?: string }[]\` | \`[]\` |
| \`currentPage\` | \`currentpage\` | \`string\` | — |
| \`maxVisibleItems\` | \`maxvisibleitems\` | \`number\` | \`3\` |

## Events

| Event | Detail |
|-------|--------|
| \`ids-open-change\` | \`{ open: boolean }\` — overflow menu open state |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const BREADCRUMB_SOURCE_CODE = `<ids-breadcrumb
  currentpage="Current Page"
  .items=\${[
    { label: "Breadcrumb 1", href: "#" },
    { label: "Breadcrumb 2", href: "#" },
    { label: "Breadcrumb 3", href: "#" },
    { label: "Breadcrumb 4", href: "#" },
  ]}
></ids-breadcrumb>`;
