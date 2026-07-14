import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardSecondaryTitle, CardTextContent } from "./Card";
import { Dashboard } from "./Dashboard";

const DESIGN_SPEC_PATH = "components/ids/dashboard/design-spec.md";

const CARD_MENU = [
  { value: "edit", label: "Edit" },
  { value: "remove", label: "Remove from dashboard" },
];

const sampleBody = (label: string) => (
  <CardTextContent sectionTitle={label}>
    Dashboard tile body — IDS Card Content Type=Text sample.
  </CardTextContent>
);

const meta: Meta<typeof Dashboard> = {
  title: "Spec Generated/IDS/Dashboard",
  component: Dashboard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `IDS Dashboard wrapper. Source: \`${DESIGN_SPEC_PATH}\`.`,
          "Holds a responsive grid of IDS Cards (1 → 2 → 3 columns by viewport).",
          "Page title and page-level actions are owned by the host layout (not Dashboard).",
          "Optional `enableDragAndDrop` (makes Cards draggable).",
          "Card `size`: `span-1` (default) | `span-2` | `span-3` (remapped on smaller breakpoints).",
          "`--card-min-width` preferred floor is overridable later.",
        ].join(" "),
      },
    },
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
type Story = StoryObj<typeof Dashboard>;

/** Three-column layout with mixed card spans. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    enableDragAndDrop: false,
  },
  render: (args) => (
    <Dashboard {...args}>
      <Card
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
      </Card>
      <Card
        key="capacity"
        title="Widget Title"
        secondaryTitle={<CardSecondaryTitle>Secondary Title</CardSecondaryTitle>}
        size="span-1"
        showButtons={false}
      >
        {sampleBody("Storage pool")}
      </Card>
      <Card
        key="jobs"
        title="Jobs"
        size="span-1"
        showOverflowMenu
        menuOptions={CARD_MENU}
      >
        {sampleBody("Active jobs")}
      </Card>
      <Card
        key="health"
        title="Health summary"
        secondaryTitle={<CardSecondaryTitle>All regions</CardSecondaryTitle>}
        size="span-2"
        showButtons
        actions={[
          { id: "a1", label: "Action" },
          { id: "a2", label: "Action" },
        ]}
      >
        {sampleBody("Status overview")}
      </Card>
      <Card key="notes" title="Notes" size="span-1">
        {sampleBody("Operator notes")}
      </Card>
      <Card
        key="timeline"
        title="Timeline"
        secondaryTitle="Full width"
        size="span-3"
      >
        {sampleBody("Recent activity")}
      </Card>
    </Dashboard>
  ),
};

/** Same layout with HTML5 drag reorder enabled via `enableDragAndDrop`. */
export const WithDraggableCards: Story = {
  name: "With enableDragAndDrop",
  args: {
    enableDragAndDrop: true,
  },
  render: (args) => (
    <Dashboard {...args}>
      <Card key="c1" title="Card A" size="span-1">
        {sampleBody("A")}
      </Card>
      <Card key="c2" title="Card B" secondaryTitle="Drag me" size="span-1">
        {sampleBody("B")}
      </Card>
      <Card key="c3" title="Card C" size="span-1">
        {sampleBody("C")}
      </Card>
      <Card key="c4" title="Wide card" size="span-2">
        {sampleBody("Span 2")}
      </Card>
      <Card key="c5" title="Narrow" size="span-1">
        {sampleBody("Span 1")}
      </Card>
    </Dashboard>
  ),
};

/** Simple 3-card grid. */
export const GridOnly: Story = {
  name: "Grid only",
  args: {
    enableDragAndDrop: false,
  },
  render: (args) => (
    <Dashboard {...args}>
      <Card key="1" title="One" size="span-1">
        {sampleBody("Column 1")}
      </Card>
      <Card key="2" title="Two" size="span-1">
        {sampleBody("Column 2")}
      </Card>
      <Card key="3" title="Three" size="span-1">
        {sampleBody("Column 3")}
      </Card>
    </Dashboard>
  ),
};
