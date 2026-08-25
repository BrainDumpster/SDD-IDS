/**
 * Storybook: design-spec–generated Dashboard from `lib/react/ids/dashboard`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy (deterministic child order — root is Dashboard / IdsDashboard, not DashboardRoot):
 *   IdsDashboard
 *     IdsDashboardGrid
 *       IdsDashboardItem+ → IdsCard (size span-1|2|3, showDivider=showDividerInCard)
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/dashboard/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  DASHBOARD_DOCS_DESCRIPTION,
  DASHBOARD_SOURCE_CODE,
} from "./ids-dashboard.developer-usage";
import {
  IdsCard,
  IdsCardSecondaryTitle,
  IdsCardTextContent,
  type IdsCardMenuOption,
} from "@ids/react/card";
import {
  IdsDashboard,
  IdsDashboardGrid,
  IdsDashboardItem,
  type IdsDashboardProps,
} from "@ids/react/dashboard";

const DESIGN_SPEC_PATH = "components/ids/dashboard/design-spec.md";

const CARD_MENU: IdsCardMenuOption[] = [
  { value: "edit", label: "Edit" },
  { value: "remove", label: "Remove from dashboard" },
];

const sampleBody = (label: string) => (
  <IdsCardTextContent sectionTitle={label}>
    Dashboard tile body — IDS Card Content Type=Text sample.
  </IdsCardTextContent>
);

const meta: Meta<IdsDashboardProps> = {
  tags: ["autodocs"],
  title: "Components/IDS/Dashboard",
  component: IdsDashboard,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: DASHBOARD_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: DASHBOARD_SOURCE_CODE,
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
type Story = StoryObj<IdsDashboardProps>;

/** Three-column layout with mixed card spans + light nested borders. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    showDividerInCard: true,
    enableDragAndDrop: false,
  },
  render: (args) => (
    <IdsDashboard {...args}>
      <IdsCard
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
      </IdsCard>
      <IdsCard
        key="capacity"
        title="Widget Title"
        secondaryTitle={<IdsCardSecondaryTitle>Secondary Title</IdsCardSecondaryTitle>}
        size="span-1"
        showButtons={false}
      >
        {sampleBody("Storage pool")}
      </IdsCard>
      <IdsCard
        key="jobs"
        title="Jobs"
        size="span-1"
        showOverflowMenu
        menuOptions={CARD_MENU}
      >
        {sampleBody("Active jobs")}
      </IdsCard>
      <IdsCard
        key="health"
        title="Health summary"
        secondaryTitle={<IdsCardSecondaryTitle>All regions</IdsCardSecondaryTitle>}
        size="span-2"
        showButtons
        actions={[
          { id: "a1", label: "Action" },
          { id: "a2", label: "Action" },
        ]}
      >
        {sampleBody("Status overview")}
      </IdsCard>
      <IdsCard key="notes" title="Notes" size="span-1">
        {sampleBody("Operator notes")}
      </IdsCard>
      <IdsCard
        key="timeline"
        title="Timeline"
        secondaryTitle="Full width"
        size="span-3"
      >
        {sampleBody("Recent activity")}
      </IdsCard>
    </IdsDashboard>
  ),
};

/**
 * Explicit anatomy slots — same tree the prop-driven Cards path synthesizes:
 * IdsDashboard → IdsDashboardGrid → IdsDashboardItem → IdsCard.
 */
export const CompoundAnatomy: Story = {
  name: "Compound anatomy slots",
  args: {
    showDividerInCard: true,
    enableDragAndDrop: false,
  },
  render: (args) => (
    <IdsDashboard {...args}>
      <IdsDashboardGrid>
        <IdsDashboardItem itemKey="alerts" size="span-1">
          <IdsCard
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
          </IdsCard>
        </IdsDashboardItem>
        <IdsDashboardItem itemKey="capacity" size="span-1">
          <IdsCard
            title="Widget Title"
            secondaryTitle={<IdsCardSecondaryTitle>Secondary Title</IdsCardSecondaryTitle>}
            size="span-1"
          >
            {sampleBody("Storage pool")}
          </IdsCard>
        </IdsDashboardItem>
        <IdsDashboardItem itemKey="jobs" size="span-1">
          <IdsCard title="Jobs" size="span-1" showOverflowMenu menuOptions={CARD_MENU}>
            {sampleBody("Active jobs")}
          </IdsCard>
        </IdsDashboardItem>
        <IdsDashboardItem itemKey="health" size="span-2">
          <IdsCard
            title="Health summary"
            secondaryTitle={<IdsCardSecondaryTitle>All regions</IdsCardSecondaryTitle>}
            size="span-2"
            showButtons
            actions={[
              { id: "a1", label: "Action" },
              { id: "a2", label: "Action" },
            ]}
          >
            {sampleBody("Status overview")}
          </IdsCard>
        </IdsDashboardItem>
        <IdsDashboardItem itemKey="notes" size="span-1">
          <IdsCard title="Notes" size="span-1">
            {sampleBody("Operator notes")}
          </IdsCard>
        </IdsDashboardItem>
        <IdsDashboardItem itemKey="timeline" size="span-3">
          <IdsCard title="Timeline" secondaryTitle="Full width" size="span-3">
            {sampleBody("Recent activity")}
          </IdsCard>
        </IdsDashboardItem>
      </IdsDashboardGrid>
    </IdsDashboard>
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
    <IdsDashboard {...args}>
      <IdsCard key="c1" title="Card A" size="span-1">
        {sampleBody("A")}
      </IdsCard>
      <IdsCard key="c2" title="Card B" secondaryTitle="Drag me" size="span-1">
        {sampleBody("B")}
      </IdsCard>
      <IdsCard key="c3" title="Card C" size="span-1">
        {sampleBody("C")}
      </IdsCard>
      <IdsCard key="c4" title="Wide card" size="span-2">
        {sampleBody("Span 2")}
      </IdsCard>
      <IdsCard key="c5" title="Narrow" size="span-1">
        {sampleBody("Span 1")}
      </IdsCard>
    </IdsDashboard>
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
    <IdsDashboard {...args}>
      <IdsCard
        key="1"
        title="One"
        size="span-1"
        showButtons
        actions={[{ id: "a1", label: "Action" }]}
      >
        {sampleBody("Column 1")}
      </IdsCard>
      <IdsCard key="2" title="Two" size="span-1">
        {sampleBody("Column 2")}
      </IdsCard>
      <IdsCard key="3" title="Three" size="span-1">
        {sampleBody("Column 3")}
      </IdsCard>
    </IdsDashboard>
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
    <IdsDashboard {...args}>
      <IdsCard key="1" title="One" size="span-1">
        {sampleBody("Column 1")}
      </IdsCard>
      <IdsCard key="2" title="Two" size="span-1">
        {sampleBody("Column 2")}
      </IdsCard>
      <IdsCard key="3" title="Three" size="span-1">
        {sampleBody("Column 3")}
      </IdsCard>
    </IdsDashboard>
  ),
};
