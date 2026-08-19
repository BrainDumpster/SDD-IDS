import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  IDS_TAG_DESIGN_SPEC_PATH,
  TAG_SPEC_ACCURATE_DEFAULTS,
  TAG_TONES,
  TAG_TYPES,
  TAG_SIZES,
} from "../../../compiled/component-contracts/ids/tag.contract.js";
import { IdsTagComponent } from "../../../compiled/lib/angular/ids/tag/ids-tag.component.js";
import { IDS_TAG_IMPORTS } from "../../../compiled/lib/angular/ids/tag/index.js";

/** @type {import("@storybook/angular").Meta<IdsTagComponent>} */
const meta = {
  title: "Spec Generated/IDS/Tag",
  component: IdsTagComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_TAG_IMPORTS],
    }),
  ],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `IDS Tag per \`${IDS_TAG_DESIGN_SPEC_PATH}\`. Use \`ids-tags\` to lay out multiple projected \`ids-tag\` children.`,
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    tone: { control: "select", options: [...TAG_TONES] },
    type: { control: "select", options: [...TAG_TYPES] },
    size: { control: "select", options: [...TAG_SIZES] },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    focusVisible: { control: "boolean" },
    focusOnText: { control: "boolean" },
    demoHover: { control: "boolean" },
    showLabel: { control: "boolean" },
    labelPrefix: { control: "text" },
    badgeValue: { control: "text" },
    leadingIconSlug: { control: "text" },
    selectionChange: { action: "selectionChange" },
    dismiss: { action: "dismiss" },
    tagClick: { action: "tagClick" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsTagComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  args: { ...TAG_SPEC_ACCURATE_DEFAULTS },
};

/** @type {import("@storybook/angular").StoryObj<IdsTagComponent>} */
export const MainComponent = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <ids-tags>
        <ids-tag type="read-only" label="Tag" tone="none" size="small"></ids-tag>
        <ids-tag type="clickable" label="Tag" tone="none" size="large"></ids-tag>
        <ids-tag
          type="editable"
          label="Tag"
          tone="none"
          size="large"
          [showLabel]="true"
          labelPrefix="Label"
        ></ids-tag>
        <ids-tag
          type="badge"
          label="Tag"
          tone="none"
          size="large"
          [showLabel]="true"
          labelPrefix="Label"
          [badgeValue]="1"
        ></ids-tag>
      </ids-tags>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTagComponent>} */
export const ReadOnlyAndAlerting = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <ids-tags ariaLabel="Alerting tag examples">
        <ids-tag type="read-only" label="Tag" tone="none" size="small"></ids-tag>
        <ids-tag type="read-only" label="Tag" tone="critical" size="small"></ids-tag>
        <ids-tag type="read-only" label="Tag" tone="major" size="small"></ids-tag>
        <ids-tag type="read-only" label="Tag" tone="minor" size="small"></ids-tag>
        <ids-tag type="read-only" label="Tag" tone="success" size="small"></ids-tag>
        <ids-tag type="read-only" label="Tag" tone="informational" size="small"></ids-tag>
      </ids-tags>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTagComponent>} */
export const ClickableStates = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <ids-tags ariaLabel="Clickable tag states">
        <ids-tag type="clickable" label="Tag" tone="none" size="large"></ids-tag>
        <ids-tag type="clickable" label="Tag" tone="none" size="large" [demoHover]="true"></ids-tag>
        <ids-tag type="clickable" label="Tag" tone="none" size="large" [focusVisible]="true"></ids-tag>
        <ids-tag
          type="clickable"
          label="Tag"
          tone="none"
          size="large"
          [selected]="true"
        ></ids-tag>
        <ids-tag
          type="clickable"
          label="Tag"
          tone="none"
          size="large"
          [selected]="true"
          [demoHover]="true"
        ></ids-tag>
      </ids-tags>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTagComponent>} */
export const EditableAndBadgeStates = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: grid; gap: 16px;">
        <ids-tags ariaLabel="Editable tag states">
          <ids-tag type="editable" label="Tag" tone="none" size="large"></ids-tag>
          <ids-tag
            type="editable"
            label="Tag"
            tone="critical"
            size="large"
            [error]="true"
          ></ids-tag>
          <ids-tag
            type="editable"
            label="Tag"
            tone="none"
            size="large"
            [disabled]="true"
          ></ids-tag>
          <ids-tag
            type="editable"
            label="Tag"
            tone="none"
            size="large"
            [focusOnText]="true"
            [showLabel]="true"
            labelPrefix="Label"
          ></ids-tag>
        </ids-tags>
        <ids-tags ariaLabel="Badge tag states">
          <ids-tag
            type="badge"
            label="Tag"
            size="large"
            [showLabel]="true"
            labelPrefix="Label"
            [badgeValue]="1"
          ></ids-tag>
          <ids-tag
            type="badge"
            label="Tag"
            size="large"
            [showLabel]="true"
            labelPrefix="Label"
            [badgeValue]="1"
            [focusVisible]="true"
          ></ids-tag>
          <ids-tag
            type="badge"
            label="Tag"
            size="large"
            [showLabel]="true"
            labelPrefix="Label"
            [badgeValue]="1"
            [error]="true"
          ></ids-tag>
        </ids-tags>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTagComponent>} */
export const NonAlertingLargeStates = {
  name: "Non-Alerting Large States",
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <ids-tags ariaLabel="Non-alerting large tag states">
        <ids-tag type="read-only" label="Tag" tone="none" size="large"></ids-tag>
        <ids-tag type="read-only" label="Tag" tone="none" size="large" [error]="true"></ids-tag>
        <ids-tag type="read-only" label="Tag" tone="none" size="large" [focusVisible]="true"></ids-tag>
      </ids-tags>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsTagComponent>} */
export const DismissibleList = {
  name: "Dismissible List",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Editable tags in an `ids-tags` group; dismiss removes the tag from the list (host-managed state).",
      },
    },
  },
  render: () => ({
    props: {
      tags: ["Alpha", "Beta", "Gamma"],
      removeTag(tags, label) {
        const index = tags.indexOf(label);
        if (index >= 0) {
          tags.splice(index, 1);
        }
      },
    },
    template: `
      <ids-tags ariaLabel="Dismissible tags">
        @for (tag of tags; track tag) {
          <ids-tag
            type="editable"
            [label]="tag"
            tone="none"
            size="large"
            (dismiss)="removeTag(tags, tag)"
          ></ids-tag>
        }
      </ids-tags>
    `,
  }),
};
