/** Developer usage + Docs tab copy for IDS Page Error (React). */

export const PAGE_ERROR_DOCS_DESCRIPTION = `
## Overview

Full-page error state with message, illustration, and recovery actions.

Import the component used by the IDS Storybook example for **Page Error**.

## Props

### \`PageError\`

| Prop | Type | Default |
|------|------|---------|
| \`errorName\` | \`string\` | required |
| \`errorCode\` | \`string\` | — |
| \`probableCause\` | \`string\` | — |
| \`resolutions\` | \`string\` | — |
| \`action\` | \`PageErrorAction\` | — |
| \`showResolution\` | \`boolean\` | — |
| \`iconName\` | \`string\` | — |
| \`className\` | \`string\` | — |
| \`children\` | \`ReactNode\` | — |

## Events

No dedicated callback props beyond standard DOM handlers (unless noted in Props).

## API

### Usage

\`\`\`tsx
<PageError />
\`\`\`
`.trim();

export const PAGE_ERROR_SOURCE_CODE = `<PageError />`;
