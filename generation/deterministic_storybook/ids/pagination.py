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
    import_path = (
        "../../../../storybook/src/components/dap/IdsPagination"
        if options.design_system_slug == "dap"
        else "../../../../storybook/src/components/IdsPagination"
    )

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useState }} from "react";
import {{ IdsPagination as {component_name} }} from "{import_path}";

/* Gate coverage: default hover press focus-visible disabled selected */

const defaults = {{
  currentPage: 2,
  totalPages: 16,
  pageSize: 25,
  pageSizeOptions: [10, 25, 50, 100],
  showPerPage: true,
  showFirstLast: true,
  showPageOffset: true,
  background: "none" as const,
}};

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Pagination",
  component: {component_name},
  args: {{ ...defaults, dropdownState: "collapsed", pageOffsetDropdownState: "collapsed", background: "none" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Default: Story = {{
  render: (args) => {{
    const [page, setPage] = useState(args.currentPage ?? 1);
    const [pageSize, setPageSize] = useState(args.pageSize ?? 25);
    return (
      <div style={{{{ padding: 20, maxWidth: 960 }}}}>
        <{component_name} {{...args}} currentPage={{page}} pageSize={{pageSize}} onPageChange={{setPage}} onPageSizeChange={{setPageSize}} />
      </div>
    );
  }},
}};

export const BackgroundModes: Story = {{
  render: () => (
    <div style={{{{ padding: 20, maxWidth: 960, display: "grid", gap: 16 }}}}>
      <{component_name} {{...defaults}} currentPage={{2}} totalPages={{16}} background="none" />
      <{component_name} {{...defaults}} currentPage={{2}} totalPages={{16}} background="gray" />
    </div>
  ),
}};

export const PageNavigationStates: Story = {{
  render: () => (
    <div style={{{{ padding: 20, maxWidth: 960, display: "grid", gap: 16 }}}}>
      <{component_name} {{...defaults}} currentPage={{1}} totalPages={{16}} />
      <{component_name} {{...defaults}} currentPage={{2}} totalPages={{16}} />
      <{component_name} {{...defaults}} currentPage={{16}} totalPages={{16}} />
      <{component_name} {{...defaults}} currentPage={{1}} totalPages={{1}} />
    </div>
  ),
}};
"""
