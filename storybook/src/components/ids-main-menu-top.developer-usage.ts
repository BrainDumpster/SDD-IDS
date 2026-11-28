/** Developer usage + Docs tab copy for IDS Main Menu Top (React). */

export const MAIN_MENU_TOP_DOCS_DESCRIPTION = `
## Overview

Horizontal top navigation with selectable items and optional dropdowns.

Import the component used by the IDS Storybook example for **Main Menu Top**.

## Figma references

File \`0bHk3XhrjFhowgFkz9yLr4\`:

- Main component \`10189:30280\` — https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=10189-30280&m=dev
- Primary elements \`11099:56576\` — https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11099-56576&m=dev
- Dropdown elements \`51176:249376\` — https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=51176-249376&m=dev
- Dropdown items \`51176:243662\` — https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=51176-243662&m=dev
- Menu options \`51176:243930\` — https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=51176-243930&m=dev
- Focus border \`51176:242975\` — https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=51176-242975&m=dev

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
