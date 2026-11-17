/** Developer usage + Docs tab copy for IDS Icon Button (React). */

export const ICON_BUTTON_DOCS_DESCRIPTION = `
## Overview

Square icon-only control (Primary / Secondary / Tertiary / Ghost Neutral).

\`\`\`
IdsIconButton
  → IdsIcon (internal; shape + size)
\`\`\`

Import from \`@ids/react/icon-button\`. For text / icon+text use \`IdsButton\`.

## Contract

- \`ariaLabel\` is **required** (native \`aria-label\` also accepted).
- \`shape\` is **required** (icon name) — forwarded to internal \`IdsIcon\` \`shape\`.
- Control is **square**: small \`24×24\`, medium \`32×32\`, large \`40×40\`.
- Glyph: small \`12×12\`, medium \`14×14\`, large \`16×16\` (all types, incl. Ghost Neutral).
- No Destructive variant. Consumers do **not** project a custom icon node.

## Props

| Prop | Type | Default |
|------|------|---------|
| \`shape\` | \`string\` | **required** (icon name) |
| \`variant\` | \`primary \\| secondary \\| tertiary \\| ghostNeutral \\| ghost\` | \`primary\` |
| \`size\` | \`small \\| medium \\| large\` | \`large\` |
| \`disabled\` | \`boolean\` | \`false\` |
| \`loading\` | \`boolean\` | \`false\` |
| \`ariaLabel\` | \`string\` | **required** |
| \`onClick\` | \`(event: MouseEvent<HTMLButtonElement>) => void\` | — |

## Events

| Callback | Signature |
|----------|-----------|
| \`onClick\` | \`(event: MouseEvent<HTMLButtonElement>) => void\` — successful activation; blocked when disabled/loading |

## Usage

\`\`\`tsx
import { IdsIconButton } from "@ids/react/icon-button";

<IdsIconButton
  shape="shape-plus"
  variant="primary"
  size="large"
  ariaLabel="Add"
  onClick={(event) => console.log("clicked", event)}
/>
\`\`\`
`.trim();

export const ICON_BUTTON_SOURCE_CODE = `import { IdsIconButton } from "@ids/react/icon-button";

export function Example() {
  return (
    <IdsIconButton
      shape="shape-plus"
      variant="primary"
      size="large"
      ariaLabel="Add"
      onClick={() => console.log("icon-button click")}
    />
  );
}`;
