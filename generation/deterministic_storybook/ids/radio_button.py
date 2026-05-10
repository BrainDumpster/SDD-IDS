from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import pascal_from_slug, prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_radio_button_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("radio-button", options.component_prefix)
    import_path = "../../../../storybook/src/components/RadioButton"
    base_component_name = pascal_from_slug("radio-button")

    template = """import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { __BASE_COMPONENT__ as __COMPONENT__ } from "__IMPORT_PATH__";

const defaultOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const meta: Meta<typeof __COMPONENT__> = {
  title: "__TITLE_PREFIX__/Radio Button",
  component: __COMPONENT__,
  parameters: { layout: "centered" },
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    disabled: { control: "boolean" },
  },
  args: {
    name: "ids-radio-default",
    options: defaultOptions,
    defaultValue: "option1",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof __COMPONENT__>;

export const Playground: Story = {
  render: (args) => <__COMPONENT__ {...args} />,
};

export const SelectionStates: Story = {
  render: () => (
    <div className="sbRadioRow">
      <__COMPONENT__
        name="ids-radio-unselected"
        options={[
          { value: "default", label: "Default" },
          { value: "hover", label: "Hover", simulatedState: "hover" },
          { value: "disabled", label: "Disabled", disabled: true },
        ]}
      />
      <__COMPONENT__
        name="ids-radio-selected"
        options={[
          { value: "default", label: "Default" },
          { value: "hover", label: "Hover", simulatedState: "hover" },
          { value: "disabled", label: "Disabled", disabled: true },
        ]}
        defaultValue="default"
      />
    </div>
  ),
};

export const SelectedDisabled: Story = {
  render: () => (
    <__COMPONENT__
      name="ids-radio-selected-disabled-only"
      options={[{ value: "selected-disabled", label: "Selected + Disabled", disabled: true }]}
      defaultValue="selected-disabled"
    />
  ),
};

export const ErrorAndHelperText: Story = {
  render: () => (
    <div className="sbRadioCol">
      <__COMPONENT__
        name="ids-radio-helper"
        options={[
          { value: "option1", label: "Option 1", helperText: "Recommended option." },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
        defaultValue="option1"
      />
      <__COMPONENT__
        name="ids-radio-error"
        options={[
          { value: "option1", label: "Option 1", error: true, helperText: "Error message" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
        defaultValue="option1"
      />
    </div>
  ),
};

export const ControlledExample: Story = {
  render: () => {
    const [selected, setSelected] = useState("option1");
    return (
      <div className="sbRadioCol">
        <__COMPONENT__
          name="ids-radio-controlled"
          value={selected}
          onChange={setSelected}
          options={defaultOptions}
        />
        <div className="sbValueText">Selected value: {selected}</div>
      </div>
    );
  },
};

export const StateHarness: Story = {
  render: () => (
    <div className="sbRadioHarness">
      <div className="sbRadioLegend">Interaction references: default | hover | focus-visible | disabled</div>
      <div className="sbRadioTitle">Unselected</div>
      <__COMPONENT__
        name="ids-radio-harness-unselected"
        options={[
          { value: "default", label: "Default" },
          { value: "hover", label: "Hover", simulatedState: "hover" },
          { value: "focus", label: "Focus-visible", simulatedState: "focus-visible" },
          { value: "disabled", label: "Disabled", disabled: true },
        ]}
      />
      <div className="sbRadioTitle">Selected</div>
      <__COMPONENT__
        name="ids-radio-harness-selected"
        options={[
          { value: "default", label: "Default" },
          { value: "hover", label: "Hover", simulatedState: "hover" },
          { value: "focus", label: "Focus-visible", simulatedState: "focus-visible" },
          { value: "disabled", label: "Disabled", disabled: true },
        ]}
        defaultValue="default"
      />
      <div className="sbRadioTitle">Selected + Disabled</div>
      <__COMPONENT__
        name="ids-radio-harness-selected-disabled"
        options={[
          { value: "selected-disabled", label: "Selected + Disabled", disabled: true },
        ]}
        defaultValue="selected-disabled"
      />
      <div className="sbRadioTitle">Error</div>
      <__COMPONENT__
        name="ids-radio-harness-error"
        options={[
          { value: "default", label: "Default", error: true, helperText: "Error message" },
          { value: "hover", label: "Hover", error: true, helperText: "Error message", simulatedState: "hover" },
          { value: "focus", label: "Focus-visible", error: true, helperText: "Error message", simulatedState: "focus-visible" },
          { value: "disabled", label: "Disabled", disabled: true, error: true, helperText: "Error message" },
        ]}
      />
    </div>
  ),
};

export const LayoutTokens: Story = {
  render: () => (
    <style>{
      `
      .sbRadioRow {
        display: flex;
        gap: 28px;
        flex-wrap: wrap;
        align-items: flex-start;
      }
      .sbRadioCol {
        display: grid;
        gap: 16px;
      }
      .sbRadioHarness {
        display: grid;
        gap: 16px;
        min-width: 540px;
      }
      .sbRadioLegend {
        font-size: 13px;
        line-height: 20px;
      }
      .sbRadioTitle {
        font-size: 12px;
        opacity: 0.8;
      }
      .sbValueText {
        font-size: 14px;
      }
      `
    }</style>
  ),
};
"""

    return (
        template
        .replace("__BASE_COMPONENT__", base_component_name)
        .replace("__COMPONENT__", component_name)
        .replace("__IMPORT_PATH__", import_path)
        .replace("__TITLE_PREFIX__", options.title_prefix)
    )
