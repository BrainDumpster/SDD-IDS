/**
 * Storybook: IDS Lit Pagination from `lib/lit/ids/pagination`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/pagination/design-spec.md
 * API: lib/react/ids/pagination
 * Examples: storybook/src/components/lib-generated/Pagination.stories.tsx
 *
 * Live Figma verified (file `0bHk3XhrjFhowgFkz9yLr4`):
 *   Main `11677:157840` · page nav `11677:157817` · per-page `37721:115839`
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/pagination/register.js";
import {
  PAGINATION_DOCS_DESCRIPTION,
  PAGINATION_SOURCE_CODE,
} from "./ids-pagination.developer-usage";

type PaginationArgs = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  showResultsPerPage: boolean;
  background: "gray" | "white" | "none";
  responsiveMode: "auto" | "keep-inline";
};

/** Spec Accurate Design — Figma Main / page navigation sample. */
const specAccurateArgs: PaginationArgs = {
  currentPage: 2,
  totalPages: 16,
  pageSize: 25,
  pageSizeOptions: [25, 50, 75, 100],
  showResultsPerPage: true,
  background: "gray",
  responsiveMode: "auto",
};

const frameStyle =
  "padding:20px;max-width:960px;width:100%;box-sizing:border-box;";
const stackStyle = `${frameStyle}display:grid;gap:20px;`;
const checkerboardStyle =
  "background-image:linear-gradient(45deg,#e8e8e8 25%,transparent 25%),linear-gradient(-45deg,#e8e8e8 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e8e8e8 75%),linear-gradient(-45deg,transparent 75%,#e8e8e8 75%);background-size:12px 12px;background-position:0 0,0 6px,6px -6px,-6px 0;padding:12px;";

function caption(text: string) {
  return html`
    <div
      style="font-size:12px;font-weight:600;line-height:16px;color:var(--color-text-gray-neutral-strong);margin-bottom:8px;"
    >
      ${text}
    </div>
  `;
}

function renderPagination(
  args: PaginationArgs,
  handlers?: {
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  },
) {
  return html`
    <ids-pagination
      currentpage=${args.currentPage}
      totalpages=${args.totalPages}
      pagesize=${args.pageSize}
      .pageSizeOptions=${args.pageSizeOptions}
      showresultsperpage=${args.showResultsPerPage ? "true" : "false"}
      background=${args.background}
      responsivemode=${args.responsiveMode}
      .onPageChange=${handlers?.onPageChange}
      .onPageSizeChange=${handlers?.onPageSizeChange}
    ></ids-pagination>
  `;
}

const meta: Meta<PaginationArgs> = {
  title: "Spec Generated/IDS/Pagination",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: PAGINATION_DOCS_DESCRIPTION },
      source: { code: PAGINATION_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    pageSize: { control: { type: "number", min: 1 } },
    background: {
      control: "select",
      options: ["gray", "white", "none"],
    },
    showResultsPerPage: { control: "boolean" },
    responsiveMode: {
      control: "select",
      options: ["auto", "keep-inline"],
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<PaginationArgs>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => {
    const [, updateArgs] = useArgs();
    return html`
      <div style=${frameStyle}>
        ${renderPagination(args, {
          onPageChange: (page) => updateArgs({ currentPage: page }),
          onPageSizeChange: (size) => updateArgs({ pageSize: size }),
        })}
      </div>
    `;
  },
};

export const BackgroundModes: Story = {
  name: "Background Modes",
  render: () => html`
    <div style=${stackStyle}>
      <div>
        ${caption('background="gray" (default)')}
        ${renderPagination({ ...specAccurateArgs, background: "gray" })}
      </div>
      <div>
        ${caption('background="white"')}
        ${renderPagination({ ...specAccurateArgs, background: "white" })}
      </div>
      <div>
        ${caption('background="none"')}
        <div style=${checkerboardStyle}>
          ${renderPagination({ ...specAccurateArgs, background: "none" })}
        </div>
      </div>
    </div>
  `,
};

export const PageNavigationStates: Story = {
  name: "Page Navigation States",
  render: () => html`
    <div style=${stackStyle}>
      <div>
        ${caption("First page — first/prev disabled")}
        ${renderPagination({
          ...specAccurateArgs,
          currentPage: 1,
          totalPages: 16,
        })}
      </div>
      <div>
        ${caption("Middle page — all nav active")}
        ${renderPagination({
          ...specAccurateArgs,
          currentPage: 2,
          totalPages: 16,
        })}
      </div>
      <div>
        ${caption("Last page — next/last disabled")}
        ${renderPagination({
          ...specAccurateArgs,
          currentPage: 16,
          totalPages: 16,
        })}
      </div>
      <div>
        ${caption('Single page — "1 page"')}
        ${renderPagination({
          ...specAccurateArgs,
          currentPage: 1,
          totalPages: 1,
        })}
      </div>
    </div>
  `,
};

export const PerPageDropdownOpen: Story = {
  name: "Per-Page Dropdown Open",
  args: specAccurateArgs,
  render: (args) => {
    const [, updateArgs] = useArgs();
    // Open the menu after mount for visual QA (mirrors React OpenPerPageMenuDemo).
    requestAnimationFrame(() => {
      const hosts = document.querySelectorAll("ids-pagination");
      const host = hosts[hosts.length - 1] as HTMLElement | undefined;
      host
        ?.shadowRoot?.querySelector<HTMLButtonElement>(
          'button[aria-label="Items per page"]',
        )
        ?.click();
    });
    return html`
      <div style="${frameStyle}padding-top:8px;padding-bottom:180px;">
        ${renderPagination(args, {
          onPageChange: (page) => updateArgs({ currentPage: page }),
          onPageSizeChange: (size) => updateArgs({ pageSize: size }),
        })}
      </div>
    `;
  },
};
