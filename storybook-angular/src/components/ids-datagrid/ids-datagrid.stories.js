/* component: datagrid — Angular composition stories */
import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import { DATAGRID_SPEC_ACCURATE_DEFAULTS } from "../../../compiled/component-contracts/ids/datagrid.contract.js";
import { IdsDatagridDemoHostComponent } from "../../../compiled/lib/angular/ids/datagrid/ids-datagrid-demo-host.component.js";
import { IDS_DATAGRID_IMPORTS } from "../../../compiled/lib/angular/ids/datagrid/index.js";
import {
  DATAGRID_DOCS_DESCRIPTION,
  DATAGRID_SOURCE_CODE,
  DATAGRID_STORY_SOURCE_CODE,
} from "./ids-datagrid.developer-usage.js";

/** @type {import("@storybook/angular").Meta<IdsDatagridDemoHostComponent>} */
const meta = {
  title: "Components/IDS/Datagrid",
  component: IdsDatagridDemoHostComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_DATAGRID_IMPORTS],
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { sourceState: "open" },
      description: { component: DATAGRID_DOCS_DESCRIPTION },
      source: {
        type: "code",
        language: "typescript",
        code: DATAGRID_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    rowSelection: { control: "boolean" },
    selectionMode: { control: "radio", options: ["single", "multiple"] },
    showSingleSelectionRadio: { control: "boolean" },
    withDetailPanel: { control: "boolean" },
    pageSize: { control: "number" },
    readOnly: { control: "boolean" },
    rowVerticalIndicator: { control: "boolean" },
    headerColorAndBorder: { control: "boolean" },
    columnResizeEnabled: { control: "boolean" },
  },
};

export default meta;

const storyFrameStyles = {
  width: "100%",
  height: "100dvh",
  boxSizing: "border-box",
  padding: "clamp(8px, 2vw, 16px)",
  background: "var(--color-background-surface-primary)",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  minWidth: 0,
};

const storyTemplate = `
  <div [ngStyle]="frameStyles">
    <div style="flex:1;min-height:0;min-width:0;display:flex;flex-direction:column;">
      <ids-datagrid-demo-host
        [rowSelection]="rowSelection"
        [selectionMode]="selectionMode"
        [showSingleSelectionRadio]="showSingleSelectionRadio"
        [withDetailPanel]="withDetailPanel"
        [pageSize]="pageSize"
        [readOnly]="readOnly"
        [rowVerticalIndicator]="rowVerticalIndicator"
        [headerColorAndBorder]="headerColorAndBorder"
        [columnResizeEnabled]="columnResizeEnabled"
      />
    </div>
  </div>
`;

/** @type {import("@storybook/angular").StoryObj<IdsDatagridDemoHostComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  parameters: {
    docs: {
      description: {
        story:
          "Spec Accurate Design: composition API with projected columns, rows, spec filters, and IDS Pagination footer — Figma `37721:112482`.",
      },
      source: {
        type: "code",
        language: "html",
        code: DATAGRID_STORY_SOURCE_CODE,
      },
    },
  },
  args: { ...DATAGRID_SPEC_ACCURATE_DEFAULTS },
  render: (args) => ({
    props: { ...args, frameStyles: storyFrameStyles },
    template: storyTemplate,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsDatagridDemoHostComponent>} */
export const HeaderMinimal = {
  render: (args) => ({
    props: {
      ...args,
      ...DATAGRID_SPEC_ACCURATE_DEFAULTS,
      headerColorAndBorder: false,
      frameStyles: storyFrameStyles,
    },
    template: storyTemplate,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsDatagridDemoHostComponent>} */
export const ReadOnlyTableHover = {
  render: (args) => ({
    props: {
      ...args,
      ...DATAGRID_SPEC_ACCURATE_DEFAULTS,
      readOnly: true,
      frameStyles: storyFrameStyles,
    },
    template: storyTemplate,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsDatagridDemoHostComponent>} */
export const WithoutVerticalSelectionIndicator = {
  render: (args) => ({
    props: {
      ...args,
      ...DATAGRID_SPEC_ACCURATE_DEFAULTS,
      rowVerticalIndicator: false,
      frameStyles: storyFrameStyles,
    },
    template: storyTemplate,
  }),
};
