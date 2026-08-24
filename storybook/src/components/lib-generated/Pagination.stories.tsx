/**
 * Storybook: design-spec–generated Pagination from `lib/react/ids/pagination`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy:
 *   PaginationRoot → ResultsPerPageGroup? → PageNavigationGroup
 *     (First + Prev + PageInput + PageCountText + Next + Last)
 *
 * Composition: lib `IdsIcon` (nav 16×16, caret 10×10).
 * Theme: components/ids-theme.css
 * Spec: components/ids/pagination/design-spec.md
 */
import React, { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsPagination,
  type IdsPaginationProps,
} from "../../../../lib/react/ids/pagination";

const DESIGN_SPEC_PATH = "components/ids/pagination/design-spec.md";

/** Main row sample — Figma `11677:157848` / page navigation `11677:157817`. */
const specAccurateArgs: IdsPaginationProps = {
  currentPage: 2,
  totalPages: 16,
  pageSize: 25,
  pageSizeOptions: [25, 50, 75, 100],
  showResultsPerPage: true,
  background: "gray",
  disabled: false,
  responsiveMode: "auto",
  onPageChange: () => undefined,
};

const frameStyle: React.CSSProperties = {
  padding: 20,
  maxWidth: 960,
  width: "100%",
  boxSizing: "border-box",
};

const stackStyle: React.CSSProperties = {
  ...frameStyle,
  display: "grid",
  gap: 20,
};

const checkerboardStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, #e8e8e8 25%, transparent 25%), linear-gradient(-45deg, #e8e8e8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e8e8e8 75%), linear-gradient(-45deg, transparent 75%, #e8e8e8 75%)",
  backgroundSize: "12px 12px",
  backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0",
  padding: 12,
};

function StoryCaption({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 600,
        lineHeight: "16px",
        color: "var(--color-text-gray-neutral-strong)",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function StoryRow({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <StoryCaption>{caption}</StoryCaption>
      {children}
    </div>
  );
}

function ControlledPagination(
  props: Omit<IdsPaginationProps, "onPageChange" | "onPageSizeChange"> & {
    onPageChange?: IdsPaginationProps["onPageChange"];
    onPageSizeChange?: IdsPaginationProps["onPageSizeChange"];
  },
) {
  const {
    currentPage: currentPageProp,
    pageSize: pageSizeProp,
    onPageChange,
    onPageSizeChange,
    ...rest
  } = props;
  const [page, setPage] = useState(currentPageProp);
  const [pageSize, setPageSize] = useState(pageSizeProp ?? 25);

  useEffect(() => {
    setPage(currentPageProp);
  }, [currentPageProp]);

  useEffect(() => {
    if (pageSizeProp != null) setPageSize(pageSizeProp);
  }, [pageSizeProp]);

  return (
    <IdsPagination
      {...rest}
      currentPage={page}
      pageSize={pageSize}
      onPageChange={(next) => {
        setPage(next);
        onPageChange?.(next);
      }}
      onPageSizeChange={(size) => {
        setPageSize(size);
        onPageSizeChange?.(size);
      }}
    />
  );
}

/** Opens the per-page menu on mount for visual QA (no invented forced-state props). */
function OpenPerPageMenuDemo(props: IdsPaginationProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const trigger = wrapRef.current?.querySelector<HTMLButtonElement>(
      'button[aria-label="Items per page"]',
    );
    trigger?.click();
  }, []);
  return (
    <div ref={wrapRef} style={{ paddingTop: 8, paddingBottom: 180 }}>
      <ControlledPagination {...props} />
    </div>
  );
}

const meta: Meta<IdsPaginationProps> = {
  title: "Components/IDS/Pagination",
  component: IdsPagination,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          `React IDS Pagination from \`${DESIGN_SPEC_PATH}\`. ` +
          "Anatomy: PaginationRoot → ResultsPerPageGroup? → PageNavigationGroup " +
          "(First / Prev / PageInput / PageCountText / Next / Last). " +
          "Page number is a numeric text input (never a dropdown). " +
          "Composes lib `IdsIcon`. Theme: `components/ids-theme.css`. " +
          "No `@base-ui-components`.",
      },
    },
  },
  args: specAccurateArgs,
  argTypes: {
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    pageSize: { control: { type: "number", min: 1 } },
    background: {
      control: "select",
      options: ["gray", "white", "none"],
    },
    showResultsPerPage: { control: "boolean" },
    disabled: { control: "boolean" },
    responsiveMode: {
      control: "select",
      options: ["auto", "keep-inline"],
    },
    onPageChange: { action: "onPageChange" },
    onPageSizeChange: { action: "onPageSizeChange" },
  },
};

export default meta;
type Story = StoryObj<IdsPaginationProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => (
    <div style={frameStyle}>
      <ControlledPagination {...args} />
    </div>
  ),
};

export const BackgroundModes: Story = {
  name: "Background Modes",
  render: () => (
    <div style={stackStyle}>
      <StoryRow caption='background="gray" (default)'>
        <ControlledPagination {...specAccurateArgs} background="gray" />
      </StoryRow>
      <StoryRow caption='background="white"'>
        <ControlledPagination {...specAccurateArgs} background="white" />
      </StoryRow>
      <StoryRow caption='background="none"'>
        <div style={checkerboardStyle}>
          <ControlledPagination {...specAccurateArgs} background="none" />
        </div>
      </StoryRow>
    </div>
  ),
};

export const PageNavigationStates: Story = {
  name: "Page Navigation States",
  render: () => (
    <div style={stackStyle}>
      <StoryRow caption="First page — first/prev disabled">
        <ControlledPagination
          {...specAccurateArgs}
          currentPage={1}
          totalPages={16}
        />
      </StoryRow>
      <StoryRow caption="Middle page — all nav active">
        <ControlledPagination
          {...specAccurateArgs}
          currentPage={2}
          totalPages={16}
        />
      </StoryRow>
      <StoryRow caption="Last page — next/last disabled">
        <ControlledPagination
          {...specAccurateArgs}
          currentPage={16}
          totalPages={16}
        />
      </StoryRow>
      <StoryRow caption='Single page — "1 page"'>
        <ControlledPagination
          {...specAccurateArgs}
          currentPage={1}
          totalPages={1}
        />
      </StoryRow>
    </div>
  ),
};

export const PerPageDropdownOpen: Story = {
  name: "Per-Page Dropdown Open",
  render: () => (
    <div style={frameStyle}>
      <OpenPerPageMenuDemo {...specAccurateArgs} />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div style={frameStyle}>
      <IdsPagination {...specAccurateArgs} disabled />
    </div>
  ),
};

export const WithoutResultsPerPage: Story = {
  name: "Without Results Per Page",
  render: () => (
    <div style={frameStyle}>
      <ControlledPagination
        {...specAccurateArgs}
        showResultsPerPage={false}
      />
    </div>
  ),
};

export const NarrowContainer: Story = {
  name: "Narrow Container (responsive auto)",
  render: () => (
    <div style={{ ...frameStyle, maxWidth: 360 }}>
      <ControlledPagination
        {...specAccurateArgs}
        responsiveMode="auto"
        collapseOrder={["results-per-page"]}
      />
    </div>
  ),
};
