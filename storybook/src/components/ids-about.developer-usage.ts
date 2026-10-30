/** Developer usage + Docs tab copy for IDS About (React). */

export const ABOUT_DOCS_DESCRIPTION = `
## Overview

About dialog with product title, version, optional serial number, copyright, and Close.

Import the component used by the IDS Storybook example for **About**.

## Props

### \`About\`

| Prop | Type | Default |
|------|------|---------|
| \`trigger\` | \`ReactNode\` | — |
| \`productTitle\` | \`string\` | required |
| \`versionLabel\` | \`string\` | required |
| \`showSerialNumber\` | \`boolean\` | — |
| \`serialNumber\` | \`string\` | — |
| \`logoSrc\` | \`string\` | — |
| \`copyrightText\` | \`string\` | — |
| \`copyrightContent\` | \`ReactNode\` | — |
| \`legalText\` | \`string\` | — |
| \`legalContent\` | \`ReactNode\` | — |
| \`closeLabel\` | \`string\` | — |
| \`defaultOpen\` | \`boolean\` | — |
| \`open\` | \`boolean\` | — |

## Events

| Callback | Signature |
|----------|-----------|
| \`onSerialCopy\` | \`() => void\` |
| \`onOpenChange\` | \`(open: boolean) => void\` |

## API

### Usage

\`\`\`tsx
<About />
\`\`\`
`.trim();

export const ABOUT_SOURCE_CODE = `<About />`;
