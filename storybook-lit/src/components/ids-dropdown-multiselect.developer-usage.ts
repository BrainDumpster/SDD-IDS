/**
 * Developer usage for IDS Lit Dropdown: Multiselect
 * (design-spec + React `IdsDropdownMultiSelect` API parity).
 */
export const DROPDOWN_MULTISELECT_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-dropdown-multiselect\` — field-attached multi-select menu from
\`components/ids/dropdown-multiselect/design-spec.md\`. API mirrors
\`@ids/react/dropdown-multiselect\`. The field shows a count \`ids-badge\` and the comma-joined
labels; hovering either opens one \`ids-tooltip\` (\`N Items\` + bulleted list).

\`\`\`
ids-dropdown-multiselect
  Label? → Field (badge + value text, caret) → portal menu
    (Show Selected panel · Select All | Clear All · search? · options · footer action)
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
| \`maxVisibleItems\` | \`maxvisibleitems\` | \`number\` | \`6\` |
| \`noResultsLabel\` | \`noresultslabel\` | \`string\` | \`No results found\` |
| \`options\` | — (property) | \`{ id, label, disabled?, kind? }[]\` | \`[]\` |
| \`value\` | — (property) | \`string[]\` (controlled) | — |
| \`defaultValue\` | — (property) | \`string[]\` | \`[]\` |
| \`showSelectAllClearAll\` | \`showselectallclearall\` | \`boolean\` | \`false\` (stories set \`true\`) |
| \`selectAllLabel\` / \`clearAllLabel\` | \`selectalllabel\` / \`clearalllabel\` | \`string\` | \`Select All\` / \`Clear All\` |
| \`clearAllDisabled\` | \`clearalldisabled\` | \`boolean\` | derived from selection |
| \`showSelectedBadge\` | \`showselectedbadge\` | \`boolean\` | \`true\` |
| \`showSelectedTooltip\` | \`showselectedtooltip\` | \`boolean\` | \`true\` |
| \`showSelectedPanel\` | \`showselectedpanel\` | \`boolean\` | \`true\` (auto-hides when empty) |
| \`actionLabel\` | \`actionlabel\` | \`string\` | — |
| \`helperText\` / \`errorText\` | \`helpertext\` / \`errortext\` | \`string\` | — |
| \`fullWidth\` | \`fullwidth\` | \`boolean\` | \`false\` |
| \`defaultOpen\` / \`forceOpen\` | \`defaultopen\` / \`forceopen\` | \`boolean\` | \`false\` (demo) |

Default-\`true\` booleans are turned off with a property binding (\`.showSelectedBadge=\${false}\`) or
\`showselectedbadge="false"\`.

## Events

| Event | Detail |
|-------|--------|
| \`ids-change\` | \`{ value: string[] }\` |
| \`ids-open-change\` | \`{ open: boolean }\` |
| \`ids-search\` | \`{ query: string }\` |
| \`ids-action\` | \`{}\` — footer \`actionLabel\` clicked |
| \`ids-select-all\` | \`{ visibleValues?: string[] }\` — cancelable (React \`onSelectAll\`) |
| \`ids-clear-all\` | \`{ visibleValues?: string[] }\` — cancelable (React \`onClearAll\`) |
| \`ids-remove-selected-tag\` | \`{ value: string }\` — cancelable |

## Behavior

- Option click toggles and keeps the menu open. **Select All** toggles the visible (filtered) scope;
  **Clear All** keeps the menu open and, while filtering, clears only visible options.
- Select All | Clear All is hidden while searching when fewer than 2 options match.
- **Show Selected / Hide Selected** (collapsed by default) lists dismissible tags.
`.trim();

export const DROPDOWN_MULTISELECT_SOURCE_CODE = `<ids-dropdown-multiselect
  label="Environment"
  required
  helpertext="Helper text"
  .options=\${[
    { id: "1", label: "Option 1" },
    { id: "2", label: "Option 2" },
    { id: "3", label: "Option 3" },
  ]}
  .defaultValue=\${["1", "2"]}
  @ids-change=\${(e) => console.log(e.detail.value)}
></ids-dropdown-multiselect>`;
