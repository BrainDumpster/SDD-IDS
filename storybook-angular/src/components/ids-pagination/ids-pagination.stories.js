import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideZoneChangeDetection } from "@angular/core";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../compiled/component-contracts/common/story-meta.js";
import {
  IDS_PAGINATION_DESIGN_SPEC_PATH,
  PAGINATION_BACKGROUND_OPTIONS,
  PAGINATION_DROPDOWN_STATES,
  PAGINATION_RESPONSIVE_MODES,
  PAGINATION_SPEC_ACCURATE_DEFAULTS,
} from "../../../compiled/component-contracts/ids/pagination.contract.js";
import { IdsPaginationComponent } from "../../../compiled/lib/angular/ids/pagination/ids-pagination.component.js";
import { IDS_PAGINATION_IMPORTS } from "../../../compiled/lib/angular/ids/pagination/index.js";
import {
  PAGINATION_DOCS_DESCRIPTION,
  PAGINATION_SOURCE_CODE,
} from "./ids-pagination.developer-usage.js";

const frameStyle = "padding: 20px; max-width: 960px;";
const stackStyle = "padding: 20px; max-width: 960px; display: grid; gap: 20px;";
const checkerboardStyle =
  "background-image: linear-gradient(45deg, #e8e8e8 25%, transparent 25%), linear-gradient(-45deg, #e8e8e8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e8e8e8 75%), linear-gradient(-45deg, transparent 75%, #e8e8e8 75%); background-size: 12px 12px; background-position: 0 0, 0 6px, 6px -6px, -6px 0; padding: 12px; border-radius: 4px;";

/** @type {import("@storybook/angular").Meta<IdsPaginationComponent>} */
const meta = {
  title: "Components/IDS/Pagination",
  component: IdsPaginationComponent,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideZoneChangeDetection()],
    }),
    moduleMetadata({
      imports: [...IDS_PAGINATION_IMPORTS],
    }),
  ],
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: PAGINATION_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "typescript",
        code: PAGINATION_SOURCE_CODE,
      },
    },
  },
  argTypes: {
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    pageSize: { control: "select", options: [10, 25, 50, 75, 100] },
    pageSizeOptions: { control: "object" },
    showPerPage: { control: "boolean" },
    showFirstLast: { control: "boolean" },
    background: { control: "radio", options: PAGINATION_BACKGROUND_OPTIONS },
    dropdownState: { control: "select", options: PAGINATION_DROPDOWN_STATES },
    responsiveMode: { control: "select", options: PAGINATION_RESPONSIVE_MODES },
    collapseOrder: { control: "object" },
    disabled: { control: "boolean" },
    pageChange: { action: "pageChange" },
    pageSizeChange: { action: "pageSizeChange" },
    firstPageNavigate: { action: "firstPageNavigate" },
    previousPageNavigate: { action: "previousPageNavigate" },
    nextPageNavigate: { action: "nextPageNavigate" },
    lastPageNavigate: { action: "lastPageNavigate" },
  },
  args: {
    ...PAGINATION_SPEC_ACCURATE_DEFAULTS,
    pageSizeOptions: [...PAGINATION_SPEC_ACCURATE_DEFAULTS.pageSizeOptions],
  },
};

export default meta;

/** @type {import("@storybook/angular").StoryObj<IdsPaginationComponent>} */
export const SpecAccurateDesign = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: (args) => ({
    props: {
      ...args,
      currentPage: args.currentPage ?? 1,
      pageSize: args.pageSize ?? 25,
      onPageChange(page) {
        args.pageChange?.(page);
        this.currentPage = page;
      },
      onPageSizeChange(size) {
        args.pageSizeChange?.(size);
        this.pageSize = size;
      },
    },
    template: `
      <div style="${frameStyle}">
        <ids-pagination
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          [pageSize]="pageSize"
          [pageSizeOptions]="pageSizeOptions"
          [showPerPage]="showPerPage"
          [showFirstLast]="showFirstLast"
          [background]="background"
          [dropdownState]="dropdownState"
          [responsiveMode]="responsiveMode"
          [collapseOrder]="collapseOrder"
          [disabled]="disabled"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
          (firstPageNavigate)="firstPageNavigate($event)"
          (previousPageNavigate)="previousPageNavigate($event)"
          (nextPageNavigate)="nextPageNavigate($event)"
          (lastPageNavigate)="lastPageNavigate($event)"
        ></ids-pagination>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsPaginationComponent>} */
export const BackgroundModes = {
  render: () => ({
    props: { ...PAGINATION_SPEC_ACCURATE_DEFAULTS, pageSizeOptions: [25, 50, 75, 100] },
    template: `
      <div style="${stackStyle}">
        <div>
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">background="gray" (default)</div>
          <ids-pagination [currentPage]="1" [totalPages]="16" background="gray" [pageSizeOptions]="pageSizeOptions"></ids-pagination>
        </div>
        <div>
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">background="white"</div>
          <ids-pagination [currentPage]="1" [totalPages]="16" background="white" [pageSizeOptions]="pageSizeOptions"></ids-pagination>
        </div>
        <div>
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">background="none"</div>
          <div style="${checkerboardStyle}">
            <ids-pagination [currentPage]="1" [totalPages]="16" background="none" [pageSizeOptions]="pageSizeOptions"></ids-pagination>
          </div>
        </div>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsPaginationComponent>} */
export const PageNavigationStates = {
  render: () => ({
    props: { pageSizeOptions: [25, 50, 75, 100] },
    template: `
      <div style="${stackStyle}">
        <div>
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">First page — first/prev disabled</div>
          <ids-pagination [currentPage]="1" [totalPages]="16" [pageSizeOptions]="pageSizeOptions"></ids-pagination>
        </div>
        <div>
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Middle page — all nav active</div>
          <ids-pagination [currentPage]="2" [totalPages]="16" [pageSizeOptions]="pageSizeOptions"></ids-pagination>
        </div>
        <div>
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Last page — next/last disabled</div>
          <ids-pagination [currentPage]="16" [totalPages]="16" [pageSizeOptions]="pageSizeOptions"></ids-pagination>
        </div>
        <div>
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Single page — "1 page"</div>
          <ids-pagination [currentPage]="1" [totalPages]="1" [pageSizeOptions]="pageSizeOptions"></ids-pagination>
        </div>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsPaginationComponent>} */
export const PerPageDropdownOpen = {
  render: () => ({
    template: `
      <div style="${frameStyle}">
        <ids-pagination [currentPage]="1" [totalPages]="16" dropdownState="expanded-below"></ids-pagination>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsPaginationComponent>} */
export const ResponsiveCollapse = {
  render: () => ({
    template: `
      <div style="padding: 20px; max-width: 320px;">
        <ids-pagination
          [currentPage]="2"
          [totalPages]="16"
          responsiveMode="auto"
          [collapseOrder]="['results-per-page', 'page-input', 'first-last-buttons']"
        ></ids-pagination>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsPaginationComponent>} */
export const Disabled = {
  render: () => ({
    template: `
      <div style="${frameStyle}">
        <ids-pagination [currentPage]="2" [totalPages]="16" [disabled]="true"></ids-pagination>
      </div>
    `,
  }),
};

/** @type {import("@storybook/angular").StoryObj<IdsPaginationComponent>} */
export const WithoutFirstLast = {
  render: () => ({
    template: `
      <div style="${frameStyle}">
        <ids-pagination [currentPage]="2" [totalPages]="16" [showFirstLast]="false"></ids-pagination>
      </div>
    `,
  }),
};
