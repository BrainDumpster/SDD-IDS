/**
 * Developer usage for IDS Lit Dropdown: Combo box
 * (design-spec + React `IdsDropdownComboBox` API parity).
 */
export const DROPDOWN_COMBO_BOX_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-dropdown-combo-box\` — searchable single / multi combo box from
\`components/ids/dropdown-combo-box/design-spec.md\`. API mirrors
\`@ids/react/dropdown-combo-box\`.

- \`mode="combobox-single"\` (default): footer **Reset to Default** when the selection differs from \`defaultValue\`.
- \`mode="combobox-multi"\`: badge + tooltip in the field, Select All | Clear All, optional Show Selected panel.
- Inline **ghost-text autocomplete**: when the typed keyword is a prefix of exactly one option the
  remaining tail renders greyed out; accept with \`Tab\`, \`→\` (caret at end) or \`End\`.

## Props

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`mode\` | \`mode\` | \`combobox-single \\| combobox-multi\` | \`combobox-single\` |
| \`size\` | \`size\` | \`small \\| large\` | \`large\` |
| \`label\` | \`label\` | \`string\` | — |
| \`required\` | \`required\` | \`boolean\` | \`false\` |
| \`placeholder\` | \`placeholder\` | \`string\` | \`Select\` |
| \`disabled\` | \`disabled\` | \`boolean\` | \`false\` |
| \`searchable\` | \`searchable\` | \`boolean\` | \`false\` (combo box stories enable it) |
| \`menuWidth\` | \`menuwidth\` | \`trigger \\| content\` | \`trigger\` |
| \`options\` | — (property) | \`{ id, label, disabled? }[]\` | \`[]\` |
| \`value\` | \`value\` (single) | \`string \\| string[]\` (controlled) | — |
| \`defaultValue\` | \`defaultvalue\` (single) | \`string \\| string[]\` | — |
| \`showResetToDefault\` | \`showresettodefault\` | \`boolean\` | \`true\` (single only) |
| \`resetToDefaultLabel\` | \`resettodefaultlabel\` | \`string\` | \`Reset to Default\` |
| \`showClearAll\` | \`showclearall\` | \`boolean\` | deprecated alias of \`showResetToDefault\` |
| \`showSelectedPanel\` | \`showselectedpanel\` | \`boolean\` | \`false\` (multi only) |
| \`showSelectedExpanded\` | \`showselectedexpanded\` | \`boolean\` | uncontrolled |
| \`maxVisibleItems\` | \`maxvisibleitems\` | \`number\` | \`6\` |
| \`noResultsLabel\` | \`noresultslabel\` | \`string\` | \`No results found\` |
| \`helperText\` / \`errorText\` | \`helpertext\` / \`errortext\` | \`string\` | — |
| \`fullWidth\` | \`fullwidth\` | \`boolean\` | \`false\` |
| \`defaultOpen\` / \`forceOpen\` | \`defaultopen\` / \`forceopen\` | \`boolean\` | \`false\` (demo) |

## Events

| Event | Detail |
|-------|--------|
| \`ids-change\` | \`{ value: string }\` (single) · \`{ value: string[] }\` (multi) |
| \`ids-open-change\` | \`{ open: boolean }\` |
| \`ids-search\` | \`{ query: string }\` |
| \`ids-select-all\` / \`ids-clear-all\` | \`{ visibleValues?: string[] }\` — cancelable (multi) |
| \`ids-remove-selected-tag\` | \`{ value: string }\` — cancelable |
| \`ids-show-selected-expanded-change\` | \`{ expanded: boolean }\` |

## Behavior

- Search filters by case-insensitive substring; sections / dividers are not used by the combo box.
- \`Enter\` / \`Space\` open the menu and focus the selected option, else the search field.
- Popup min-height is 212px (search) / 252px (search + Select All row).
`.trim();

export const DROPDOWN_COMBO_BOX_SOURCE_CODE = `<ids-dropdown-combo-box
  mode="combobox-single"
  label="Environment"
  required
  searchable
  defaultvalue="app-2"
  helpertext="Helper text"
  .options=\${[
    { id: "app-1", label: "Storage" },
    { id: "app-2", label: "Compute" },
    { id: "app-3", label: "Network" },
  ]}
  @ids-change=\${(e) => console.log(e.detail.value)}
></ids-dropdown-combo-box>

<ids-dropdown-combo-box
  mode="combobox-multi"
  searchable
  showselectedpanel
  .options=\${[...]}
></ids-dropdown-combo-box>`;
