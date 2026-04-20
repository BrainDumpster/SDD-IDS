import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { IdsLeftNavigation } from "./IdsLeftNavigation";
import {
  IDS_LEFT_NAVIGATION_DESIGN_SPEC_PATH,
  LEFT_NAVIGATION_API_DEFAULTS,
  LEFT_NAVIGATION_DEFAULT_ITEMS,
} from "../../spec-contracts/ids-left-navigation.contract";

const meta: Meta<typeof IdsLeftNavigation> = {
  title: "IDS/DAP/Left Navigation",
  component: IdsLeftNavigation,
  parameters: {
    docs: {
      description: {
        component: `Spec-driven IDS Left Navigation aligned to \`${IDS_LEFT_NAVIGATION_DESIGN_SPEC_PATH}\` (WIP IDS Library node \`46812:246786\`).`,
      },
    },
  },
  args: {
    ...LEFT_NAVIGATION_API_DEFAULTS,
    items: LEFT_NAVIGATION_DEFAULT_ITEMS,
  },
};

export default meta;
type Story = StoryObj<typeof IdsLeftNavigation>;

export const Default: Story = {
  render: (args) => {
    const [selectedId, setSelectedId] = useState(args.defaultSelectedId);
    return (
      <div
        style={{
          background: "var(--color-background-surface-1)",
          padding: 24,
          minHeight: 1050,
        }}
      >
        <IdsLeftNavigation
          {...args}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    );
  },
};

