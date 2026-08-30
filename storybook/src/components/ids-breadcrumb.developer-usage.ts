/** Developer usage + Docs tab copy for IDS Breadcrumb (React). */

export const BREADCRUMB_DOCS_DESCRIPTION = `
## Overview

Navigation trail showing the user’s location in the hierarchy, with truncation and overflow.

Import the component used by the IDS Storybook example for **Breadcrumb**.

## Props

### \`IdsBreadcrumb\`

| Prop | Type | Default |
|------|------|---------|
| \`items\` | \`BreadcrumbItem[]\` | required |
| \`currentPage\` | \`string\` | — |
| \`twoLines\` | \`boolean\` | — |
| \`truncate\` | \`boolean\` | — |
| \`maxVisibleItems\` | \`number\` | — |
| \`showDropdown\` | \`boolean\` | — |

## Events

No dedicated callback props beyond standard DOM handlers (unless noted in Props).

## API

### Usage

\`\`\`tsx
<IdsBreadcrumb />
\`\`\`
`.trim();

export const BREADCRUMB_SOURCE_CODE = `<IdsBreadcrumb />`;
