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
  title: "Spec Generated/IDS/Dropdown/Multi Select",
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

const sixOptions = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6"];
const twelveOptions = Array.from({ length: 12 }, (_, i) => `Option ${i + 1}`);

export const CompositionApi: Story = {
  name: "Composition API",
  render: () => {
    const [smallSelected, setSmallSelected] = useState<string[]>([]);
    const [sectionSelected, setSectionSelected] = useState<string[]>(["Option 2"]);
    const [actionSelected, setActionSelected] = useState<string[]>(["Option 2"]);
    const [actionEvent, setActionEvent] = useState("None");

    return (
      <div style={{ width: 1350, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ width: 300, display: "grid", gap: 6 }}>
          <div style={{ color: "var(--annotation)", fontSize: 24 }}>No items selected</div>
          <IdsDropdown mode="multi-select" values={smallSelected} onValuesChange={setSmallSelected}>
            <IdsDropdownMenu
              defaultOpen
              maxHeight={220}
              showSelectAllClearAll
              selectAllChecked={smallSelected.length === 6}
              selectAllIndeterminate={smallSelected.length > 0 && smallSelected.length < 6}
              onSelectAllClick={() => setSmallSelected([...sixOptions])}
              onClearAllClick={() => setSmallSelected([])}
              clearAllDisabled={smallSelected.length === 0}
            >
              <IdsDropdownTriggerShell
                left={<span>{smallSelected.length ? smallSelected.join(", ") : "-Select-"}</span>}
              />
              {sixOptions.map((label) => (
                <IdsDropdownMenuItem key={label} value={label} label={label} />
              ))}
            </IdsDropdownMenu>
          </IdsDropdown>
        </div>

        <div style={{ width: 300, display: "grid", gap: 6 }}>
          <div style={{ color: "var(--annotation)", fontSize: 24 }}>Section headers</div>
          <IdsDropdown mode="multi-select" values={sectionSelected} onValuesChange={setSectionSelected}>
            <IdsDropdownMenu
              defaultOpen
              maxHeight={220}
              showSelectAllClearAll
              onSelectAllClick={() => setSectionSelected([...sixOptions])}
              onClearAllClick={() => setSectionSelected([])}
              clearAllDisabled={sectionSelected.length === 0}
            >
              <IdsDropdownTriggerShell left={<span>{sectionSelected.join(", ") || "-Select-"}</span>} />
              <IdsDropdownMenuGroup groupName="Section Title">
                <IdsDropdownMenuItem value="Option 1" label="Option 1" />
                <IdsDropdownMenuItem value="Option 2" label="Option 2" />
                <IdsDropdownMenuItem value="Option 3" label="Option 3" />
              </IdsDropdownMenuGroup>
              <IdsDropdownMenuGroup groupName="Section Title">
                <IdsDropdownMenuItem value="Option 4" label="Option 4" />
                <IdsDropdownMenuItem value="Option 5" label="Option 5" />
                <IdsDropdownMenuItem value="Option 6" label="Option 6" />
              </IdsDropdownMenuGroup>
            </IdsDropdownMenu>
          </IdsDropdown>
        </div>

        <div style={{ width: 300, display: "grid", gap: 6 }}>
          <div style={{ color: "var(--annotation)", fontSize: 24 }}>Action button</div>
          <IdsDropdown mode="multi-select" values={actionSelected} onValuesChange={setActionSelected}>
            <IdsDropdownMenu
              defaultOpen
              maxHeight={180}
              showSelectAllClearAll
              onSelectAllClick={() => setActionSelected([...twelveOptions])}
              onClearAllClick={() => setActionSelected([])}
              clearAllDisabled={actionSelected.length === 0}
            >
              <IdsDropdownTriggerShell left={<span>{actionSelected.join(", ")}</span>} />
              {twelveOptions.map((label) => (
                <IdsDropdownMenuItem key={label} value={label} label={label} />
              ))}
              <IdsDropdownMenuFooter actionLabel="Action" onAction={() => setActionEvent("Action clicked")} />
            </IdsDropdownMenu>
            <IdsDropdownHelper>onActionClick: {actionEvent}</IdsDropdownHelper>
          </IdsDropdown>
        </div>
      </div>
    );
  },
};

export const HelperError: Story = {
  name: "Helper + Error",
  render: () => {
    const [selected, setSelected] = useState<string[]>(["Option 1", "Option 2"]);
    return (
      <div style={{ width: 640, display: "flex", gap: 16 }}>
        <div style={{ width: 300 }}>
          <IdsDropdown mode="multi-select" values={selected} onValuesChange={setSelected} disabled>
            <IdsDropdownMenu showSelectAllClearAll disabled onClearAllClick={() => setSelected([])}>
              <IdsDropdownTriggerShell disabled left={<span>Items selected</span>} />
              <IdsDropdownMenuItem value="Option 1" label="Option 1" />
              <IdsDropdownMenuItem value="Option 2" label="Option 2" />
            </IdsDropdownMenu>
            <IdsDropdownHelper>Helper text</IdsDropdownHelper>
          </IdsDropdown>
        </div>
        <div style={{ width: 300 }}>
          <IdsDropdown mode="multi-select" values={selected} onValuesChange={setSelected}>
            <IdsDropdownMenu showSelectAllClearAll>
              <IdsDropdownTriggerShell error left={<span>Items selected</span>} />
              <IdsDropdownMenuItem value="Option 1" label="Option 1" />
              <IdsDropdownMenuItem value="Option 2" label="Option 2" />
            </IdsDropdownMenu>
            <IdsDropdownError>Error message</IdsDropdownError>
          </IdsDropdown>
        </div>
      </div>
    );
  },
};
