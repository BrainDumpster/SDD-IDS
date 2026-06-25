import { SynapseSliderWithButtons } from "../SynapseSliderWithButtons";
import {
  SYNAPSE_TOPOLOGY_ZOOM_MAX_PERCENT,
  SYNAPSE_TOPOLOGY_ZOOM_MIN_PERCENT,
  SYNAPSE_TOPOLOGY_ZOOM_STEP_PERCENT,
} from "../../spec-contracts/topology/synapse-topology.contract";

export interface TopologyZoomSliderProps {
  value: number;
  onChange: (percent: number) => void;
}

function clampZoom(percent: number): number {
  return Math.min(SYNAPSE_TOPOLOGY_ZOOM_MAX_PERCENT, Math.max(SYNAPSE_TOPOLOGY_ZOOM_MIN_PERCENT, percent));
}

/** Slider with buttons (`53949:279842`) — delegates to `SynapseSliderWithButtons`. */
export function TopologyZoomSlider({ value, onChange }: TopologyZoomSliderProps) {
  return (
    <SynapseSliderWithButtons
      aria-label="Zoom"
      min={SYNAPSE_TOPOLOGY_ZOOM_MIN_PERCENT}
      max={SYNAPSE_TOPOLOGY_ZOOM_MAX_PERCENT}
      step={1}
      value={value}
      decrementStep={SYNAPSE_TOPOLOGY_ZOOM_STEP_PERCENT}
      incrementStep={SYNAPSE_TOPOLOGY_ZOOM_STEP_PERCENT}
      onChange={(next) => onChange(clampZoom(next))}
      readout={`${value}%`}
      buttonVariant="tertiary"
    />
  );
}
