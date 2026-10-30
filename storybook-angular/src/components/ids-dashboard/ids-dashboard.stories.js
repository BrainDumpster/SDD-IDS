import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import { IdsDashboardComponent } from "../../../compiled/lib/angular/ids/dashboard/ids-dashboard.component.js";
import { IDS_DASHBOARD_IMPORTS } from "../../../compiled/lib/angular/ids/dashboard/index.js";
import {
  CARD_MENU,
  DASHBOARD_DOCS_DESCRIPTION,
  DASHBOARD_SOURCE_CODE,
  DASHBOARD_STORY_SOURCE_CODE,
} from "./ids-dashboard.developer-usage.js";

/** @type {import("@storybook/angular").Meta} */
const meta = {
  title: "Components/IDS/Dashboard",
  component: IdsDashboardComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_DASHBOARD_IMPORTS],
    }),
  ],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: DASHBOARD_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: DASHBOARD_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    showDividerInCard: { control: "boolean" },
    enableDragAndDrop: { control: "boolean" },
    cardsReorder: { action: "cardsReorder" },
  },
};

export default meta;

const frameStyle = "width: 100%; max-width: 1200px; margin: 0 auto;";

function logReorder(name) {
  return (keys) => {
    // eslint-disable-next-line no-console
    console.log(`[IDS Dashboard] ${name}`, keys);
  };
}

const SPEC_TEMPLATE = `
  <div style="${frameStyle}">
    <ids-dashboard
      [showDividerInCard]="showDividerInCard"
      [enableDragAndDrop]="enableDragAndDrop"
      (cardsReorder)="onCardsReorder($event)"
    >
      <ids-card
        title="Widget Title"
        secondaryTitle="Secondary Title"
        headerMeta="Last 24 Hours"
        size="span-1"
        [showOverflowMenu]="true"
        [menuOptions]="cardMenu"
        [showButtons]="true"
        [actions]="actionOne"
      >
        <ids-card-text-content sectionTitle="Critical events">
          Dashboard tile body — IDS Card Content Type=Text sample.
        </ids-card-text-content>
      </ids-card>
      <ids-card
        title="Widget Title"
        secondaryTitle="Secondary Title"
        size="span-1"
        [showButtons]="false"
      >
        <ids-card-text-content sectionTitle="Storage pool">
          Dashboard tile body — IDS Card Content Type=Text sample.
        </ids-card-text-content>
      </ids-card>
      <ids-card
        title="Jobs"
        size="span-1"
        [showOverflowMenu]="true"
        [menuOptions]="cardMenu"
      >
        <ids-card-text-content sectionTitle="Active jobs">
          Dashboard tile body — IDS Card Content Type=Text sample.
        </ids-card-text-content>
      </ids-card>
      <ids-card
        title="Health summary"
        secondaryTitle="All regions"
        size="span-2"
        [showButtons]="true"
        [actions]="actionTwo"
      >
        <ids-card-text-content sectionTitle="Status overview">
          Dashboard tile body — IDS Card Content Type=Text sample.
        </ids-card-text-content>
      </ids-card>
      <ids-card title="Notes" size="span-1">
        <ids-card-text-content sectionTitle="Operator notes">
          Dashboard tile body — IDS Card Content Type=Text sample.
        </ids-card-text-content>
      </ids-card>
      <ids-card title="Timeline" secondaryTitle="Full width" size="span-3">
        <ids-card-text-content sectionTitle="Recent activity">
          Dashboard tile body — IDS Card Content Type=Text sample.
        </ids-card-text-content>
      </ids-card>
    </ids-dashboard>
  </div>
`;

/** @type {import("@storybook/angular").StoryObj} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Three-column layout with mixed card spans + light nested borders. Source: components/ids/dashboard/design-spec.md.",
      },
      source: {
        type: "code",
        language: "html",
        code: DASHBOARD_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      cardMenu: CARD_MENU,
      actionOne: [{ id: "a1", label: "Action" }],
      actionTwo: [
        { id: "a1", label: "Action" },
        { id: "a2", label: "Action" },
      ],
      onCardsReorder: logReorder("cardsReorder"),
    },
    template: SPEC_TEMPLATE,
  }),
  args: {
    showDividerInCard: true,
    enableDragAndDrop: false,
  },
};

/** @type {import("@storybook/angular").StoryObj} */
export const WithDraggableCards = {
  name: "With enableDragAndDrop",
  parameters: {
    docs: {
      description: {
        story: "Same layout with HTML5 drag reorder enabled via `enableDragAndDrop`.",
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      onCardsReorder: logReorder("cardsReorder"),
    },
    template: `
      <div style="${frameStyle}">
        <ids-dashboard
          [showDividerInCard]="showDividerInCard"
          [enableDragAndDrop]="enableDragAndDrop"
          (cardsReorder)="onCardsReorder($event)"
        >
          <ids-dashboard-item itemKey="c1" size="span-1">
            <ids-card title="Card A" size="span-1">
              <ids-card-text-content sectionTitle="A">Dashboard tile body — A.</ids-card-text-content>
            </ids-card>
          </ids-dashboard-item>
          <ids-dashboard-item itemKey="c2" size="span-1">
            <ids-card title="Card B" secondaryTitle="Drag me" size="span-1">
              <ids-card-text-content sectionTitle="B">Dashboard tile body — B.</ids-card-text-content>
            </ids-card>
          </ids-dashboard-item>
          <ids-dashboard-item itemKey="c3" size="span-1">
            <ids-card title="Card C" size="span-1">
              <ids-card-text-content sectionTitle="C">Dashboard tile body — C.</ids-card-text-content>
            </ids-card>
          </ids-dashboard-item>
          <ids-dashboard-item itemKey="c4" size="span-2">
            <ids-card title="Wide card" size="span-2">
              <ids-card-text-content sectionTitle="Span 2">Dashboard tile body — Span 2.</ids-card-text-content>
            </ids-card>
          </ids-dashboard-item>
          <ids-dashboard-item itemKey="c5" size="span-1">
            <ids-card title="Narrow" size="span-1">
              <ids-card-text-content sectionTitle="Span 1">Dashboard tile body — Span 1.</ids-card-text-content>
            </ids-card>
          </ids-dashboard-item>
        </ids-dashboard>
      </div>
    `,
  }),
  args: {
    showDividerInCard: true,
    enableDragAndDrop: true,
  },
};

/** @type {import("@storybook/angular").StoryObj} */
export const WithoutCardDividers = {
  name: "showDividerInCard false",
  parameters: {
    docs: {
      description: {
        story: "Nested Cards with body dividers off via Dashboard `showDividerInCard=false`.",
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      actionOne: [{ label: "Action" }],
      onCardsReorder: logReorder("cardsReorder"),
    },
    template: `
      <div style="${frameStyle}">
        <ids-dashboard
          [showDividerInCard]="showDividerInCard"
          [enableDragAndDrop]="enableDragAndDrop"
          (cardsReorder)="onCardsReorder($event)"
        >
          <ids-card title="One" size="span-1" [showButtons]="true" [actions]="actionOne">
            <ids-card-text-content sectionTitle="Column 1">Dashboard tile body — Column 1.</ids-card-text-content>
          </ids-card>
          <ids-card title="Two" size="span-1">
            <ids-card-text-content sectionTitle="Column 2">Dashboard tile body — Column 2.</ids-card-text-content>
          </ids-card>
          <ids-card title="Three" size="span-1">
            <ids-card-text-content sectionTitle="Column 3">Dashboard tile body — Column 3.</ids-card-text-content>
          </ids-card>
        </ids-dashboard>
      </div>
    `,
  }),
  args: {
    showDividerInCard: false,
    enableDragAndDrop: false,
  },
};

/** @type {import("@storybook/angular").StoryObj} */
export const GridOnly = {
  name: "Grid only",
  parameters: {
    docs: {
      description: {
        story: "Simple 3-card grid.",
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      onCardsReorder: logReorder("cardsReorder"),
    },
    template: `
      <div style="${frameStyle}">
        <ids-dashboard
          [showDividerInCard]="showDividerInCard"
          [enableDragAndDrop]="enableDragAndDrop"
          (cardsReorder)="onCardsReorder($event)"
        >
          <ids-card title="One" size="span-1">
            <ids-card-text-content sectionTitle="Column 1">Dashboard tile body — Column 1.</ids-card-text-content>
          </ids-card>
          <ids-card title="Two" size="span-1">
            <ids-card-text-content sectionTitle="Column 2">Dashboard tile body — Column 2.</ids-card-text-content>
          </ids-card>
          <ids-card title="Three" size="span-1">
            <ids-card-text-content sectionTitle="Column 3">Dashboard tile body — Column 3.</ids-card-text-content>
          </ids-card>
        </ids-dashboard>
      </div>
    `,
  }),
  args: {
    showDividerInCard: true,
    enableDragAndDrop: false,
  },
};
