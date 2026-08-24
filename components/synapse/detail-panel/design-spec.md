# Detail Panel Design Spec (Synapse)

## Metadata
- Component: Detail Panel
- Design System: Synapse
- Pattern: IDS-fork (`ids-fork`)
- IDS baseline: `components/ids/detail-panel/design-spec.md`
- Contract: `component-contracts/synapse/detail-panel.contract.ts`

## Composition & API (runtime)

Inherits IDS composition API (`IdsDetailPanel` / `SynapseDetailPanel`):

```
SynapseDetailPanel [attachMode, isExpanded, …]
  SynapseDetailPanel.Content
    SynapseDetailPanel.Header
      SynapseDetailPanel.Title
    SynapseDetailPanel.Body
    SynapseDetailPanel.Footer
  SynapseDetailPanel.CollapsedRail
    SynapseDetailPanel.ToggleButton
```

Events: `onExpandedChange`, `onOpened`, `onClosed` (IDS parity).

## Source Mapping
- IDS baseline spec: `components/ids/detail-panel/design-spec.md`
- Synapse contract: `component-contracts/synapse/detail-panel.contract.ts`
- React reference: `storybook/src/components/SynapseDetailPanel.tsx` (re-exports IDS implementation)
- Storybook: `storybook/src/components/SynapseDetailPanel.stories.tsx`
