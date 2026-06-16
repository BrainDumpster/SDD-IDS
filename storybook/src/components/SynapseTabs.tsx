import { Tabs, type TabItem, type TabsSurface } from "./Tabs";

export type { TabItem as SynapseTabItem };

export interface SynapseTabsProps {
  items: TabItem[];
  defaultActiveTabId?: string;
  showAddTab?: boolean;
  onAddTab?: () => void;
  addTabLabel?: string;
  minTabWidth?: number;
  maxTabWidth?: number;
  moreLabel?: string;
  surface?: TabsSurface;
}

/**
 * Synapse Nav Tab — `Tabs` with `programme="synapse"` (Figma `47807:3185`).
 */
export function SynapseTabs({
  addTabLabel = "Add tab",
  surface = "elevated",
  ...rest
}: SynapseTabsProps) {
  return (
    <Tabs
      programme="synapse"
      variant="secondary"
      surface={surface}
      addTabLabel={addTabLabel}
      {...rest}
    />
  );
}
