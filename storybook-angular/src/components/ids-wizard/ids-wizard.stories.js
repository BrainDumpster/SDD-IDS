import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  WIZARD_MODE_OPTIONS,
  WIZARD_SIZE_OPTIONS,
  WIZARD_SPEC_ACCURATE_DEFAULTS,
} from "../../../compiled/component-contracts/ids/wizard.contract.js";
import { IdsWizardComponent } from "../../../compiled/lib/angular/ids/wizard/ids-wizard.component.js";
import { IdsWizardDemoHostComponent } from "../../../compiled/lib/angular/ids/wizard/ids-wizard-demo-host.component.js";
import { IDS_WIZARD_IMPORTS } from "../../../compiled/lib/angular/ids/wizard/index.js";
import {
  WIZARD_COMPOSITION_TEMPLATE,
  WIZARD_DOCS_DESCRIPTION,
  WIZARD_SOURCE_CODE,
  WIZARD_STORY_SOURCE_CODE,
} from "./ids-wizard.developer-usage.js";

const specAccurateSteps = [
  { id: "welcome", label: "Welcome", pageTitle: "Welcome", content: "Intro page content.", status: "success" },
  { id: "configure", label: "Configure", pageTitle: "Configure", content: "Configuration content.", status: "warning" },
  { id: "review", label: "Review", pageTitle: "Review", content: "Review content.", status: "error" },
  { id: "finish", label: "Finish", pageTitle: "Finish", content: "Final content.", status: "success" },
];

const modalSteps = [
  { id: "m1", label: "Step One", pageTitle: "Modal Step One", content: "Simple modal page content." },
  { id: "m2", label: "Step Two", pageTitle: "Modal Step Two", content: "Simple modal page content." },
];

/** @type {import("@storybook/angular").Meta<IdsWizardComponent>} */
const meta = {
  title: "Spec Generated/IDS/Wizard",
  component: IdsWizardComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_WIZARD_IMPORTS, IdsWizardDemoHostComponent],
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: WIZARD_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: WIZARD_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    mode: { control: "radio", options: [...WIZARD_MODE_OPTIONS] },
    size: { control: "radio", options: [...WIZARD_SIZE_OPTIONS] },
    title: { control: "text" },
    showCloseButton: { control: "boolean" },
    steps: { control: false, table: { disable: true } },
    onCancel: { action: "onCancel" },
    onPrevious: { action: "onPrevious" },
    onNext: { action: "onNext" },
    onFinish: { action: "onFinish" },
    onStepChange: { action: "onStepChange" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsWizardComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Spec Accurate Design: inline · large · Header · flat steps with status icons and footer progress.",
      },
      source: {
        type: "code",
        language: "html",
        code: WIZARD_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      steps: specAccurateSteps,
    },
    template: `
      <div style="display: flex; flex-direction: column; box-sizing: border-box; height: 100vh; min-height: 843px; padding: 24px; background: var(--color-background-surface-primary);">
        <ids-wizard
          [mode]="mode"
          [size]="size"
          [title]="title"
          [steps]="steps"
          [showCloseButton]="showCloseButton"
          (onCancel)="onCancel($event)"
          (onPrevious)="onPrevious($event)"
          (onNext)="onNext($event)"
          (onFinish)="onFinish($event)"
          (onStepChange)="onStepChange($event)"
        />
      </div>
    `,
  }),
  args: {
    mode: WIZARD_SPEC_ACCURATE_DEFAULTS.mode,
    size: WIZARD_SPEC_ACCURATE_DEFAULTS.size,
    title: WIZARD_SPEC_ACCURATE_DEFAULTS.title,
    showCloseButton: WIZARD_SPEC_ACCURATE_DEFAULTS.showCloseButton,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsWizardDemoHostComponent>} */
export const NestedVisibilityAndInjection = {
  name: "Nested Visibility And Injection",
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<ids-wizard-demo-host />`,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsWizardComponent>} */
export const Modal = {
  args: {
    mode: "modal",
    size: "medium",
    title: WIZARD_SPEC_ACCURATE_DEFAULTS.title,
    showCloseButton: true,
  },
  render: (args) => ({
    props: {
      ...args,
      steps: modalSteps,
    },
    template: `
      <ids-wizard
        [mode]="mode"
        [size]="size"
        [title]="title"
        [steps]="steps"
        [showCloseButton]="showCloseButton"
        (onCancel)="onCancel($event)"
        (onPrevious)="onPrevious($event)"
        (onNext)="onNext($event)"
        (onFinish)="onFinish($event)"
      />
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsWizardComponent>} */
export const CompositionSlots = {
  name: "Composition Slots",
  parameters: {
    docs: {
      source: {
        type: "code",
        language: "html",
        code: WIZARD_COMPOSITION_TEMPLATE,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      steps: specAccurateSteps,
    },
    template: WIZARD_COMPOSITION_TEMPLATE,
  }),
  args: {
    mode: "inline",
    size: "large",
    title: WIZARD_SPEC_ACCURATE_DEFAULTS.title,
  },
};
