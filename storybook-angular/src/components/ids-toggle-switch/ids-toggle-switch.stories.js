import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import { TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS } from "../../../compiled/component-contracts/ids/toggle-switch.contract.js";
import { IdsToggleSwitchComponent } from "../../../compiled/lib/angular/ids/toggle-switch/ids-toggle-switch.component.js";
import { IDS_TOGGLE_SWITCH_IMPORTS } from "../../../compiled/lib/angular/ids/toggle-switch/index.js";
import {
  TOGGLE_SWITCH_COMPOSITION_DEMO_TEMPLATE,
  TOGGLE_SWITCH_DOCS_DESCRIPTION,
  TOGGLE_SWITCH_SOURCE_CODE,
  TOGGLE_SWITCH_STORY_SOURCE_CODE,
} from "./ids-toggle-switch.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsToggleSwitchComponent>} */
const meta = {
  title: "Spec Generated/IDS/Toggle Switch",
  component: IdsToggleSwitchComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_TOGGLE_SWITCH_IMPORTS],
    }),
  ],
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: TOGGLE_SWITCH_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: TOGGLE_SWITCH_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    id: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
    className: { control: "text" },
    ariaLabel: { control: "text" },
    ariaDescribedBy: { control: "text" },
    onCheckedChange: { action: "onCheckedChange" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsToggleSwitchComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story: "Spec Accurate Design: off toggle with visible label (composition slots).",
      },
      source: {
        type: "code",
        language: "html",
        code: TOGGLE_SWITCH_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => {
    const state = {
      checked: args.checked ?? TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS.checked,
    };
    return {
      props: {
        ...args,
        state,
        onToggle: (next) => {
          state.checked = next;
          args.onCheckedChange?.(next);
        },
      },
      template: TOGGLE_SWITCH_COMPOSITION_DEMO_TEMPLATE,
    };
  },
  args: {
    label: TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS.label,
    checked: TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS.checked,
    disabled: TOGGLE_SWITCH_SPEC_ACCURATE_DEFAULTS.disabled,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsToggleSwitchComponent>} */
export const On = {
  name: "On",
  render: () => {
    const state = { checked: true };
    return {
      props: {
        state,
        onToggle: (next) => {
          state.checked = next;
        },
      },
      template: `
        <ids-toggle-switch [checked]="state.checked" (onCheckedChange)="onToggle($event)">
          <ids-toggle-switch-input />
          <ids-toggle-switch-track />
          <ids-toggle-switch-thumb />
          <ids-toggle-switch-label>Enable alerts</ids-toggle-switch-label>
        </ids-toggle-switch>
      `,
    };
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsToggleSwitchComponent>} */
export const DisabledOffAndOn = {
  name: "Disabled Off And On",
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px;">
        <ids-toggle-switch [disabled]="true" [defaultChecked]="false">
          <ids-toggle-switch-input />
          <ids-toggle-switch-track />
          <ids-toggle-switch-thumb />
          <ids-toggle-switch-label>Disabled Off</ids-toggle-switch-label>
        </ids-toggle-switch>
        <ids-toggle-switch [disabled]="true" [defaultChecked]="true">
          <ids-toggle-switch-input />
          <ids-toggle-switch-track />
          <ids-toggle-switch-thumb />
          <ids-toggle-switch-label>Disabled On</ids-toggle-switch-label>
        </ids-toggle-switch>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsToggleSwitchComponent>} */
export const WithoutVisibleLabel = {
  name: "Without Visible Label",
  render: () => {
    const state = { checked: false };
    return {
      props: {
        state,
        onToggle: (next) => {
          state.checked = next;
        },
      },
      template: `
        <ids-toggle-switch
          [checked]="state.checked"
          ariaLabel="Enable alerts"
          (onCheckedChange)="onToggle($event)"
        >
          <ids-toggle-switch-input />
          <ids-toggle-switch-track />
          <ids-toggle-switch-thumb />
        </ids-toggle-switch>
      `,
    };
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsToggleSwitchComponent>} */
export const WithAssistiveText = {
  name: "With Assistive Text",
  render: () => {
    const state = { checked: false };
    return {
      props: {
        state,
        onToggle: (next) => {
          state.checked = next;
        },
      },
      template: `
        <ids-toggle-switch [checked]="state.checked" (onCheckedChange)="onToggle($event)">
          <ids-toggle-switch-input />
          <ids-toggle-switch-track />
          <ids-toggle-switch-thumb />
          <ids-toggle-switch-label>Enable alerts</ids-toggle-switch-label>
          <ids-toggle-switch-assistive-text>Sends a notification when an alert is raised.</ids-toggle-switch-assistive-text>
        </ids-toggle-switch>
      `,
    };
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsToggleSwitchComponent>} */
export const Controlled = {
  name: "Controlled",
  render: () => {
    const state = { checked: false };
    return {
      props: { state },
      template: `
        <div style="display: grid; gap: 8px;">
          <ids-toggle-switch [checked]="state.checked" (onCheckedChange)="state.checked = $event">
            <ids-toggle-switch-input />
            <ids-toggle-switch-track />
            <ids-toggle-switch-thumb />
            <ids-toggle-switch-label>Enable alerts</ids-toggle-switch-label>
          </ids-toggle-switch>
          <span style="color: var(--color-text-gray-neutral);">Checked: {{ state.checked ? "true" : "false" }}</span>
        </div>
      `,
    };
  },
};
