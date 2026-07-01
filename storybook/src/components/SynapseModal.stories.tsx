import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import { MODAL_FIGMA_BODY } from "@component-contracts/ids/modal.contract";
import { IdsModal } from "./IdsModal";
import { Button } from "./Button";
import { SynapseTabs } from "./SynapseTabs";
import {
  SYNAPSE_MODAL_DESIGN_SPEC_PATH,
  SYNAPSE_MODAL_MAIN_NODE_ID,
} from "../spec-contracts/synapse-modal.contract";

const synapseButtonProps = { programme: "synapse" as const, size: "lg" as const };

const meta: Meta<typeof IdsModal> = {
  title: "Spec Generated/Synapse/Modal",
  component: IdsModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Modal (IDS-fork). Source: \`${SYNAPSE_MODAL_DESIGN_SPEC_PATH}\`.`,
          `Composition: \`IdsModal.Title\` → \`IdsModal.Body\` → \`IdsModal.Footer\`. Figma: \`${SYNAPSE_MODAL_MAIN_NODE_ID}\`.`,
          "Per-type dialog stories: **Modal/Dialog** subgroup.",
        ].join(" "),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IdsModal>;

function logEvent(name: string) {
  return () => {
    // eslint-disable-next-line no-console
    console.log(`[Synapse Modal event] ${name}`);
  };
}

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: () => (
    <IdsModal
      trigger={<Button {...synapseButtonProps}>Open Non-Alerting Dialog</Button>}
      scenario="dialog"
      type="non-alerting"
      size="large"
      defaultOpen={false}
      onClose={logEvent("onClose")}
    >
      <IdsModal.Title>Non-Alerting</IdsModal.Title>
      <IdsModal.Body description={MODAL_FIGMA_BODY} />
      <IdsModal.Footer>
        <Button {...synapseButtonProps} onClick={logEvent("onPrimaryAction")}>
          Close
        </Button>
      </IdsModal.Footer>
    </IdsModal>
  ),
};

export const SinglePageModalUsage: Story = {
  name: "Single-Page Modal Usage",
  render: () => (
    <IdsModal
      trigger={<Button {...synapseButtonProps} variant="secondary">Open Single-Page Modal</Button>}
      scenario="single-page"
      type="non-alerting"
      size="large"
      defaultOpen={false}
      onClose={logEvent("onClose")}
    >
      <IdsModal.Title>Header</IdsModal.Title>
      <IdsModal.Body description="Single-page modal usage.">
        <div
          style={{
            minHeight: 120,
            border: "1px solid var(--color-border-brand-base)",
            background: "var(--color-background-brand-lighter)",
            padding: 16,
          }}
        >
          single page modal swap content
        </div>
      </IdsModal.Body>
      <IdsModal.Footer>
        <Button {...synapseButtonProps} variant="tertiary">
          Cancel
        </Button>
        <Button {...synapseButtonProps}>Apply</Button>
      </IdsModal.Footer>
    </IdsModal>
  ),
};

export const MultiPageModalUsage: Story = {
  name: "Multi-Page Modal Usage",
  render: () => (
    <IdsModal
      trigger={<Button {...synapseButtonProps} variant="secondary">Open Multi-Page Modal</Button>}
      scenario="multi-page"
      type="non-alerting"
      size="large"
      defaultOpen={false}
      onClose={logEvent("onClose")}
    >
      <IdsModal.Title>Header</IdsModal.Title>
      <IdsModal.Body description="multi page modal usage with tabs/pages">
        <SynapseTabs
          items={[
            { id: "summary", label: "Summary", panel: <div style={{ padding: 8 }}>Summary content</div> },
            { id: "details", label: "Details", panel: <div style={{ padding: 8 }}>Details content</div> },
            { id: "activity", label: "Activity", panel: <div style={{ padding: 8 }}>Activity content</div> },
          ]}
          showAddTab={false}
          minTabWidth={80}
          maxTabWidth={220}
          moreLabel="More"
        />
      </IdsModal.Body>
      <IdsModal.Footer>
        <Button {...synapseButtonProps} variant="tertiary">
          Cancel
        </Button>
        <Button {...synapseButtonProps}>Apply</Button>
      </IdsModal.Footer>
    </IdsModal>
  ),
};
