/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/dashboard`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsDashboard as SynapseDashboard,
  IdsDashboardCompound as SynapseDashboardCompound,
  IdsDashboardGrid as SynapseDashboardGrid,
  IdsDashboardItem as SynapseDashboardItem,
  type IdsDashboardProps as SynapseDashboardProps,
  type IdsDashboardGridProps as SynapseDashboardGridProps,
  type IdsDashboardItemProps as SynapseDashboardItemProps,
  type DashboardSlotName as SynapseDashboardSlotName,
  type DashboardMainSlots as SynapseDashboardMainSlots,
} from "../../ids/dashboard";
