import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  SynapseDropdown,
  SynapseDropdownMenu,
  SynapseDropdownMenuItem,
  SynapseDropdownError,
  SynapseDropdownHelper,
  SynapseDropdownTriggerShell,
} from "./SynapseDropdown";
import {
  SYNAPSE_DROPDOWN_COMBO_BOX_DESIGN_SPEC_PATH,
  SYNAPSE_DROPDOWN_COMBO_BOX_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_DROPDOWN_COMBO_BOX_MAIN_NODE_ID,
} from "../spec-contracts/synapse-dropdown-combo-box.contract";
import {
  SYNAPSE_DROPDOWN_DOCS_DESCRIPTION,
  SYNAPSE_DROPDOWN_STORY_SOURCE,
} from "./synapse-dropdown.developer-usage";

const meta: Meta<typeof SynapseDropdown> = {
  title: "Spec Generated/Synapse/Dropdown/Combo Box",
  component: SynapseDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_DROPDOWN_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_DROPDOWN_COMBO_BOX_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_DROPDOWN_COMBO_BOX_IDS_BASELINE_SPEC_PATH}\`.`,
          `Figma field set: \`${SYNAPSE_DROPDOWN_COMBO_BOX_MAIN_NODE_ID}\`.`,
        ].join("\n\n"),
      },
      source: { type: "code", language: "tsx", code: SYNAPSE_DROPDOWN_STORY_SOURCE },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseDropdown>;

export const CompositionApi: Story = {
  name: "Composition API",
  render: () => {
    const [selected, setSelected] = useState("Compute");
    return (
      <div style={{ width: 300 }}>
        <SynapseDropdown mode="combobox-single" value={selected} onValueChange={setSelected}>
          <SynapseDropdownMenu showSearch defaultOpen maxHeight={220}>
            <SynapseDropdownTriggerShell
              left={
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selected || "Select product"}
                </span>
              }
            />
            <SynapseDropdownMenuItem value="Storage" label="Storage" />
            <SynapseDropdownMenuItem value="Compute" label="Compute" />
            <SynapseDropdownMenuItem value="Network" label="Network" />
            <SynapseDropdownMenuItem value="Security" label="Security" />
          </SynapseDropdownMenu>
          <SynapseDropdownHelper>Choose one product</SynapseDropdownHelper>
        </SynapseDropdown>
      </div>
    );
  },
};

export const ComboboxMultiComposition: Story = {
  name: "Combobox Multi — Composition",
  render: () => {
    const [selected, setSelected] = useState<string[]>(["Storage", "Compute"]);
    const [searchQuery, setSearchQuery] = useState("");
    return (
      <div style={{ width: 300 }}>
        <SynapseDropdown mode="combobox-multi" values={selected} onValuesChange={setSelected}>
          <SynapseDropdownMenu
            showSearch
            searchValue={searchQuery}
            onSearchValueChange={setSearchQuery}
            showSelectAllClearAll
            selectAllChecked={selected.length === 4}
            selectAllIndeterminate={selected.length > 0 && selected.length < 4}
            onSelectAllClick={() => setSelected(["Storage", "Compute", "Network", "Security"])}
            onClearAllClick={() => setSelected([])}
            clearAllDisabled={selected.length === 0}
            showSelectedPanel
            defaultShowSelectedExpanded
            onRemoveSelectedTag={(value) => setSelected((prev) => prev.filter((e) => e !== value))}
            onShowSelectedPanelClear={() => setSelected([])}
            defaultOpen
            maxHeight={220}
          >
            <SynapseDropdownTriggerShell
              left={
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selected.length ? selected.join(", ") : "Select products"}
                </span>
              }
            />
            <SynapseDropdownMenuItem value="Storage" label="Storage" />
            <SynapseDropdownMenuItem value="Compute" label="Compute" />
            <SynapseDropdownMenuItem value="Network" label="Network" />
            <SynapseDropdownMenuItem value="Security" label="Security" />
          </SynapseDropdownMenu>
          <SynapseDropdownHelper>Choose one or more products</SynapseDropdownHelper>
        </SynapseDropdown>
      </div>
    );
  },
};

export const DisabledState: Story = {
  name: "Disabled State",
  render: () => (
    <div style={{ width: 360 }}>
      <SynapseDropdown mode="combobox-single" disabled value="Storage">
        <SynapseDropdownMenu showSearch disabled>
          <SynapseDropdownTriggerShell disabled left={<span>Storage</span>} />
          <SynapseDropdownMenuItem value="Storage" label="Storage" />
          <SynapseDropdownMenuItem value="Compute" label="Compute" />
        </SynapseDropdownMenu>
        <SynapseDropdownHelper>Component is disabled</SynapseDropdownHelper>
      </SynapseDropdown>
    </div>
  ),
};

export const ErrorState: Story = {
  name: "Error State",
  render: () => (
    <div style={{ width: 360 }}>
      <SynapseDropdown mode="combobox-single">
        <SynapseDropdownMenu showSearch>
          <SynapseDropdownTriggerShell error left={<span>-Type or Select-</span>} />
          <SynapseDropdownMenuItem value="Storage" label="Storage" />
          <SynapseDropdownMenuItem value="Compute" label="Compute" />
        </SynapseDropdownMenu>
        <SynapseDropdownError>Error message</SynapseDropdownError>
      </SynapseDropdown>
    </div>
  ),
};

export const SizeMatrix: Story = {
  name: "Size Matrix",
  render: () => (
    <div style={{ width: 760, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
      <SynapseDropdown mode="combobox-single">
        <SynapseDropdownMenu showSearch defaultOpen maxHeight={220}>
          <SynapseDropdownTriggerShell size="large" hover left={<span>Large (40)</span>} />
          {Array.from({ length: 6 }, (_, i) => (
            <SynapseDropdownMenuItem key={i} value={`Option ${i + 1}`} label={`Option ${i + 1}`} />
          ))}
        </SynapseDropdownMenu>
      </SynapseDropdown>
      <SynapseDropdown mode="combobox-single">
        <SynapseDropdownMenu showSearch defaultOpen maxHeight={220}>
          <SynapseDropdownTriggerShell size="small" focusVisible left={<span>Small (32)</span>} />
          {Array.from({ length: 6 }, (_, i) => (
            <SynapseDropdownMenuItem key={i} value={`Option ${i + 1}`} label={`Option ${i + 1}`} />
          ))}
        </SynapseDropdownMenu>
      </SynapseDropdown>
    </div>
  ),
};
