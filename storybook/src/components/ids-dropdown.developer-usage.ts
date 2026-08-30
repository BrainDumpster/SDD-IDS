/** Docs tab copy for IDS Dropdown (React). */

export const DROPDOWN_DOCS_DESCRIPTION = `
IDS Dropdown — React **composition** API (\`storybook/src/components/IdsDropdown.tsx\`).

\`\`\`tsx
<IdsDropdown mode="combobox-single" value={selected} onValueChange={setSelected}>
  <IdsDropdown.Menu showSearch defaultOpen maxHeight={220}>
    <IdsDropdown.TriggerShell left={<span>{selected || "Select"}</span>} />
    <IdsDropdown.MenuItem value="Storage" label="Storage" />
    <IdsDropdown.MenuGroup groupName="Section Title">
      <IdsDropdown.MenuItem value="Option 1" label="Option 1" />
    </IdsDropdown.MenuGroup>
    <IdsDropdown.MenuFooter actionLabel="Action" onAction={() => {}} />
  </IdsDropdown.Menu>
  <IdsDropdown.Helper>Helper text</IdsDropdown.Helper>
  <IdsDropdown.Error>Error message</IdsDropdown.Error>
</IdsDropdown>
\`\`\`

Modes: \`combobox-single\` | \`combobox-multi\` | \`single-select\` | \`multi-select\`
`.trim();

export const DROPDOWN_STORY_SOURCE = `<IdsDropdown mode="combobox-single" value={selected} onValueChange={setSelected}>
  <IdsDropdown.Menu showSearch defaultOpen>
    <IdsDropdown.TriggerShell left={<span>{selected || "Select"}</span>} />
    <IdsDropdown.MenuItem value="Storage" label="Storage" />
    <IdsDropdown.MenuItem value="Compute" label="Compute" />
  </IdsDropdown.Menu>
  <IdsDropdown.Helper>Choose one product</IdsDropdown.Helper>
</IdsDropdown>`;
