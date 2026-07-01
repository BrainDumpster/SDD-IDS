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
  title: "Spec Generated/IDS/Dropdown/Single Select",
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
    const [smallValue, setSmallValue] = useState("Option 2");
    const [sectionValue, setSectionValue] = useState("Option 2");
    const [actionValue, setActionValue] = useState("Option 2");
    const [actionEvent, setActionEvent] = useState("None");

    return (
      <div style={{ width: 1300, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ width: 300, display: "grid", gap: 6 }}>
          <div style={{ color: "var(--annotation)", fontSize: 24 }}>Small menu</div>
          <IdsDropdown mode="single-select" value={smallValue} onValueChange={setSmallValue} showSingleSelectRadio>
            <IdsDropdownMenu defaultOpen maxHeight={220}>
              <IdsDropdownTriggerShell left={<span>{smallValue}</span>} />
              <IdsDropdownMenuItem value="Option 1" label="Option 1" />
              <IdsDropdownMenuItem value="Option 2" label="Option 2" />
              <IdsDropdownMenuItem value="Option 3" label="Option 3" disabled />
              <IdsDropdownMenuItem value="Option 4" label="Option 4" />
            </IdsDropdownMenu>
          </IdsDropdown>
        </div>

        <div style={{ width: 300, display: "grid", gap: 6 }}>
          <div style={{ color: "var(--annotation)", fontSize: 24 }}>Section header</div>
          <IdsDropdown mode="single-select" value={sectionValue} onValueChange={setSectionValue} showSingleSelectRadio>
            <IdsDropdownMenu defaultOpen maxHeight={220}>
              <IdsDropdownTriggerShell left={<span>{sectionValue}</span>} />
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
          <IdsDropdown mode="single-select" value={actionValue} onValueChange={setActionValue} showSingleSelectRadio>
            <IdsDropdownMenu defaultOpen maxHeight={180}>
              <IdsDropdownTriggerShell left={<span>{actionValue}</span>} />
              <IdsDropdownMenuItem value="Option 1" label="Option 1" />
              <IdsDropdownMenuItem value="Option 2" label="Option 2" />
              <IdsDropdownMenuItem value="Option 3" label="Option 3" />
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
  render: () => (
    <div style={{ width: 332, display: "grid", gap: 16 }}>
      <IdsDropdown mode="single-select" value="Option 2">
        <IdsDropdownMenu defaultOpen maxHeight={220}>
          <IdsDropdownTriggerShell left={<span>Option 2</span>} />
          <IdsDropdownMenuItem value="Option 1" label="Option 1" />
          <IdsDropdownMenuItem value="Option 2" label="Option 2" />
        </IdsDropdownMenu>
        <IdsDropdownHelper>Helper text</IdsDropdownHelper>
      </IdsDropdown>

      <IdsDropdown mode="single-select">
        <IdsDropdownMenu>
          <IdsDropdownTriggerShell error left={<span>-Select-</span>} />
          <IdsDropdownMenuItem value="Option 1" label="Option 1" />
        </IdsDropdownMenu>
        <IdsDropdownError>Error message</IdsDropdownError>
      </IdsDropdown>
    </div>
  ),
};
