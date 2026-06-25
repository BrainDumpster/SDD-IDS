import { useMemo } from "react";
import { SynapseDropdownMenu } from "../SynapseDropdownMenu";
import { TopologyFilterChip } from "./TopologyFilterChip";
import {
  SYNAPSE_TOPOLOGY_STATUS_FILTER_OPTIONS,
  type TopologyStatusFilterValue,
} from "../../spec-contracts/topology/synapse-topology.contract";

export interface TopologyStatusFilterProps {
  value?: TopologyStatusFilterValue;
  defaultValue?: TopologyStatusFilterValue;
  onValueChange?: (value: TopologyStatusFilterValue) => void;
  defaultOpen?: boolean;
  disabled?: boolean;
}

function labelForValue(value: TopologyStatusFilterValue): string {
  return SYNAPSE_TOPOLOGY_STATUS_FILTER_OPTIONS.find((option) => option.value === value)?.label ?? "All";
}

export function TopologyStatusFilter({
  value = "all",
  onValueChange,
  defaultOpen = false,
  disabled = false,
}: TopologyStatusFilterProps) {
  const selectedLabel = labelForValue(value);

  const items = useMemo(
    () =>
      SYNAPSE_TOPOLOGY_STATUS_FILTER_OPTIONS.map((option) => ({
        id: option.value,
        value: option.value,
        label: option.label,
        selectable: true,
        selected: option.value === value,
        onClick: () => onValueChange?.(option.value),
      })),
    [onValueChange, value],
  );

  return (
    <SynapseDropdownMenu
      trigger={<TopologyFilterChip value={selectedLabel} />}
      items={items}
      selectionMode="single"
      selectedValues={[value]}
      showSingleSelectRadio
      matchTriggerWidth
      detached
      defaultOpen={defaultOpen}
      disabled={disabled}
      sideOffset={4}
      maxHeight={280}
    />
  );
}
