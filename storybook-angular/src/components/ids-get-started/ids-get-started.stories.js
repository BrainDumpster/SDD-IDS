import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import { GET_STARTED_SPEC_ACCURATE_DEFAULTS } from "../../../compiled/component-contracts/ids/get-started.contract.js";
import { IdsGetStartedComponent } from "../../../compiled/lib/angular/ids/get-started/ids-get-started.component.js";
import { IDS_GET_STARTED_IMPORTS } from "../../../compiled/lib/angular/ids/get-started/index.js";
import {
  GET_STARTED_DOCS_DESCRIPTION,
  GET_STARTED_OVERFLOW_CARDS,
  GET_STARTED_SOURCE_CODE,
  GET_STARTED_SPEC_CARDS,
  GET_STARTED_STORY_SOURCE_CODE,
  SAMPLE_DESCRIPTION,
  SAMPLE_NOTE,
} from "./ids-get-started.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsGetStartedComponent>} */
const meta = {
  title: "Spec Generated/IDS/Get Started",
  component: IdsGetStartedComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_GET_STARTED_IMPORTS],
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: GET_STARTED_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: GET_STARTED_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    overflow: { control: "boolean" },
    sequential: { control: "boolean" },
    overflowPage: {
      control: "radio",
      options: ["single", "page1", "page2"],
    },
    showMasthead: { control: "boolean" },
    headerActionsDisabled: { control: "boolean" },
    productName: { control: "text" },
    skipButtonText: { control: "text" },
    cards: { control: false, table: { disable: true } },
    onConfigure: { action: "onConfigure" },
    onSkip: { action: "onSkip" },
    onOverflowNavigate: { action: "onOverflowNavigate" },
  },
};

export default meta;

const storyFrameStyle =
  "width: 100%; height: 100dvh; min-height: 0; overflow: auto;";

/** @type {import("@storybook/angular").StoryObj<IdsGetStartedComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Figma `Overflow=False, Sequential=False, Single-Page` — `12189:233185`.",
      },
      source: {
        type: "code",
        language: "html",
        code: GET_STARTED_STORY_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      cards: GET_STARTED_SPEC_CARDS,
    },
    template: `
      <div style="${storyFrameStyle}">
        <div style="min-width: 1800px; height: 100%;">
          <ids-get-started
            [title]="title"
            [subtitle]="subtitle"
            [cards]="cards"
            [overflow]="overflow"
            [sequential]="sequential"
            [overflowPage]="overflowPage"
            [showMasthead]="showMasthead"
            [headerActionsDisabled]="headerActionsDisabled"
            [productName]="productName"
            [skipButtonText]="skipButtonText"
            (onConfigure)="onConfigure($event)"
            (onSkip)="onSkip()"
            (onOverflowNavigate)="onOverflowNavigate($event)"
          />
        </div>
      </div>
    `,
  }),
  args: {
    title: GET_STARTED_SPEC_ACCURATE_DEFAULTS.title,
    subtitle: GET_STARTED_SPEC_ACCURATE_DEFAULTS.subtitle,
    overflow: GET_STARTED_SPEC_ACCURATE_DEFAULTS.overflow,
    sequential: GET_STARTED_SPEC_ACCURATE_DEFAULTS.sequential,
    overflowPage: GET_STARTED_SPEC_ACCURATE_DEFAULTS.overflowPage,
    showMasthead: GET_STARTED_SPEC_ACCURATE_DEFAULTS.showMasthead,
    headerActionsDisabled:
      GET_STARTED_SPEC_ACCURATE_DEFAULTS.headerActionsDisabled,
    productName: GET_STARTED_SPEC_ACCURATE_DEFAULTS.productName,
    skipButtonText: GET_STARTED_SPEC_ACCURATE_DEFAULTS.skipButtonText,
  },
};

/** Figma card element states — `12023:228883` */
export const CardStates = {
  render: (args) => ({
    props: {
      ...args,
      showMasthead: false,
      cards: [
        {
          id: "not-completed",
          title: "SupportAssist",
          description: SAMPLE_DESCRIPTION,
          note: SAMPLE_NOTE,
          iconShapeName: "wrench-alt-short",
          cardState: "not-completed",
        },
        {
          id: "completed",
          title: "SupportAssist",
          description: SAMPLE_DESCRIPTION,
          note: SAMPLE_NOTE,
          iconShapeName: "wrench-alt-short",
          cardState: "completed",
        },
        {
          id: "required",
          title: "SupportAssist",
          description: SAMPLE_DESCRIPTION,
          note: SAMPLE_NOTE,
          iconShapeName: "wrench-alt-short",
          cardState: "required",
        },
      ],
    },
    template: `
      <div style="${storyFrameStyle}">
        <div style="min-width: 1100px; height: 100%;">
          <ids-get-started
            [cards]="cards"
            [showMasthead]="showMasthead"
            (onConfigure)="onConfigure($event)"
            (onSkip)="onSkip()"
          />
        </div>
      </div>
    `,
  }),
};

/** Figma `Overflow=True` — right-edge overlay while more cards remain (`12189:233198`) */
export const OverflowMoreCards = {
  name: "Overflow — more cards",
  render: (args) => ({
    props: {
      ...args,
      cards: GET_STARTED_OVERFLOW_CARDS,
      overflow: true,
    },
    template: `
      <div style="width: 100%; height: 100dvh;">
        <div style="width: min(1100px, 100%); height: 100%; margin: 0 auto;">
          <ids-get-started
            [cards]="cards"
            [overflow]="overflow"
            (onConfigure)="onConfigure($event)"
            (onSkip)="onSkip()"
            (onOverflowNavigate)="onOverflowNavigate($event)"
          />
        </div>
      </div>
    `,
  }),
};

/** Figma left-edge overflow when scrolled (`12189:233211`) */
export const OverflowLeftEdge = {
  name: "Overflow — left edge",
  render: (args) => ({
    props: {
      ...args,
      cards: GET_STARTED_OVERFLOW_CARDS,
      overflow: true,
      scrollToEnd: true,
    },
    template: `
      <div
        style="width: 100%; height: 100dvh;"
        #host
      >
        <div style="width: min(1100px, 100%); height: 100%; margin: 0 auto;">
          <ids-get-started
            [cards]="cards"
            [overflow]="overflow"
            (onConfigure)="onConfigure($event)"
            (onSkip)="onSkip()"
            (onOverflowNavigate)="onOverflowNavigate($event)"
          />
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const track = canvasElement.querySelector("[data-gs-card-track]");
    if (track) {
      track.scrollLeft = track.scrollWidth;
      track.dispatchEvent(new Event("scroll"));
    }
  },
};

/** Figma `Overflow=False, Sequential=True, Single-Page` — `12189:233218` */
export const SequentialSinglePage = {
  render: (args) => ({
    props: {
      ...args,
      cards: GET_STARTED_SPEC_CARDS.slice(0, 2),
      sequential: true,
    },
    template: `
      <div style="${storyFrameStyle}">
        <div style="min-width: 800px; height: 100%;">
          <ids-get-started
            [cards]="cards"
            [sequential]="sequential"
            (onConfigure)="onConfigure($event)"
            (onSkip)="onSkip()"
          />
        </div>
      </div>
    `,
  }),
};

/** Figma `Overflow=True, Sequential=True` — `12189:233223` */
export const SequentialOverflowPageOne = {
  render: (args) => ({
    props: {
      ...args,
      cards: GET_STARTED_OVERFLOW_CARDS,
      sequential: true,
      overflow: true,
      overflowPage: "page1",
    },
    template: `
      <div style="width: 100%; height: 100dvh;">
        <div style="width: min(900px, 100%); height: 100%; margin: 0 auto;">
          <ids-get-started
            [cards]="cards"
            [sequential]="sequential"
            [overflow]="overflow"
            [overflowPage]="overflowPage"
            (onConfigure)="onConfigure($event)"
            (onSkip)="onSkip()"
            (onOverflowNavigate)="onOverflowNavigate($event)"
          />
        </div>
      </div>
    `,
  }),
};
