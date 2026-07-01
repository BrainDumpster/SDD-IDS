/* component: tab — Angular composition stories */
import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import { TAB_SPEC_ACCURATE_DEFAULTS, TAB_OVERFLOW_DEMO_WIDTH } from "../../../compiled/component-contracts/ids/tab.contract.js";
import { IdsTabComponent } from "../../../compiled/storybook-angular/src/components/ids-tab/ids-tab.component.js";
import { IDS_TAB_IMPORTS } from "../../../compiled/storybook-angular/src/components/ids-tab/ids-tab.imports.js";
import {
  TAB_COMPOSITION_DEMO_TEMPLATE,
  TAB_DOCS_DESCRIPTION,
  TAB_OVERFLOW_DEMO_TEMPLATE,
  TAB_SOURCE_CODE,
  TAB_STORY_SOURCE_CODE,
} from "./ids-tab.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsTabComponent>} */
const meta = {
  title: "Spec Generated/IDS/Tab",
  component: IdsTabComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_TAB_IMPORTS],
    }),
  ],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: TAB_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: TAB_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    type: { control: "select", options: ["primary", "secondary"] },
    surface: { control: "select", options: ["elevated", "transparent"] },
    allowAddTab: { control: "boolean" },
    overflow: { control: "boolean" },
    addTabLabel: { control: "text" },
    moreLabel: { control: "text" },
    activeItemChange: { action: "activeItemChange" },
    tabSelect: { action: "tabSelect" },
    addTab: { action: "addTab" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsTabComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story: "Spec Accurate Design: secondary variant · elevated surface · overview active — composition markup.",
      },
      source: {
        type: "code",
        language: "html",
        code: TAB_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => {
    const state = {
      activeId: args.defaultActiveItemId ?? TAB_SPEC_ACCURATE_DEFAULTS.defaultActiveItemId,
    };
    return {
      props: {
        ...args,
        state,
        onActiveChange: (id) => {
          state.activeId = id;
          args.activeItemChange?.(id);
        },
      },
      template: TAB_COMPOSITION_DEMO_TEMPLATE,
    };
  },
  args: {
    type: TAB_SPEC_ACCURATE_DEFAULTS.type,
    surface: TAB_SPEC_ACCURATE_DEFAULTS.surface,
    defaultActiveItemId: TAB_SPEC_ACCURATE_DEFAULTS.defaultActiveItemId,
    allowAddTab: TAB_SPEC_ACCURATE_DEFAULTS.allowAddTab,
    overflow: TAB_SPEC_ACCURATE_DEFAULTS.overflow,
    addTabLabel: TAB_SPEC_ACCURATE_DEFAULTS.addTabLabel,
    moreLabel: TAB_SPEC_ACCURATE_DEFAULTS.moreLabel,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsTabComponent>} */
export const PrimaryVariant = {
  render: () => ({
    template: `
      <ids-tab type="primary" defaultActiveItemId="overview">
        <ids-tab-item itemId="overview" label="Overview">
          <ids-tab-panel>Overview tab content area.</ids-tab-panel>
        </ids-tab-item>
        <ids-tab-item itemId="security" label="Security" iconSlug="shield-encrypt-alt">
          <ids-tab-panel>Security tab content area.</ids-tab-panel>
        </ids-tab-item>
        <ids-tab-item itemId="alerts" label="Alerts">
          <ids-tab-panel>Alerts tab content area with related data.</ids-tab-panel>
        </ids-tab-item>
      </ids-tab>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTabComponent>} */
export const TransparentOnGray = {
  render: () => ({
    template: `
      <div style="max-width: 720px; padding: 16px; background: var(--color-background-gray-light);">
        <ids-tab type="secondary" surface="transparent" defaultActiveItemId="overview">
          <ids-tab-item itemId="overview" label="Overview">
            <ids-tab-panel>Overview tab content area.</ids-tab-panel>
          </ids-tab-item>
          <ids-tab-item itemId="security" label="Security">
            <ids-tab-panel>Security tab content area.</ids-tab-panel>
          </ids-tab-item>
          <ids-tab-item itemId="alerts" label="Alerts">
            <ids-tab-panel>Alerts tab content area with related data.</ids-tab-panel>
          </ids-tab-item>
        </ids-tab>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTabComponent>} */
export const OverflowResponsive = {
  render: () => ({
    props: { maxWidth: TAB_OVERFLOW_DEMO_WIDTH, tabType: "secondary" },
    template: TAB_OVERFLOW_DEMO_TEMPLATE,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTabComponent>} */
export const PrimaryOverflowResponsive = {
  render: () => ({
    props: { maxWidth: TAB_OVERFLOW_DEMO_WIDTH, tabType: "primary" },
    template: TAB_OVERFLOW_DEMO_TEMPLATE,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTabComponent>} */
export const AddTabDynamic = {
  render: () => {
    const state = {
      tabs: [
        { id: "summary", label: "Summary", content: "Summary content." },
        { id: "details", label: "Details", content: "Details content." },
        { id: "settings", label: "Settings", content: "Settings content." },
        { id: "activity", label: "Activity", content: "Activity content." },
      ],
      nextIndex: 5,
    };
    return {
      props: {
        state,
        onAddTab: () => {
          const id = `new-${state.nextIndex}`;
          state.tabs = [
            ...state.tabs,
            {
              id,
              label: `Tab ${state.nextIndex}`,
              content: `Dynamic tab content for Tab ${state.nextIndex}.`,
            },
          ];
          state.nextIndex += 1;
        },
      },
      template: `
        <div style="max-width: 700px;">
          <ids-tab
            type="secondary"
            [allowAddTab]="true"
            addTabLabel="Add Tab"
            [defaultActiveItemId]="state.tabs[0].id"
            (addTab)="onAddTab()"
          >
            @for (tab of state.tabs; track tab.id) {
              <ids-tab-item [itemId]="tab.id" [label]="tab.label">
                <ids-tab-panel>{{ tab.content }}</ids-tab-panel>
              </ids-tab-item>
            }
          </ids-tab>
        </div>
      `,
    };
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsTabComponent>} */
export const AddLabelSecondary = {
  render: () => ({
    template: `
      <div style="max-width: 760px;">
        <ids-tab type="secondary" [allowAddTab]="true" addTabLabel="Create Tab" defaultActiveItemId="summary">
          <ids-tab-item itemId="summary" label="Summary">
            <ids-tab-panel>Summary content.</ids-tab-panel>
          </ids-tab-item>
          <ids-tab-item itemId="details" label="Details">
            <ids-tab-panel>Details content.</ids-tab-panel>
          </ids-tab-item>
          <ids-tab-item itemId="settings" label="Settings">
            <ids-tab-panel>Settings content.</ids-tab-panel>
          </ids-tab-item>
          <ids-tab-item itemId="activity" label="Activity">
            <ids-tab-panel>Activity content.</ids-tab-panel>
          </ids-tab-item>
        </ids-tab>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTabComponent>} */
export const StateMatrix = {
  render: () => ({
    template: `
      <div style="display: grid; gap: 24px;">
        <div style="font-size: 12px; color: var(--color-text-neutral-strong);">
          Secondary tabs — hover the middle column; focus column uses simulatedState.
        </div>
        <ids-tab type="secondary" defaultActiveItemId="selected">
          <ids-tab-item itemId="default" label="Default">
            <ids-tab-panel>Default tab panel.</ids-tab-panel>
          </ids-tab-item>
          <ids-tab-item itemId="hover" label="Hover" simulatedState="hover">
            <ids-tab-panel>Hover tab panel.</ids-tab-panel>
          </ids-tab-item>
          <ids-tab-item itemId="focus" label="Focus" simulatedState="focus-visible">
            <ids-tab-panel>Focus tab panel.</ids-tab-panel>
          </ids-tab-item>
          <ids-tab-item itemId="selected" label="Selected">
            <ids-tab-panel>Selected tab panel.</ids-tab-panel>
          </ids-tab-item>
        </ids-tab>
      </div>
    `,
  }),
};
