import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  IdsDropdown,
  IdsDropdownMenu,
  IdsDropdownMenuFooter,
  IdsDropdownMenuGroup,
  IdsDropdownMenuItem,
  IdsDropdownError,
  IdsDropdownHelper,
  IdsDropdownTriggerShell,
} from "./IdsDropdown";
import { DROPDOWN_DOCS_DESCRIPTION, DROPDOWN_STORY_SOURCE } from "./ids-dropdown.developer-usage";

const meta: Meta<typeof IdsDropdown> = {
  title: "Spec Generated/IDS/Dropdown/Combo Box",
  component: IdsDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: DROPDOWN_DOCS_DESCRIPTION },
      source: { type: "code", language: "tsx", code: DROPDOWN_STORY_SOURCE },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IdsDropdown>;

export const CompositionApi: Story = {
  name: "Composition API",
  render: () => {
    const [selected, setSelected] = useState("Compute");
    return (
      <div style={{ width: 300 }}>
        <IdsDropdown mode="combobox-single" value={selected} onValueChange={setSelected}>
          <IdsDropdownMenu showSearch defaultOpen maxHeight={220}>
            <IdsDropdownTriggerShell
              left={
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selected || "Select product"}
                </span>
              }
            />
            <IdsDropdownMenuItem value="Storage" label="Storage" />
            <IdsDropdownMenuItem value="Compute" label="Compute" />
            <IdsDropdownMenuItem value="Network" label="Network" />
            <IdsDropdownMenuItem value="Security" label="Security" />
          </IdsDropdownMenu>
          <IdsDropdownHelper>Choose one product</IdsDropdownHelper>
        </IdsDropdown>
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
        <IdsDropdown mode="combobox-multi" values={selected} onValuesChange={setSelected}>
          <IdsDropdownMenu
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
            <IdsDropdownTriggerShell
              left={
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selected.length ? selected.join(", ") : "Select products"}
                </span>
              }
            />
            <IdsDropdownMenuItem value="Storage" label="Storage" />
            <IdsDropdownMenuItem value="Compute" label="Compute" />
            <IdsDropdownMenuItem value="Network" label="Network" />
            <IdsDropdownMenuItem value="Security" label="Security" />
          </IdsDropdownMenu>
          <IdsDropdownHelper>Choose one or more products</IdsDropdownHelper>
        </IdsDropdown>
      </div>
    );
  },
};

export const ErrorState: Story = {
  name: "Error State",
  render: () => (
    <div style={{ width: 360 }}>
      <IdsDropdown mode="combobox-single">
        <IdsDropdownMenu showSearch>
          <IdsDropdownTriggerShell error left={<span>-Type or Select-</span>} />
          <IdsDropdownMenuItem value="Storage" label="Storage" />
          <IdsDropdownMenuItem value="Compute" label="Compute" />
        </IdsDropdownMenu>
        <IdsDropdownError>Error message</IdsDropdownError>
      </IdsDropdown>
    </div>
  ),
};

export const DisabledState: Story = {
  name: "Disabled State",
  render: () => (
    <div style={{ width: 360 }}>
      <IdsDropdown mode="combobox-single" disabled value="Storage">
        <IdsDropdownMenu showSearch disabled>
          <IdsDropdownTriggerShell disabled left={<span>Storage</span>} />
          <IdsDropdownMenuItem value="Storage" label="Storage" />
          <IdsDropdownMenuItem value="Compute" label="Compute" />
        </IdsDropdownMenu>
        <IdsDropdownHelper>Component is disabled</IdsDropdownHelper>
      </IdsDropdown>
    </div>
  ),
};
