import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { IdsSettingsMenu } from "./IdsSettingsMenu";
import "../../../../components/dap-theme.css";
import {
  IDS_SETTINGS_MENU_DESIGN_SPEC_PATH,
  SETTINGS_MENU_API_DEFAULTS,
  SETTINGS_MENU_DEFAULT_ITEMS,
} from "../../spec-contracts/ids-settings-menu.contract";

const meta: Meta<typeof IdsSettingsMenu> = {
  title: "DAP/Settings Menu",
  component: IdsSettingsMenu,
  parameters: {
    docs: {
      description: {
        component: `Spec-driven IDS Settings Menu aligned to \`${IDS_SETTINGS_MENU_DESIGN_SPEC_PATH}\` (WIP IDS Library node \`46812:246786\)`,
      },
    },
  },
  args: {
    ...SETTINGS_MENU_API_DEFAULTS,
    items: SETTINGS_MENU_DEFAULT_ITEMS,
  },
};

export default meta;
type Story = StoryObj<typeof IdsSettingsMenu>;

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
        <IdsSettingsMenu
          {...args}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    );
  },
};
