import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import { FOOTER_SPEC_ACCURATE_DEFAULTS } from "../../../compiled/component-contracts/ids/footer.contract.js";
import { IdsFooterComponent } from "../../../compiled/lib/angular/ids/footer/ids-footer.component.js";
import { IDS_FOOTER_IMPORTS } from "../../../compiled/lib/angular/ids/footer/index.js";
import {
  FOOTER_LIB_DOCS_DESCRIPTION,
  FOOTER_LIB_HOST_ONLY_TEMPLATE,
  FOOTER_LIB_SOURCE_CODE,
  FOOTER_LIB_SPEC_ACCURATE_TEMPLATE,
  FOOTER_LIB_STORY_SOURCE_CODE,
  FOOTER_LIB_TIME_ONLY_TEMPLATE,
} from "./ids-footer-lib.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsFooterComponent>} */
const meta = {
  title: "Components/IDS/Footer/Angular Composition",
  component: IdsFooterComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_FOOTER_IMPORTS],
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: FOOTER_LIB_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: FOOTER_LIB_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    hostname: { control: "text" },
    swid: { control: "text" },
    currentDateTime: { control: "text" },
    timeZoneLabel: { control: "text" },
    copyDisabled: { control: "boolean" },
    timeZoneDisabled: { control: "boolean" },
    copySwid: { action: "copySwid" },
    timeZoneClick: { action: "timeZoneClick" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsFooterComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Figma `38908:5818` using the Angular library composition selectors for left region, SWID copy, time, and time zone.",
      },
      source: {
        type: "code",
        language: "html",
        code: FOOTER_LIB_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      copySwid: (swid) => {
        args.copySwid?.(swid);
      },
      timeZoneClick: () => {
        args.timeZoneClick?.();
      },
    },
    template: FOOTER_LIB_SPEC_ACCURATE_TEMPLATE,
  }),
  args: {
    hostname: FOOTER_SPEC_ACCURATE_DEFAULTS.hostname,
    swid: FOOTER_SPEC_ACCURATE_DEFAULTS.swid,
    currentDateTime: FOOTER_SPEC_ACCURATE_DEFAULTS.currentDateTime,
    timeZoneLabel: FOOTER_SPEC_ACCURATE_DEFAULTS.timeZoneLabel,
    copyDisabled: FOOTER_SPEC_ACCURATE_DEFAULTS.copyDisabled,
    timeZoneDisabled: FOOTER_SPEC_ACCURATE_DEFAULTS.timeZoneDisabled,
  },
};

/** @type {import("@storybook/angular").StoryObj<IdsFooterComponent>} */
export const HostAndSwidOnly = {
  render: () => ({
    template: FOOTER_LIB_HOST_ONLY_TEMPLATE,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsFooterComponent>} */
export const TimeAndZoneOnly = {
  render: () => ({
    template: FOOTER_LIB_TIME_ONLY_TEMPLATE,
  }),
};
