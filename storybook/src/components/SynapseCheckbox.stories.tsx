import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import {
  CHECKBOX_MATRIX_LABEL,
  CHECKBOX_SPEC_ACCURATE_DEFAULTS,
  CHECKBOX_SPEC_SAMPLE_LABEL,
} from "@component-contracts/ids/checkbox.contract";
import { SynapseCheckbox } from "./SynapseCheckbox";
import {
  SYNAPSE_CHECKBOX_DESIGN_SPEC_PATH,
  SYNAPSE_CHECKBOX_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_CHECKBOX_STATE_MATRIX_NODE_ID,
} from "../spec-contracts/synapse-checkbox.contract";

const HARNESS_OPTION_LABEL = CHECKBOX_MATRIX_LABEL;

const sharedCheckboxStoryStyles = `
  .sbCheckboxRow {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .sbCheckboxCol {
    display: grid;
    gap: 20px;
  }
  .sbHarness {
    display: grid;
    grid-template-columns: 118px repeat(5, minmax(132px, max-content));
    gap: 16px 22px;
    align-items: start;
  }
  .sbHarnessLegend {
    grid-column: 1 / -1;
    font-size: 13px;
    line-height: 1.45;
    margin: 0 0 10px;
    max-width: 800px;
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
`;

const meta: Meta<typeof SynapseCheckbox> = {
  title: "Components/Synapse/Checkbox",
  component: SynapseCheckbox,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Checkbox (IDS-fork). Source: \`${SYNAPSE_CHECKBOX_DESIGN_SPEC_PATH}\`.`,
          `Composition: single \`checkboxItem\` rows; group layout via repeated items (IDS \`CheckboxGroup\` contract).`,
          `Primary story: **Spec Accurate Design** (Figma \`${SYNAPSE_CHECKBOX_SPEC_ACCURATE_NODE_ID}\`).`,
        ].join(" "),
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <style>{sharedCheckboxStoryStyles}</style>
        <Story />
      </>
    ),
  ],
  argTypes: {
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
    error: { control: "boolean" },
    helperText: { control: "text" },
    onChange: { action: "onChange" },
  },
  args: {
    label: CHECKBOX_SPEC_ACCURATE_DEFAULTS.label,
    checked: CHECKBOX_SPEC_ACCURATE_DEFAULTS.checked,
    indeterminate: CHECKBOX_SPEC_ACCURATE_DEFAULTS.indeterminate,
    disabled: CHECKBOX_SPEC_ACCURATE_DEFAULTS.disabled,
    error: CHECKBOX_SPEC_ACCURATE_DEFAULTS.error,
  },
};

export default meta;
type Story = StoryObj<typeof SynapseCheckbox>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  args: { label: CHECKBOX_SPEC_SAMPLE_LABEL },
};

export const Default: Story = {
  args: { label: CHECKBOX_SPEC_SAMPLE_LABEL },
};

export const SelectionStates: Story = {
  render: () => (
    <div className="sbCheckboxRow">
      <SynapseCheckbox label={CHECKBOX_SPEC_SAMPLE_LABEL} />
      <SynapseCheckbox label={CHECKBOX_SPEC_SAMPLE_LABEL} checked />
      <SynapseCheckbox label={CHECKBOX_SPEC_SAMPLE_LABEL} indeterminate />
    </div>
  ),
};

export const FigmaMainMatrix: Story = {
  render: () => (
    <div className="sbHarness">
      <div className="sbHarnessLegend">
        Rows: Unchecked, Checked, Partial. Columns: Default, Hover (pointer), Focus (
        <code>simulateFocusVisible</code>
        ), Disabled, Error. Matrix node `{SYNAPSE_CHECKBOX_STATE_MATRIX_NODE_ID}`.
      </div>
      <div className="sbHarnessCorner" />
      <div className="sbHarnessHeader">Default</div>
      <div className="sbHarnessHeader">Hover</div>
      <div className="sbHarnessHeader">Focus</div>
      <div className="sbHarnessHeader">Disabled</div>
      <div className="sbHarnessHeader">Error</div>

      <div className="sbHarnessTitle">Unchecked</div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} />
      </div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} />
        <span className="sbHarnessHint">Hover the control for strong border.</span>
      </div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} simulateFocusVisible />
      </div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} disabled />
      </div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} error helperText="Error message" />
      </div>

      <div className="sbHarnessTitle">Checked</div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} checked />
      </div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} checked />
        <span className="sbHarnessHint">Hover for brand-strong fill.</span>
      </div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} checked simulateFocusVisible />
      </div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} checked disabled />
      </div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} checked error helperText="Error message" />
      </div>

      <div className="sbHarnessTitle">Partial</div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} indeterminate />
      </div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} indeterminate />
        <span className="sbHarnessHint">Hover for strong border; dash stays brand.</span>
      </div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} indeterminate simulateFocusVisible />
      </div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} indeterminate disabled />
      </div>
      <div className="sbHarnessControl">
        <SynapseCheckbox label={HARNESS_OPTION_LABEL} indeterminate error helperText="Error message" />
      </div>
    </div>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <div className="sbCheckboxRow">
      <SynapseCheckbox label={CHECKBOX_SPEC_SAMPLE_LABEL} disabled />
      <SynapseCheckbox label={CHECKBOX_SPEC_SAMPLE_LABEL} checked disabled />
      <SynapseCheckbox label={CHECKBOX_SPEC_SAMPLE_LABEL} indeterminate disabled />
    </div>
  ),
};

export const ValidationAndHelperText: Story = {
  render: () => (
    <div className="sbCheckboxCol">
      <SynapseCheckbox label="Email notifications" helperText="Receive weekly summary updates." />
      <SynapseCheckbox
        label="Required acknowledgement"
        error
        helperText="You must accept this option to continue."
      />
      <SynapseCheckbox label="Disabled option" disabled helperText="This option is unavailable for your role." />
      <SynapseCheckbox
        label="Checked with validation error"
        checked
        error
        helperText="Error message only — control keeps selected styling."
      />
    </div>
  ),
};

export const ControlledExample: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="sbCheckboxCol">
        <SynapseCheckbox
          label="Controlled checkbox"
          checked={checked}
          helperText={`Current value: ${checked ? "checked" : "unchecked"}`}
          onChange={setChecked}
        />
      </div>
    );
  },
};
