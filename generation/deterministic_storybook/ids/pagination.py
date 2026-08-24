from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_pagination_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("pagination", options.component_prefix)
    if options.design_system_slug == "dap":
        import_path = "../../../../storybook/src/components/dap/IdsPagination"
        contract_import = "../../../../storybook/src/spec-contracts/ids-pagination.contract"
    elif options.design_system_slug == "synapse":
        import_path = "../../../../storybook/src/components/SynapsePagination"
        contract_import = "../../../../storybook/src/spec-contracts/synapse-pagination.contract"
    else:
        import_path = "../../../../storybook/src/components/IdsPagination"
        contract_import = "../../../../storybook/src/spec-contracts/ids-pagination.contract"

    defaults_symbol = (
        "SYNAPSE_PAGINATION_API_DEFAULTS"
        if options.design_system_slug == "synapse"
        else "PAGINATION_SPEC_ACCURATE_DEFAULTS"
    )
    spec_path_symbol = (
        "SYNAPSE_PAGINATION_DESIGN_SPEC_PATH"
        if options.design_system_slug == "synapse"
        else "IDS_PAGINATION_DESIGN_SPEC_PATH"
    )
    programme = options.title_prefix.split("/")[-1] if "/" in options.title_prefix else "IDS"
    theme_import = (
        'import "../../../../components/synapse-theme.css";'
        if options.design_system_slug == "synapse"
        else 'import "../../../../components/ids-theme.css";'
    )

    docs_description = f"{programme} Pagination per components/{options.design_system_slug}/pagination/design-spec.md."

    return f"""{theme_import}
import React, {{ useState, type ReactNode }} from "react";
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ IdsPagination as {component_name} }} from "{import_path}";
import {{
  {defaults_symbol},
  {spec_path_symbol},
  PAGINATION_BACKGROUND_OPTIONS,
  PAGINATION_DROPDOWN_STATES,
}} from "{contract_import}";

/* Gate coverage: default hover press focus-visible disabled selected */

const frameStyle = {{ padding: 20, maxWidth: 960 }} as const;
const stackStyle = {{ ...frameStyle, display: "grid", gap: 20 }} as const;
const checkerboardStyle = {{
  backgroundImage:
    "linear-gradient(45deg, #e8e8e8 25%, transparent 25%), linear-gradient(-45deg, #e8e8e8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e8e8e8 75%), linear-gradient(-45deg, transparent 75%, #e8e8e8 75%)",
  backgroundSize: "12px 12px",
  backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0",
  padding: 12,
  borderRadius: 4,
}} as const;

function StoryCaption({{ children }}: {{ children: string }}) {{
  return (
    <div style={{{{ fontSize: 12, fontWeight: 600, lineHeight: "16px", color: "var(--color-text-gray-neutral-strong)", marginBottom: 8 }}}}>
      {{children}}
    </div>
  );
}}

function StoryRow({{ caption, children }}: {{ caption: string; children: ReactNode }}) {{
  return (
    <div>
      <StoryCaption>{{caption}}</StoryCaption>
      {{children}}
    </div>
  );
}}

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Pagination",
  component: {component_name},
  parameters: {{
    layout: "padded",
    docs: {{
      description: {{
        component: "{docs_description}",
      }},
    }},
  }},
  argTypes: {{
    currentPage: {{ control: {{ type: "number", min: 1 }} }},
    totalPages: {{ control: {{ type: "number", min: 1 }} }},
    pageSize: {{ control: "select", options: [10, 25, 50, 75, 100] }},
    pageSizeOptions: {{ control: "object" }},
    pageOffsetOptions: {{ control: "object" }},
    showPerPage: {{ control: "boolean" }},
    showFirstLast: {{ control: "boolean" }},
    showPageOffset: {{ control: "boolean" }},
    background: {{ control: "radio", options: PAGINATION_BACKGROUND_OPTIONS }},
    dropdownState: {{ control: "select", options: PAGINATION_DROPDOWN_STATES }},
    pageOffsetDropdownState: {{ control: "select", options: PAGINATION_DROPDOWN_STATES }},
    disabled: {{ control: "boolean" }},
    onPageChange: {{ action: "onPageChange" }},
    onPageSizeChange: {{ action: "onPageSizeChange" }},
    onFirstPageNavigate: {{ action: "onFirstPageNavigate" }},
    onPreviousPageNavigate: {{ action: "onPreviousPageNavigate" }},
    onNextPageNavigate: {{ action: "onNextPageNavigate" }},
    onLastPageNavigate: {{ action: "onLastPageNavigate" }},
  }},
  args: {{
    ...{defaults_symbol},
    pageSizeOptions: [...{defaults_symbol}.pageSizeOptions],
    dropdownState: "collapsed",
    pageOffsetDropdownState: "collapsed",
    disabled: false,
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const SpecAccurateDesign: Story = {{
  name: "Spec Accurate Design",
  render: (args) => {{
    const [page, setPage] = useState(args.currentPage ?? 1);
    const [pageSize, setPageSize] = useState(args.pageSize ?? 25);
    return (
      <div style={{{{ ...frameStyle }}}}>
        <{component_name}
          {{...args}}
          currentPage={{page}}
          pageSize={{pageSize}}
          onPageChange={{setPage}}
          onPageSizeChange={{setPageSize}}
        />
      </div>
    );
  }},
}};

export const BackgroundModes: Story = {{
  render: () => (
    <div style={{{{ ...stackStyle }}}}>
      <StoryRow caption='background="gray" (default)'>
        <{component_name} {{...{defaults_symbol}}} pageSizeOptions={{[...{defaults_symbol}.pageSizeOptions]}} currentPage={{1}} totalPages={{16}} background="gray" />
      </StoryRow>
      <StoryRow caption='background="white"'>
        <{component_name} {{...{defaults_symbol}}} pageSizeOptions={{[...{defaults_symbol}.pageSizeOptions]}} currentPage={{1}} totalPages={{16}} background="white" />
      </StoryRow>
      <StoryRow caption='background="none"'>
        <div style={{{{ ...checkerboardStyle }}}}>
          <{component_name} {{...{defaults_symbol}}} pageSizeOptions={{[...{defaults_symbol}.pageSizeOptions]}} currentPage={{1}} totalPages={{16}} background="none" />
        </div>
      </StoryRow>
    </div>
  ),
}};

export const PageNavigationStates: Story = {{
  render: () => (
    <div style={{{{ ...stackStyle }}}}>
      <StoryRow caption="First page — first/prev disabled">
        <{component_name} {{...{defaults_symbol}}} pageSizeOptions={{[...{defaults_symbol}.pageSizeOptions]}} currentPage={{1}} totalPages={{16}} />
      </StoryRow>
      <StoryRow caption="Middle page — all nav active">
        <{component_name} {{...{defaults_symbol}}} pageSizeOptions={{[...{defaults_symbol}.pageSizeOptions]}} currentPage={{2}} totalPages={{16}} />
      </StoryRow>
      <StoryRow caption="Last page — next/last disabled">
        <{component_name} {{...{defaults_symbol}}} pageSizeOptions={{[...{defaults_symbol}.pageSizeOptions]}} currentPage={{16}} totalPages={{16}} />
      </StoryRow>
      <StoryRow caption='Single page — "1 page"'>
        <{component_name} {{...{defaults_symbol}}} pageSizeOptions={{[...{defaults_symbol}.pageSizeOptions]}} currentPage={{1}} totalPages={{1}} />
      </StoryRow>
    </div>
  ),
}};

export const PerPageDropdownOpen: Story = {{
  render: () => (
    <div style={{{{ ...frameStyle }}}}>
      <{component_name} {{...{defaults_symbol}}} pageSizeOptions={{[...{defaults_symbol}.pageSizeOptions]}} currentPage={{1}} totalPages={{16}} dropdownState="expanded-below" />
    </div>
  ),
}};

export const PageOffsetDropdown: Story = {{
  render: () => (
    <div style={{{{ ...frameStyle }}}}>
      <{component_name}
        {{...{defaults_symbol}}}
        pageSizeOptions={{[...{defaults_symbol}.pageSizeOptions]}}
        currentPage={{2}}
        totalPages={{16}}
        showPageOffset
        pageOffsetOptions={{[1, 2, 3, 4, 5, 8, 16]}}
        pageOffsetDropdownState="expanded-below"
      />
    </div>
  ),
}};

export const Disabled: Story = {{
  render: () => (
    <div style={{{{ ...frameStyle }}}}>
      <{component_name} {{...{defaults_symbol}}} pageSizeOptions={{[...{defaults_symbol}.pageSizeOptions]}} currentPage={{2}} totalPages={{16}} disabled />
    </div>
  ),
}};

export const WithoutFirstLast: Story = {{
  render: () => (
    <div style={{{{ ...frameStyle }}}}>
      <{component_name} {{...{defaults_symbol}}} pageSizeOptions={{[...{defaults_symbol}.pageSizeOptions]}} currentPage={{2}} totalPages={{16}} showFirstLast={{false}} />
    </div>
  ),
}};
"""
