/** Docs tab copy for Synapse Dropdown (React, IDS-fork composition API). */

export const SYNAPSE_DROPDOWN_DOCS_DESCRIPTION = `
Synapse Dropdown — React **composition** API (IDS-fork). Theme: \`components/synapse-theme.css\`.

\`\`\`tsx
<SynapseDropdown mode="combobox-single" value={selected} onValueChange={setSelected}>
  <SynapseDropdownMenu showSearch defaultOpen maxHeight={220}>
    <SynapseDropdownTriggerShell left={<span>{selected || "Select"}</span>} />
    <SynapseDropdownMenuItem value="Storage" label="Storage" />
    <SynapseDropdownMenuGroup groupName="Section Title">
      <SynapseDropdownMenuItem value="Option 1" label="Option 1" />
    </SynapseDropdownMenuGroup>
    <SynapseDropdownMenuFooter actionLabel="Action" onAction={() => {}} />
  </SynapseDropdownMenu>
  <SynapseDropdownHelper>Helper text</SynapseDropdownHelper>
  <SynapseDropdownError>Error message</SynapseDropdownError>
</SynapseDropdown>
\`\`\`

Modes: \`combobox-single\` | \`combobox-multi\` | \`single-select\` | \`multi-select\`
`.trim();

export const SYNAPSE_DROPDOWN_STORY_SOURCE = `<SynapseDropdown mode="combobox-single" value={selected} onValueChange={setSelected}>
  <SynapseDropdownMenu showSearch defaultOpen>
    <SynapseDropdownTriggerShell left={<span>{selected || "Select product"}</span>} />
    <SynapseDropdownMenuItem value="Storage" label="Storage" />
    <SynapseDropdownMenuItem value="Compute" label="Compute" />
  </SynapseDropdownMenu>
  <SynapseDropdownHelper>Choose one product</SynapseDropdownHelper>
</SynapseDropdown>`;
