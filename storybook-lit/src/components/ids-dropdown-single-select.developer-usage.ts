/**
 * Developer usage for IDS Lit Dropdown: Single-select
 * (design-spec + React `IdsDropdownSingleSelect` API parity).
 */
export const DROPDOWN_SINGLE_SELECT_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-dropdown-single-select\` — field-attached single-select menu from
\`components/ids/dropdown-single-select/design-spec.md\`. API mirrors
\`@ids/react/dropdown-single-select\`. The menu is portaled to \`document.body\`
(attached to the field, \`sideOffset\` −1) and flips above the field when it does not fit below.

\`\`\`
ids-dropdown-single-select
  Label? → Field (trigger shell + caret) → portal menu (search? · options · footer action)
  HelperText | ErrorText        (string props instead of IdsHelper / IdsError children)
\`\`\`

## Props

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`size\` | \`size\` | \`small \\| large\` | \`large\` |
| \`label\` | \`label\` | \`string\` | — |
| \`required\` | \`required\` | \`boolean\` | \`false\` |
| \`placeholder\` | \`placeholder\` | \`string\` | \`Select\` |
| \`disabled\` | \`disabled\` | \`boolean\` | \`false\` |
| \`searchable\` | \`searchable\` | \`boolean\` | \`false\` |
| \`menuWidth\` | \`menuwidth\` | \`trigger \\| content\` | \`trigger\` |
| \`showRadio\` | \`showradio\` | \`boolean\` | \`false\` |
| \`maxVisibleItems\` | \`maxvisibleitems\` | \`number\` | \`6\` |
| \`noResultsLabel\` | \`noresultslabel\` | \`string\` | \`No results found\` |
| \`options\` | — (property) | \`{ id, label, disabled?, kind? }[]\` | \`[]\` |
| \`value\` | \`value\` | \`string\` (controlled) | — |
| \`defaultValue\` | \`defaultvalue\` | \`string\` | \`""\` |
| \`showResetToDefault\` | \`showresettodefault\` | \`boolean\` | \`true\` (\`.showResetToDefault=\${false}\` to hide) |
| \`resetToDefaultLabel\` | \`resettodefaultlabel\` | \`string\` | \`Reset to Default\` |
| \`showClearAll\` | \`showclearall\` | \`boolean\` | deprecated alias of \`showResetToDefault\` |
| \`actionLabel\` | \`actionlabel\` | \`string\` | — |
| \`helperText\` | \`helpertext\` | \`string\` | — |
| \`errorText\` | \`errortext\` | \`string\` | — (sets the error state) |
| \`fullWidth\` | \`fullwidth\` | \`boolean\` | \`false\` |
| \`defaultOpen\` | \`defaultopen\` | \`boolean\` | \`false\` (demo) |
| \`forceOpen\` | \`forceopen\` | \`boolean\` | \`false\` (demo) |

## Events

| Event | Detail |
|-------|--------|
| \`ids-change\` | \`{ value: string }\` |
| \`ids-open-change\` | \`{ open: boolean }\` |
| \`ids-search\` | \`{ query: string }\` |
| \`ids-action\` | \`{}\` — footer \`actionLabel\` clicked |

## Behavior

- Selecting an option closes the menu and returns focus to the field.
- **Reset to Default** (footer) appears when the selection differs from \`defaultValue\`; it restores
  \`defaultValue\` and keeps the menu open.
- \`Enter\` / \`Space\` open the menu and focus the selected option; \`ArrowUp\` / \`ArrowDown\` wrap;
  \`Escape\` closes; \`Tab\` closes and keeps the value.
- The caret does not rotate; field focus is a brand border on \`:focus-visible\` only.

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const DROPDOWN_SINGLE_SELECT_SOURCE_CODE = `<ids-dropdown-single-select
  label="Environment"
  required
  showradio
  defaultvalue="2"
  helpertext="Helper text"
  .options=\${[
    { id: "1", label: "Option 1" },
    { id: "2", label: "Option 2" },
    { id: "3", label: "Option 3" },
  ]}
  @ids-change=\${(e) => console.log(e.detail.value)}
></ids-dropdown-single-select>`;
