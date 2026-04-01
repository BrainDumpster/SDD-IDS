import type { Meta, StoryObj } from "@storybook/react";
import chartPieIcon from "../../../assets/icons/chart-pie.svg";
import reportChargeBackIcon from "../../../assets/icons/report-charge-back.svg";
import settingsGearDetailedIcon from "../../../assets/icons/settings-gear-detailed.svg";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Synapse/Tabs",
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    items: [
      {
        id: "overview",
        label: "Overview",
        panel:
          "Overview panel content. This shows the high-level summary of the selected item.",
      },
      {
        id: "details",
        label: "Details",
        panel:
          "Details panel content with more granular information about configuration and settings.",
      },
      {
        id: "activity",
        label: "Activity",
        panel: "Recent activity log showing the latest events and changes.",
      },
    ],
  },
};

export const ClosableTabs: Story = {
  args: {
    items: [
      { id: "active", label: "Active", panel: "This tab is active.", closable: true },
      { id: "pending", label: "Pending", panel: "This tab is pending.", closable: true },
      { id: "archived", label: "Archived", panel: "Archived content.", closable: true },
    ],
  },
};

export const WithIconAndLongLabels: Story = {
  args: {
    items: [
      {
        id: "analytics",
        label: "Analytics and Observability Summary Very Long Label",
        panel: "Analytics content",
        icon: <img src={chartPieIcon} alt="" />,
        closable: true,
      },
      {
        id: "reports",
        label: "Reports and Scheduling",
        panel: "Reports content",
        icon: <img src={reportChargeBackIcon} alt="" />,
        closable: true,
      },
      {
        id: "settings",
        label: "System Settings",
        panel: "Settings content",
        icon: <img src={settingsGearDetailedIcon} alt="" />,
        closable: true,
      },
    ],
    showAddTab: true,
  },
};

export const OverflowWithMore: Story = {
  args: {
    items: [
      { id: "1", label: "Dashboard", panel: "Dashboard content", closable: true },
      { id: "2", label: "Analytics", panel: "Analytics content", closable: true },
      { id: "3", label: "Reports", panel: "Reports content", closable: true },
      { id: "4", label: "Settings", panel: "Settings content", closable: true },
      { id: "5", label: "Users", panel: "Users content", closable: true },
      { id: "6", label: "Activity", panel: "Activity content", closable: true },
      { id: "7", label: "Audit Trail", panel: "Audit content", closable: true },
      { id: "8", label: "Integrations", panel: "Integrations content", closable: true },
    ],
    showAddTab: true,
    minTabWidth: 80,
    maxTabWidth: 250,
  },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Tabs {...args} />
    </div>
  ),
};

export const WithDisabled: Story = {
  args: {
    items: [
      { id: "active", label: "Active", panel: "This tab is active." },
      { id: "pending", label: "Pending", panel: "This tab is pending." },
      { id: "archived", label: "Archived", panel: "Archived content.", disabled: true },
    ],
  },
};
