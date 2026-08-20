/* component: link — Angular lib from components/ids/link/design-spec.md */
import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  LINK_DATA_STATES,
  LINK_SPEC_ACCURATE_DEFAULTS,
  LINK_TARGETS,
  LINK_TYPES,
} from "../../../compiled/component-contracts/ids/link.contract.js";
import { IdsLinkComponent } from "../../../compiled/lib/angular/ids/link/ids-link.component.js";
import { IDS_LINK_IMPORTS } from "../../../compiled/lib/angular/ids/link/index.js";
import {
  LINK_DOCS_DESCRIPTION,
  LINK_SOURCE_CODE,
  LINK_STORY_SOURCE_CODE,
} from "./ids-link.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsLinkComponent>} */
const meta = {
  title: "Spec Generated/IDS/Link",
  component: IdsLinkComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_LINK_IMPORTS],
    }),
  ],
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: LINK_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: LINK_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    type: { control: "select", options: [...LINK_TYPES] },
    label: { control: "text" },
    href: { control: "text" },
    showExternalLinkIcon: { control: "boolean" },
    target: { control: "select", options: [...LINK_TARGETS] },
    rel: { control: "text" },
    disabled: { control: "boolean" },
    dataState: {
      control: "select",
      options: [undefined, ...LINK_DATA_STATES],
    },
    clicked: { action: "clicked" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsLinkComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story: "Standalone default — matches React lib Spec Accurate Design.",
      },
      source: {
        type: "code",
        language: "html",
        code: LINK_STORY_SOURCE_CODE,
      },
    },
  },
  args: {
    type: LINK_SPEC_ACCURATE_DEFAULTS.type,
    label: LINK_SPEC_ACCURATE_DEFAULTS.label,
    href: LINK_SPEC_ACCURATE_DEFAULTS.href,
    showExternalLinkIcon: LINK_SPEC_ACCURATE_DEFAULTS.showExternalLinkIcon,
    target: LINK_SPEC_ACCURATE_DEFAULTS.target,
    disabled: LINK_SPEC_ACCURATE_DEFAULTS.disabled,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsLinkComponent>} */
export const Types = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <ids-link label="Standalone" type="standalone" href="#"></ids-link>
        <ids-link label="Inline" type="inline" href="#"></ids-link>
        <div style="background: var(--color-background-controls-base); padding: 8px 16px;">
          <ids-link label="Dark Bg" type="dark-bg" href="#"></ids-link>
        </div>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsLinkComponent>} */
export const WithExternalIcon = {
  args: {
    label: "This is a link",
    type: "standalone",
    href: "https://example.com",
    target: "_blank",
    showExternalLinkIcon: true,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsLinkComponent>} */
export const ActionButtonSemantics = {
  name: "Action (no href)",
  args: {
    label: "Perform action",
    type: "standalone",
    href: undefined,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsLinkComponent>} */
export const DarkBackground = {
  render: (args) => ({
    props: args,
    template: `
      <div style="background: var(--color-background-controls-base); padding: 16px;">
        <ids-link [type]="type" [label]="label" [href]="href"></ids-link>
      </div>
    `,
  }),
  args: {
    label: "This is a link",
    type: "dark-bg",
    href: "#",
  },
};

/** All 12 type × state cells (+ with-icon rows) from design-spec matrices. */
export const StateMatrixWithIcon = {
  name: "State Matrix With Icon",
  render: () => ({
    template: `
      <div style="background: var(--color-background-surface-primary); padding: 24px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap: 56px; margin-bottom: 20px;">
          <h3 style="margin: 0; font-weight: 400; font-size: 24px; line-height: 32px;">Standalone</h3>
          <h3 style="margin: 0; font-weight: 400; font-size: 24px; line-height: 32px;">Inline</h3>
          <h3 style="margin: 0; font-weight: 400; font-size: 24px; line-height: 32px;">Dark Bg</h3>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 134px; column-gap: 56px;">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <ids-link label="This is a link" type="standalone" href="#" dataState="default"></ids-link>
            <ids-link label="This is a link" type="standalone" href="#" dataState="hover"></ids-link>
            <ids-link label="This is a link" type="standalone" href="#" dataState="press"></ids-link>
            <ids-link label="This is a link" type="standalone" href="#" dataState="focus-visible"></ids-link>
            <div style="height: 22px;"></div>
            <ids-link label="This is a link" type="standalone" href="https://example.com" target="_blank" [showExternalLinkIcon]="true" dataState="default"></ids-link>
            <ids-link label="This is a link" type="standalone" href="https://example.com" target="_blank" [showExternalLinkIcon]="true" dataState="hover"></ids-link>
            <ids-link label="This is a link" type="standalone" href="https://example.com" target="_blank" [showExternalLinkIcon]="true" dataState="press"></ids-link>
            <ids-link label="This is a link" type="standalone" href="https://example.com" target="_blank" [showExternalLinkIcon]="true" dataState="focus-visible"></ids-link>
          </div>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <ids-link label="This is a link" type="inline" href="#" dataState="default"></ids-link>
            <ids-link label="This is a link" type="inline" href="#" dataState="hover"></ids-link>
            <ids-link label="This is a link" type="inline" href="#" dataState="press"></ids-link>
            <ids-link label="This is a link" type="inline" href="#" dataState="focus-visible"></ids-link>
            <div style="height: 22px;"></div>
            <ids-link label="This is a link" type="inline" href="https://example.com" target="_blank" [showExternalLinkIcon]="true" dataState="default"></ids-link>
            <ids-link label="This is a link" type="inline" href="https://example.com" target="_blank" [showExternalLinkIcon]="true" dataState="hover"></ids-link>
            <ids-link label="This is a link" type="inline" href="https://example.com" target="_blank" [showExternalLinkIcon]="true" dataState="press"></ids-link>
            <ids-link label="This is a link" type="inline" href="https://example.com" target="_blank" [showExternalLinkIcon]="true" dataState="focus-visible"></ids-link>
          </div>
          <div style="background: var(--color-background-controls-base); padding: 2px 18px; display: flex; flex-direction: column; gap: 14px;">
            <ids-link label="This is a link" type="dark-bg" href="#" dataState="default"></ids-link>
            <ids-link label="This is a link" type="dark-bg" href="#" dataState="hover"></ids-link>
            <ids-link label="This is a link" type="dark-bg" href="#" dataState="press"></ids-link>
            <ids-link label="This is a link" type="dark-bg" href="#" dataState="focus-visible"></ids-link>
            <div style="height: 22px;"></div>
            <ids-link label="This is a link" type="dark-bg" href="https://example.com" target="_blank" [showExternalLinkIcon]="true" dataState="default"></ids-link>
            <ids-link label="This is a link" type="dark-bg" href="https://example.com" target="_blank" [showExternalLinkIcon]="true" dataState="hover"></ids-link>
            <ids-link label="This is a link" type="dark-bg" href="https://example.com" target="_blank" [showExternalLinkIcon]="true" dataState="press"></ids-link>
            <ids-link label="This is a link" type="dark-bg" href="https://example.com" target="_blank" [showExternalLinkIcon]="true" dataState="focus-visible"></ids-link>
          </div>
        </div>
      </div>
    `,
  }),
};
