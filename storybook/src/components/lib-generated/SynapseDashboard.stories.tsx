/**
 * Storybook: design-spec–generated Dashboard from `lib/react/synapse/dashboard`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy (deterministic child order — root is Dashboard / SynapseDashboard, not DashboardRoot):
 *   SynapseDashboard
 *     SynapseDashboardGrid
 *       SynapseDashboardItem+ → SynapseCard (size span-1|2|3, showDivider=showDividerInCard)
 *
 * Theme: components/synapse-theme.css
 * Spec: components/ids/dashboard/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_DASHBOARD_DOCS_DESCRIPTION,
  SYNAPSE_DASHBOARD_SOURCE_CODE,
} from "./synapse-dashboard.developer-usage";
import {
  SynapseCard,
  SynapseCardSecondaryTitle,
  SynapseCardTextContent,
  type SynapseCardMenuOption,
} from "@synapse/react/card";
import {
  SynapseDashboard,
  SynapseDashboardGrid,
  SynapseDashboardItem,
  type SynapseDashboardProps,
} from "@synapse/react/dashboard";

const DESIGN_SPEC_PATH = "components/ids/dashboard/design-spec.md";

const CARD_MENU: SynapseCardMenuOption[] = [
  { value: "edit", label: "Edit" },
  { value: "remove", label: "Remove from dashboard" },
];

const sampleBody = (label: string) => (
  <SynapseCardTextContent sectionTitle={label}>
    Dashboard tile body — IDS Card Content Type=Text sample.
  </SynapseCardTextContent>
);

const meta: Meta<SynapseDashboardProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Dashboard",
  component: SynapseDashboard,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_DASHBOARD_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_DASHBOARD_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    showDividerInCard: { control: "boolean" },
    enableDragAndDrop: { control: "boolean" },
    onCardsReorder: { action: "onCardsReorder" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<SynapseDashboardProps>;

/** Three-column layout with mixed card spans + light nested borders. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    showDividerInCard: true,
    enableDragAndDrop: false,
  },
  render: (args) => (
    <SynapseDashboard {...args}>
      <SynapseCard
        key="alerts"
        title="Widget Title"
        secondaryTitle="Secondary Title"
        headerMeta="Last 24 Hours"
        size="span-1"
        showOverflowMenu
        menuOptions={CARD_MENU}
        showButtons
        actions={[{ id: "a1", label: "Action" }]}
      >
        {sampleBody("Critical events")}
      </SynapseCard>
      <SynapseCard
        key="capacity"
        title="Widget Title"
        secondaryTitle={<SynapseCardSecondaryTitle>Secondary Title</SynapseCardSecondaryTitle>}
        size="span-1"
        showButtons={false}
      >
        {sampleBody("Storage pool")}
      </SynapseCard>
      <SynapseCard
        key="jobs"
        title="Jobs"
        size="span-1"
        showOverflowMenu
        menuOptions={CARD_MENU}
      >
        {sampleBody("Active jobs")}
      </SynapseCard>
      <SynapseCard
        key="health"
        title="Health summary"
        secondaryTitle={<SynapseCardSecondaryTitle>All regions</SynapseCardSecondaryTitle>}
        size="span-2"
        showButtons
        actions={[
          { id: "a1", label: "Action" },
          { id: "a2", label: "Action" },
        ]}
      >
        {sampleBody("Status overview")}
      </SynapseCard>
      <SynapseCard key="notes" title="Notes" size="span-1">
        {sampleBody("Operator notes")}
      </SynapseCard>
      <SynapseCard
        key="timeline"
        title="Timeline"
        secondaryTitle="Full width"
        size="span-3"
      >
        {sampleBody("Recent activity")}
      </SynapseCard>
    </SynapseDashboard>
  ),
};

/**
 * Explicit anatomy slots — same tree the prop-driven Cards path synthesizes:
 * SynapseDashboard → SynapseDashboardGrid → SynapseDashboardItem → SynapseCard.
 */
export const CompoundAnatomy: Story = {
  name: "Compound anatomy slots",
  args: {
    showDividerInCard: true,
    enableDragAndDrop: false,
  },
  render: (args) => (
    <SynapseDashboard {...args}>
      <SynapseDashboardGrid>
        <SynapseDashboardItem itemKey="alerts" size="span-1">
          <SynapseCard
            title="Widget Title"
            secondaryTitle="Secondary Title"
            headerMeta="Last 24 Hours"
            size="span-1"
            showOverflowMenu
            menuOptions={CARD_MENU}
            showButtons
            actions={[{ id: "a1", label: "Action" }]}
          >
            {sampleBody("Critical events")}
          </SynapseCard>
        </SynapseDashboardItem>
        <SynapseDashboardItem itemKey="capacity" size="span-1">
          <SynapseCard
            title="Widget Title"
            secondaryTitle={<SynapseCardSecondaryTitle>Secondary Title</SynapseCardSecondaryTitle>}
            size="span-1"
          >
            {sampleBody("Storage pool")}
          </SynapseCard>
        </SynapseDashboardItem>
        <SynapseDashboardItem itemKey="jobs" size="span-1">
          <SynapseCard title="Jobs" size="span-1" showOverflowMenu menuOptions={CARD_MENU}>
            {sampleBody("Active jobs")}
          </SynapseCard>
        </SynapseDashboardItem>
        <SynapseDashboardItem itemKey="health" size="span-2">
          <SynapseCard
            title="Health summary"
            secondaryTitle={<SynapseCardSecondaryTitle>All regions</SynapseCardSecondaryTitle>}
            size="span-2"
            showButtons
            actions={[
              { id: "a1", label: "Action" },
              { id: "a2", label: "Action" },
            ]}
          >
            {sampleBody("Status overview")}
          </SynapseCard>
        </SynapseDashboardItem>
        <SynapseDashboardItem itemKey="notes" size="span-1">
          <SynapseCard title="Notes" size="span-1">
            {sampleBody("Operator notes")}
          </SynapseCard>
        </SynapseDashboardItem>
        <SynapseDashboardItem itemKey="timeline" size="span-3">
          <SynapseCard title="Timeline" secondaryTitle="Full width" size="span-3">
            {sampleBody("Recent activity")}
          </SynapseCard>
        </SynapseDashboardItem>
      </SynapseDashboardGrid>
    </SynapseDashboard>
  ),
};

/** Same layout with HTML5 drag reorder enabled via `enableDragAndDrop`. */
export const WithDraggableCards: Story = {
  name: "With enableDragAndDrop",
  args: {
    showDividerInCard: true,
    enableDragAndDrop: true,
  },
  render: (args) => (
    <SynapseDashboard {...args}>
      <SynapseCard key="c1" title="Card A" size="span-1">
        {sampleBody("A")}
      </SynapseCard>
      <SynapseCard key="c2" title="Card B" secondaryTitle="Drag me" size="span-1">
        {sampleBody("B")}
      </SynapseCard>
      <SynapseCard key="c3" title="Card C" size="span-1">
        {sampleBody("C")}
      </SynapseCard>
      <SynapseCard key="c4" title="Wide card" size="span-2">
        {sampleBody("Span 2")}
      </SynapseCard>
      <SynapseCard key="c5" title="Narrow" size="span-1">
        {sampleBody("Span 1")}
      </SynapseCard>
    </SynapseDashboard>
  ),
};

/** Nested Cards with body dividers off via Dashboard. */
export const WithoutCardDividers: Story = {
  name: "showDividerInCard false",
  args: {
    showDividerInCard: false,
    enableDragAndDrop: false,
  },
  render: (args) => (
    <SynapseDashboard {...args}>
      <SynapseCard
        key="1"
        title="One"
        size="span-1"
        showButtons
        actions={[{ id: "a1", label: "Action" }]}
      >
        {sampleBody("Column 1")}
      </SynapseCard>
      <SynapseCard key="2" title="Two" size="span-1">
        {sampleBody("Column 2")}
      </SynapseCard>
      <SynapseCard key="3" title="Three" size="span-1">
        {sampleBody("Column 3")}
      </SynapseCard>
    </SynapseDashboard>
  ),
};

/** Simple 3-card grid. */
export const GridOnly: Story = {
  name: "Grid only",
  args: {
    showDividerInCard: true,
    enableDragAndDrop: false,
  },
  render: (args) => (
    <SynapseDashboard {...args}>
      <SynapseCard key="1" title="One" size="span-1">
        {sampleBody("Column 1")}
      </SynapseCard>
      <SynapseCard key="2" title="Two" size="span-1">
        {sampleBody("Column 2")}
      </SynapseCard>
      <SynapseCard key="3" title="Three" size="span-1">
        {sampleBody("Column 3")}
      </SynapseCard>
    </SynapseDashboard>
  ),
};
