/* @generated — Synapse IDS-fork Datagrid stories (composition API + synapse theme) */
import "../../../../components/ids-theme.css";
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import {
  DATAGRID_SPEC_ACCURATE_DEFAULTS,
  DATAGRID_SPEC_COLUMNS,
  DATAGRID_SPEC_ROWS,
  IDS_DATAGRID_DESIGN_SPEC_PATH,
} from "@component-contracts/ids/datagrid.contract";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import { IdsDataGridCompositionStory } from "../../../../storybook/src/components/IdsDataGridCompositionStory";

const meta: Meta<typeof IdsDataGridCompositionStory> = {
  title: "Spec Generated/Synapse/Datagrid",
  component: IdsDataGridCompositionStory,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          `Synapse programme Datagrid — inherits IDS composition contract from \`${IDS_DATAGRID_DESIGN_SPEC_PATH}\`.`,
          "Theme: `components/synapse-theme.css` layered on IDS implementation.",
          "Composition: `IdsDataGridComposed` → projected `IdsDataGridColumn` / `IdsDataGridRow` / `IdsDataGridCell`.",
        ].join(" "),
      },
    },
  },
  args: {
    ...DATAGRID_SPEC_ACCURATE_DEFAULTS,
    columns: DATAGRID_SPEC_COLUMNS,
    rows: DATAGRID_SPEC_ROWS,
    wireDefaultFilters: true,
  },
};

export default meta;
type Story = StoryObj<typeof IdsDataGridCompositionStory>;

function SynapseFrame(props: ComponentProps<typeof IdsDataGridCompositionStory>) {
  return (
    <div
      data-design-system="synapse"
      style={{
        width: "100%",
        height: "100dvh",
        boxSizing: "border-box",
        padding: "clamp(8px, 2vw, 16px)",
        background: "var(--color-background-surface-1)",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        minWidth: 0,
      }}
    >
      <div style={{ flex: 1, minHeight: 0, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <IdsDataGridCompositionStory {...props} />
      </div>
    </div>
  );
}

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: (args) => <SynapseFrame {...args} />,
};

export const CompositionApi: Story = {
  name: "Composition API",
  render: (args) => <SynapseFrame {...args} />,
};

export const HeaderMinimal: Story = {
  render: (args) => <SynapseFrame {...args} headerColorAndBorder={false} />,
};

export const ReadOnlyTableHover: Story = {
  render: (args) => <SynapseFrame {...args} readOnly />,
};
