import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  TOAST_POSITIONS,
  TOAST_SPEC_ACCURATE_DEFAULTS,
  TOAST_TYPES,
} from "../../../compiled/component-contracts/ids/toast.contract.js";
import { IdsToastItemComponent } from "../../../compiled/lib/angular/ids/toast/ids-toast-item.component.js";
import { IDS_TOAST_IMPORTS } from "../../../compiled/lib/angular/ids/toast/index.js";
import {
  TOAST_COMPOSITION_DEMO_TEMPLATE,
  TOAST_DOCS_DESCRIPTION,
  TOAST_SOURCE_CODE,
  TOAST_STORY_SOURCE_CODE,
} from "./ids-toast.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsToastItemComponent>} */
const meta = {
  title: "Spec Generated/IDS/Toast",
  component: IdsToastItemComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_TOAST_IMPORTS],
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: TOAST_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: TOAST_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    type: { control: "select", options: [...TOAST_TYPES] },
    message: { control: "text" },
    duration: { control: { type: "number", min: 0, step: 500 } },
    closable: { control: "boolean" },
    role: { control: "select", options: ["status", "alert"] },
    position: { control: "select", options: [...TOAST_POSITIONS] },
    onClose: { action: "onClose" },
    onTimeout: { action: "onTimeout" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsToastItemComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Spec Accurate Design: info toast with status icon, message, View Details, and close — composition markup.",
      },
      source: {
        type: "code",
        language: "html",
        code: TOAST_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      link: args.showLink === false ? undefined : { label: args.linkLabel || "View Details" },
      onClose: (detail) => args.onClose?.(detail),
      onTimeout: (detail) => args.onTimeout?.(detail),
    },
    template: TOAST_COMPOSITION_DEMO_TEMPLATE,
  }),
  args: {
    type: TOAST_SPEC_ACCURATE_DEFAULTS.type,
    message: TOAST_SPEC_ACCURATE_DEFAULTS.message,
    duration: 0,
    closable: TOAST_SPEC_ACCURATE_DEFAULTS.closable,
    role: TOAST_SPEC_ACCURATE_DEFAULTS.role,
    position: TOAST_SPEC_ACCURATE_DEFAULTS.position,
    showLink: true,
    linkLabel: TOAST_SPEC_ACCURATE_DEFAULTS.link.label,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsToastItemComponent>} */
export const AlertingTypes = {
  name: "Alerting Types",
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <ids-toast-viewport position="top-right" [maxVisible]="5">
        <ids-toast-item type="info" message="info toast" [duration]="0" [link]="link">
          <ids-toast-icon-container />
          <ids-toast-message />
          <ids-toast-view-details-action />
          <ids-toast-close-action />
        </ids-toast-item>
        <ids-toast-item type="critical" message="critical toast" [duration]="0" [link]="link">
          <ids-toast-icon-container />
          <ids-toast-message />
          <ids-toast-view-details-action />
          <ids-toast-close-action />
        </ids-toast-item>
        <ids-toast-item type="major-warning" message="major-warning toast" [duration]="0" [link]="link">
          <ids-toast-icon-container />
          <ids-toast-message />
          <ids-toast-view-details-action />
          <ids-toast-close-action />
        </ids-toast-item>
        <ids-toast-item type="minor-warning" message="minor-warning toast" [duration]="0" [link]="link">
          <ids-toast-icon-container />
          <ids-toast-message />
          <ids-toast-view-details-action />
          <ids-toast-close-action />
        </ids-toast-item>
        <ids-toast-item type="success" message="success toast" [duration]="0" [link]="link">
          <ids-toast-icon-container />
          <ids-toast-message />
          <ids-toast-view-details-action />
          <ids-toast-close-action />
        </ids-toast-item>
      </ids-toast-viewport>
    `,
    props: {
      link: { label: "View Details" },
    },
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsToastItemComponent>} */
export const WithoutViewDetails = {
  name: "Without View Details",
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <ids-toast-viewport position="top-right">
        <ids-toast-item type="success" message="Saved successfully." [duration]="0" [closable]="true">
          <ids-toast-icon-container />
          <ids-toast-message />
          <ids-toast-close-action />
        </ids-toast-item>
      </ids-toast-viewport>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsToastItemComponent>} */
export const QueueAndStack = {
  name: "Queue And Stack",
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <ids-toast-viewport position="top-right" [maxVisible]="3">
        <ids-toast-item id="1" type="info" message="Queue item 1: info" [duration]="0" [closable]="true">
          <ids-toast-icon-container />
          <ids-toast-message />
          <ids-toast-close-action />
        </ids-toast-item>
        <ids-toast-item id="2" type="critical" message="Queue item 2: critical" [duration]="0" [closable]="true">
          <ids-toast-icon-container />
          <ids-toast-message />
          <ids-toast-close-action />
        </ids-toast-item>
        <ids-toast-item id="3" type="major-warning" message="Queue item 3: major-warning" [duration]="0" [closable]="true">
          <ids-toast-icon-container />
          <ids-toast-message />
          <ids-toast-close-action />
        </ids-toast-item>
        <ids-toast-item id="4" type="minor-warning" message="Queue item 4: minor-warning (queued)" [duration]="0" [closable]="true">
          <ids-toast-icon-container />
          <ids-toast-message />
          <ids-toast-close-action />
        </ids-toast-item>
        <ids-toast-item id="5" type="success" message="Queue item 5: success (queued)" [duration]="0" [closable]="true">
          <ids-toast-icon-container />
          <ids-toast-message />
          <ids-toast-close-action />
        </ids-toast-item>
      </ids-toast-viewport>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsToastItemComponent>} */
export const PositionMatrix = {
  name: "Position Matrix",
  argTypes: {
    position: { control: "select", options: [...TOAST_POSITIONS] },
  },
  render: (args) => ({
    props: {
      position: args.position,
      message: TOAST_SPEC_ACCURATE_DEFAULTS.message,
    },
    template: `
      <ids-toast-viewport [position]="position">
        <ids-toast-item type="info" [message]="message" [duration]="0">
          <ids-toast-icon-container />
          <ids-toast-message />
          <ids-toast-close-action />
        </ids-toast-item>
      </ids-toast-viewport>
    `,
  }),
  args: {
    position: "top-right",
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsToastItemComponent>} */
export const ViewportItemsApi = {
  name: "Viewport Items API",
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      items: [
        { id: "1", type: "info", message: "Queue item 1: info", duration: 0, closable: true },
        { id: "2", type: "critical", message: "Queue item 2: critical", duration: 0, closable: true },
        { id: "3", type: "major-warning", message: "Queue item 3: major-warning", duration: 0, closable: true },
        { id: "4", type: "minor-warning", message: "Queue item 4: queued", duration: 0, closable: true },
        { id: "5", type: "success", message: "Queue item 5: queued", duration: 0, closable: true },
      ],
    },
    template: `
      <ids-toast-viewport position="top-right" [maxVisible]="3" [items]="items"></ids-toast-viewport>
    `,
  }),
};
