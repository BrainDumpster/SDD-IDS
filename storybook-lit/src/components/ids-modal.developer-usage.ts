/** Developer usage + Docs tab copy for IDS Lit Modal. */

export const MODAL_DOCS_DESCRIPTION = `
## Overview

Dialog overlay with header, description, content, tabs, and footer composition.

\`\`\`
ids-modal
  ids-modal-close
  ids-modal-header
  ids-modal-title
  ids-modal-description
  ids-modal-tabs
  ids-modal-content
  ids-modal-footer
\`\`\`

Import via \`@ids/core/modal/register.js\`.

Scenarios:

- **\`dialog\`** — always 640px wide, height follows content (Figma ModalDialog-Main). \`size\` does not apply.
- **\`single-page\` / \`multi-page\`** — \`size\` sets width and height: \`x-small\` 640×328, \`small\` 960×497, \`medium\` 1280×667, \`large\` 1600×826 (Figma Modal-Main). Footer has a top rule; multi-page uses \`ids-tabs\` (primary, transparent surface).

Prop-driven chrome uses \`modaltitle\` + \`primaryactionlabel\` (and optional tertiary/secondary labels). Compound anatomy children replace prop-driven chrome when present.

## Events

| Event | Detail | React parity |
|-------|--------|--------------|
| \`open-change\` | \`boolean\` | \`onOpenChange\` |
| \`close\` | — | \`onClose\` |
| \`primary-action\` | — | \`onPrimaryAction\` |
| \`tertiary-action\` | — | \`onTertiaryAction\` |
| \`secondary-action\` | — | \`onSecondaryAction\` |
| \`page-change\` | \`string\` | \`onPageChange\` |

## Usage

\`\`\`html
<ids-modal
  .open=\${open}
  scenario="dialog"
  type="non-alerting"
  modaltitle="Non-Alerting"
  description="…"
  primaryactionlabel="Close"
  .onOpenChange=\${setOpen}
></ids-modal>
\`\`\`
`.trim();

export const MODAL_SOURCE_CODE = `import "@ids/core/modal/register.js";

const modal = document.querySelector("ids-modal");
modal.open = true;
modal.addEventListener("open-change", (e) => {
  console.log("open", e.detail);
});

/* Compound anatomy */
/*
<ids-modal .open=\${true} scenario="single-page" size="medium">
  <ids-modal-header>
    <ids-modal-title>Header</ids-modal-title>
    <ids-modal-close></ids-modal-close>
  </ids-modal-header>
  <ids-modal-description>…</ids-modal-description>
  <ids-modal-content>…</ids-modal-content>
  <ids-modal-footer>…</ids-modal-footer>
</ids-modal>
*/
`;
