import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import { RADIO_BUTTON_SPEC_DEMO_OPTIONS } from "@component-contracts/ids/radio-button.contract";
import { SynapseRadioButton } from "./SynapseRadioButton";
import {
  SYNAPSE_RADIO_BUTTON_DESIGN_SPEC_PATH,
  SYNAPSE_RADIO_BUTTON_SAMPLE_LABEL,
  SYNAPSE_RADIO_BUTTON_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_RADIO_BUTTON_STATE_MATRIX_NODE_ID,
} from "../spec-contracts/synapse-radio-button.contract";

const defaultOptions = [...RADIO_BUTTON_SPEC_DEMO_OPTIONS];
const FIGMA_OPTION_LABEL = SYNAPSE_RADIO_BUTTON_SAMPLE_LABEL;
const MATRIX_VALUE = "v";

const sharedRadioStoryStyles = `
  .sbRadioRow {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .sbRadioCol {
    display: grid;
    gap: 20px;
  }
  .sbRadioMatrixSection {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 200px;
  }
  .sbRadioSectionTitle {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0;
    opacity: 0.72;
    border-bottom: 1px solid var(--color-border-accessible, #757575);
    padding-bottom: 8px;
  }
  .sbHarness {
    display: grid;
    grid-template-columns: 118px repeat(4, minmax(132px, max-content));
    gap: 16px 22px;
    align-items: start;
  }
  .sbHarnessLegend {
    grid-column: 1 / -1;
    font-size: 13px;
    line-height: 1.45;
    margin: 0 0 10px;
    max-width: 860px;
  }
  .sbHarnessCorner {
    min-height: 4px;
  }
  .sbHarnessHeader {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.72;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--color-border-accessible, #757575);
  }
  .sbHarnessTitle {
    font-size: 12px;
    font-weight: 600;
    opacity: 0.85;
    padding-top: 6px;
  }
  .sbHarnessControl {
    display: flex;
    flex-direction: column;
    gap: 6px;
    justify-content: flex-start;
    min-height: 40px;
  }
  .sbHarnessHint {
    font-size: 10px;
    line-height: 1.25;
    opacity: 0.62;
    max-width: 152px;
  }
  .sbValueText {
    font-size: 14px;
    line-height: 1.4;
  }
`;

const meta: Meta<typeof SynapseRadioButton> = {
  title: "Components/Synapse/Radio Button",
  component: SynapseRadioButton,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Radio Button (IDS-fork). Source: \`${SYNAPSE_RADIO_BUTTON_DESIGN_SPEC_PATH}\`.`,
          `Composition: \`RadioButtonGroup\` + projected items; Storybook uses legacy \`options[]\` wrapper mapping to group/item anatomy.`,
          `Primary story: **Spec Accurate Design** (Figma \`${SYNAPSE_RADIO_BUTTON_SPEC_ACCURATE_NODE_ID}\`).`,
        ].join(" "),
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <style>{sharedRadioStoryStyles}</style>
        <Story />
      </>
    ),
  ],
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    onChange: { action: "onChange" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseRadioButton>;

export const SpecAccurateDefault: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  args: {
    name: "synapse-radio-spec-accurate",
    options: [{ value: "a", label: FIGMA_OPTION_LABEL }],
    defaultValue: "",
  },
};

export const Default: Story = {
  args: {
    name: "synapse-radio-default",
    options: defaultOptions,
    defaultValue: "option1",
  },
};

export const SelectionStates: Story = {
  render: () => (
    <div className="sbRadioRow">
      <div className="sbRadioMatrixSection">
        <h3 className="sbRadioSectionTitle">No selection</h3>
        <SynapseRadioButton
          name="synapse-radio-sel-none"
          options={[
            { value: "a", label: FIGMA_OPTION_LABEL },
            { value: "b", label: `${FIGMA_OPTION_LABEL} B` },
            { value: "c", label: `${FIGMA_OPTION_LABEL} C` },
          ]}
        />
      </div>
      <div className="sbRadioMatrixSection">
        <h3 className="sbRadioSectionTitle">With selection</h3>
        <SynapseRadioButton
          name="synapse-radio-sel-one"
          defaultValue="a"
          options={[
            { value: "a", label: FIGMA_OPTION_LABEL },
            { value: "b", label: `${FIGMA_OPTION_LABEL} B` },
            { value: "c", label: `${FIGMA_OPTION_LABEL} C` },
          ]}
        />
      </div>
    </div>
  ),
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ fontSize: 12, color: "var(--color-text-neutral-strong)" }}>
        Matrix node `{SYNAPSE_RADIO_BUTTON_STATE_MATRIX_NODE_ID}` — hover the Hover row; Focus column uses simulatedState.
      </div>
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-start" }}>
        <SynapseRadioButton
          name="synapse-radio-unselected"
          options={[
            { value: "default", label: "Default" },
            { value: "hover", label: "Hover" },
            { value: "focus", label: "Focus", simulatedState: "focus-visible" },
            { value: "disabled", label: "Disabled", disabled: true },
          ]}
        />
        <SynapseRadioButton
          name="synapse-radio-selected"
          options={[
            { value: "default", label: "Default" },
            { value: "hover", label: "Hover" },
            { value: "focus", label: "Focus", simulatedState: "focus-visible" },
            { value: "disabled", label: "Disabled", disabled: true },
          ]}
          defaultValue="default"
        />
        <SynapseRadioButton
          name="synapse-radio-selected-disabled"
          options={[
            { value: "selected-disabled", label: "Selected + Disabled", disabled: true },
            { value: "other", label: "Other" },
          ]}
          defaultValue="selected-disabled"
        />
      </div>
    </div>
  ),
};

export const StateHarness: Story = {
  render: () => (
    <div className="sbHarness">
      <div className="sbHarnessLegend">
        Each cell is a single-option group. Columns: Default, Hover (pointer), Focus (
        <code>simulatedState</code>), Disabled.
      </div>
      <div className="sbHarnessCorner" />
      <div className="sbHarnessHeader">Default</div>
      <div className="sbHarnessHeader">Hover</div>
      <div className="sbHarnessHeader">Focus</div>
      <div className="sbHarnessHeader">Disabled</div>

      <div className="sbHarnessTitle">Unselected</div>
      <div className="sbHarnessControl">
        <SynapseRadioButton name="syn-rh-u-def" options={[{ value: MATRIX_VALUE, label: FIGMA_OPTION_LABEL }]} />
      </div>
      <div className="sbHarnessControl">
        <SynapseRadioButton name="syn-rh-u-hov" options={[{ value: MATRIX_VALUE, label: FIGMA_OPTION_LABEL }]} />
        <span className="sbHarnessHint">Hover the radio.</span>
      </div>
      <div className="sbHarnessControl">
        <SynapseRadioButton
          name="syn-rh-u-foc"
          options={[{ value: MATRIX_VALUE, label: FIGMA_OPTION_LABEL, simulatedState: "focus-visible" }]}
        />
      </div>
      <div className="sbHarnessControl">
        <SynapseRadioButton
          name="syn-rh-u-dis"
          options={[{ value: MATRIX_VALUE, label: FIGMA_OPTION_LABEL, disabled: true }]}
        />
      </div>

      <div className="sbHarnessTitle">Selected</div>
      <div className="sbHarnessControl">
        <SynapseRadioButton
          name="syn-rh-s-def"
          defaultValue={MATRIX_VALUE}
          options={[{ value: MATRIX_VALUE, label: FIGMA_OPTION_LABEL }]}
        />
      </div>
      <div className="sbHarnessControl">
        <SynapseRadioButton
          name="syn-rh-s-hov"
          defaultValue={MATRIX_VALUE}
          options={[{ value: MATRIX_VALUE, label: FIGMA_OPTION_LABEL }]}
        />
        <span className="sbHarnessHint">Hover for strong border + dot.</span>
      </div>
      <div className="sbHarnessControl">
        <SynapseRadioButton
          name="syn-rh-s-foc"
          defaultValue={MATRIX_VALUE}
          options={[{ value: MATRIX_VALUE, label: FIGMA_OPTION_LABEL, simulatedState: "focus-visible" }]}
        />
      </div>
      <div className="sbHarnessControl">
        <SynapseRadioButton
          name="syn-rh-s-dis"
          defaultValue={MATRIX_VALUE}
          options={[{ value: MATRIX_VALUE, label: FIGMA_OPTION_LABEL, disabled: true }]}
        />
      </div>
    </div>
  ),
};

export const ValidationAndHelperText: Story = {
  render: () => (
    <div className="sbRadioCol">
      <SynapseRadioButton
        name="synapse-radio-helper"
        options={[
          { value: "option1", label: "Option 1", helperText: "Recommended option." },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
        defaultValue="option1"
      />
      <SynapseRadioButton
        name="synapse-radio-error-unselected"
        options={[
          {
            value: "option1",
            label: "Option 1",
            error: true,
            helperText: "Error message — ring stays strong border, not critical red.",
          },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
      />
      <SynapseRadioButton
        name="synapse-radio-error-selected"
        options={[
          {
            value: "option1",
            label: "Option 1",
            error: true,
            helperText: "Error message only — selected dot keeps brand tokens.",
          },
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
        <SynapseRadioButton
          name="synapse-radio-controlled"
          value={selected}
          onChange={setSelected}
          options={defaultOptions}
        />
        <div className="sbValueText">Selected value: {selected}</div>
      </div>
    );
  },
};
