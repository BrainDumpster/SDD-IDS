import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import { IdsAppShellDemoHostComponent } from "../../../compiled/lib/angular/ids/app-shell/ids-app-shell-demo-host.component.js";
import { IDS_APP_SHELL_IMPORTS } from "../../../compiled/lib/angular/ids/app-shell/index.js";
import {
  APP_SHELL_LIB_DOCS_DESCRIPTION,
  APP_SHELL_LIB_SOURCE_CODE,
  APP_SHELL_LIB_STORY_SOURCE_CODE,
} from "./ids-app-shell-lib.developer-usage.js";

/** @type {import("@storybook/angular").Meta} */
const meta = {
  title: "Spec Generated/IDS/App Shell",
  component: IdsAppShellDemoHostComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_APP_SHELL_IMPORTS, IdsAppShellDemoHostComponent],
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: APP_SHELL_LIB_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: APP_SHELL_LIB_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    breakpointPreset: {
      control: "select",
      options: ["fluid", "1920", "1600", "1366", "1024"],
    },
    defaultMenuExpanded: { control: "boolean" },
    mastheadProductName: { control: "text" },
    mastheadProductIconSlug: { control: "text" },
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Figma `43478:46307` (Screen size=1920) — Angular library App Shell composing Masthead, Main Menu Left, page header, body slot, Footer, and App Launcher (see design-spec Spec Accurate Design).",
      },
      source: {
        type: "code",
        language: "html",
        code: APP_SHELL_LIB_STORY_SOURCE_CODE,
      },
    },
  },
  args: {
    breakpointPreset: "1920",
    defaultPageId: "dashboard",
    defaultMenuExpanded: true,
    mastheadProductName: "Product Name",
    mastheadProductIconSlug: "shield-cloud",
    footerHostname: "short_name_first_domain_name",
    footerSwid: "ELMCR00222GBPB",
    footerCurrentDateTime: "Tue, 2023-04-23 12:30 AM",
    footerTimeZoneLabel: "Eastern Time (US & Canada)",
  },
};

/** @type {import("@storybook/angular").StoryObj} */
export const CollapsedMenu1366 = {
  name: "Collapsed menu (1366)",
  parameters: {
    docs: {
      description: {
        story: "Figma `43478:90925` — Screen size=1366 defaults menu collapsed (64px rail).",
      },
    },
  },
  args: {
    ...SpecAccurateDesign.args,
    breakpointPreset: "1366",
    defaultMenuExpanded: false,
  },
};

/** @type {import("@storybook/angular").StoryObj} */
export const CollapsedMenu1024 = {
  name: "Collapsed menu (1024)",
  parameters: {
    docs: {
      description: {
        story: "Figma `43478:91081` — Screen size=1024 defaults menu collapsed.",
      },
    },
  },
  args: {
    ...SpecAccurateDesign.args,
    breakpointPreset: "1024",
    defaultMenuExpanded: false,
  },
};
