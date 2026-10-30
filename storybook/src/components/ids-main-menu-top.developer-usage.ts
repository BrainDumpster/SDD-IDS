/** Developer usage + Docs tab copy for IDS Main Menu Top (React). */

export const MAIN_MENU_TOP_DOCS_DESCRIPTION = `
## Overview

Horizontal top navigation with selectable items and optional dropdowns.

Import the component used by the IDS Storybook example for **Main Menu Top**.

## Props

### \`MainMenuTop\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`name\` | \`string\` | required |
| \`iconName\` | \`string\` | — |
| \`showIcon\` | \`boolean\` | — |
| \`tooltip\` | \`string\` | — |
| \`dropdown\` | \`boolean\` | — |
| \`link\` | \`MainMenuTopItem["link"]\` | — |
| \`children\` | \`ReactNode\` | — |

## Events

No dedicated callback props beyond standard DOM handlers (unless noted in Props).

## API

### Usage

\`\`\`tsx
<MainMenuTop />
\`\`\`
`.trim();

export const MAIN_MENU_TOP_SOURCE_CODE = `<MainMenuTop />`;
