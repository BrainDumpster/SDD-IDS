from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_detail_panel_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("detail-panel", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsDetailPanel"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useState }} from "react";
import {{
  IdsDetailPanel as {component_name},
  IdsDetailPanelField,
  IdsDetailPanelSection,
  type IdsDetailPanelAttachMode,
}} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Detail Panel",
  component: {component_name},
  parameters: {{ layout: "fullscreen" }},
  args: {{ attachMode: "datagrid", isExpanded: true, title: "Details" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

/** Figma "Detail Panel Template": section headers with label / value rows, ruled apart. */
function ExampleContent() {{
  return (
    <>
      <IdsDetailPanelSection title="Section Header">
        <IdsDetailPanelField label="Label:">Single line content</IdsDetailPanelField>
        <IdsDetailPanelField label="Label:">Multiple line content that wraps onto the next line when it is longer than the panel width</IdsDetailPanelField>
      </IdsDetailPanelSection>
      <IdsDetailPanelSection title="Section Header">
        <IdsDetailPanelField label="Status:">Warning</IdsDetailPanelField>
      </IdsDetailPanelSection>
    </>
  );
}}

function PanelFrame({{ attachMode, initialExpanded }}: {{ attachMode: IdsDetailPanelAttachMode; initialExpanded: boolean }}) {{
  const [expanded, setExpanded] = useState(initialExpanded);
  return (
    <div style={{{{ height: "100vh", background: "var(--color-background-surface-primary)", padding: 16, boxSizing: "border-box" }}}}>
      <div style={{{{ display: "flex", height: 768, border: "1px solid var(--color-border-gray-neutral-base)", background: "var(--color-background-surface-component)" }}}}>
        <main style={{{{ flex: 1, minWidth: 0, padding: 16, boxSizing: "border-box", overflow: "auto" }}}}>Host content</main>
        <{component_name} attachMode={{attachMode}} isExpanded={{expanded}} onExpandedChange={{setExpanded}} title="Details" body={{<ExampleContent />}} />
      </div>
    </div>
  );
}}

export const DatagridAttached: Story = {{ render: () => <PanelFrame attachMode="datagrid" initialExpanded={{true}} /> }};
export const PageAttached: Story = {{ render: () => <PanelFrame attachMode="page" initialExpanded={{true}} /> }};

export const FocusVisibleReference: Story = {{
  render: () => (
    <div style={{{{ padding: 16, color: "var(--color-text-gray-neutral)" }}}}>
      focus-visible reference: panel header action and toggle affordance must expose keyboard-visible focus ring.
      <div style={{{{ marginTop: 12 }}}}>
        <PanelFrame attachMode="datagrid" initialExpanded={{false}} />
      </div>
    </div>
  ),
}};
"""
